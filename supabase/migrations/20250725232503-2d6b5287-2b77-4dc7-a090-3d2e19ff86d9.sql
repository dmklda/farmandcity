-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create games table for game sessions
CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_state JSONB NOT NULL,
  turn INTEGER NOT NULL DEFAULT 1,
  phase TEXT NOT NULL DEFAULT 'draw',
  is_finished BOOLEAN NOT NULL DEFAULT false,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on games
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Create policies for games
CREATE POLICY "Users can view their own games" 
ON public.games 
FOR SELECT 
USING (auth.uid() = player_id);

CREATE POLICY "Users can create their own games" 
ON public.games 
FOR INSERT 
WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Users can update their own games" 
ON public.games 
FOR UPDATE 
USING (auth.uid() = player_id);

-- Create player_cards table to track owned cards
CREATE TABLE public.player_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(player_id, card_id)
);

-- Enable RLS on player_cards
ALTER TABLE public.player_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for player_cards
CREATE POLICY "Users can view their own cards" 
ON public.player_cards 
FOR SELECT 
USING (auth.uid() = player_id);

CREATE POLICY "Users can manage their own cards" 
ON public.player_cards 
FOR ALL 
USING (auth.uid() = player_id);

-- Create game_history table for completed games
CREATE TABLE public.game_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  final_score INTEGER NOT NULL,
  turns_played INTEGER NOT NULL,
  resources_final JSONB NOT NULL,
  buildings_built INTEGER NOT NULL DEFAULT 0,
  landmarks_built INTEGER NOT NULL DEFAULT 0,
  game_duration_minutes INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on game_history
ALTER TABLE public.game_history ENABLE ROW LEVEL SECURITY;

-- Create policies for game_history
CREATE POLICY "Users can view their own game history" 
ON public.game_history 
FOR SELECT 
USING (auth.uid() = player_id);

CREATE POLICY "Users can insert their own game history" 
ON public.game_history 
FOR INSERT 
WITH CHECK (auth.uid() = player_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  );
  
  -- Give starter cards to new user
  INSERT INTO public.player_cards (player_id, card_id, quantity)
  VALUES 
    (NEW.id, 'starter-garden', 3),
    (NEW.id, 'starter-tent', 2),
    (NEW.id, 'starter-harvest', 2),
    (NEW.id, 'starter-farm', 2),
    (NEW.id, 'starter-workshop', 2),
    (NEW.id, 'starter-shop', 2);
    
  RETURN NEW;
END;
$$;

-- Create trigger for new user setup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();