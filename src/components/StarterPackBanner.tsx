import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { Crown, Check, Target, ArrowRight, Star } from 'lucide-react';

interface StarterPackBannerProps {
  onRedeem?: () => void;
  onGoToDecks?: () => void;
}

export const StarterPackBanner: React.FC<StarterPackBannerProps> = ({ 
  onRedeem, 
  onGoToDecks 
}) => {
  const { user } = useAuth();
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkIfRedeemed();
  }, [user]);

  const checkIfRedeemed = async () => {
    if (!user?.email) return;

    try {
      const { data, error } = await supabase
        .from('player_cards')
        .select(`
          quantity,
          cards (
            is_starter
          )
        `)
        .eq('player_id', user.id)
        .eq('cards.is_starter', true)
        .limit(1);

      if (error) throw error;
      setRedeemed(data && data.length > 0);
    } catch (err) {
      console.error('Erro ao verificar pacote:', err);
    }
  };

  const handleRedeem = async () => {
    if (!user?.email) {
      setError('Você precisa estar logado para resgatar o pacote');
      return;
    }

    try {
      setRedeeming(true);
      setError(null);

      const { data, error } = await supabase.rpc('redeem_starter_pack', {
        user_email: user.email
      });

      if (error) throw error;

      setRedeemed(true);
      onRedeem?.();
    } catch (err: any) {
      console.error('Erro ao resgatar pacote:', err);
      setError(err.message || 'Erro ao resgatar o pacote iniciante');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      <div className="relative bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-2xl border-2 border-orange-400/30 overflow-hidden shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10zm0 0c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        {/* Top Right Star */}
        <div className="absolute top-4 right-4">
          <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
        </div>

        {/* Bottom Left Crown */}
        <div className="absolute bottom-4 left-4">
          <Crown className="w-5 h-5 text-yellow-400" />
        </div>

        <div className="relative p-8">
          <div className="flex items-center gap-6">
            {/* Left Side - Icon */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-orange-300/50">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎁</span>
                </div>
              </div>
            </div>

            {/* Center - Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-yellow-400">
                  Pacote Iniciante Real
                </h2>
                <Badge className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  NOVO!
                </Badge>
              </div>

              <p className="text-yellow-300 text-lg mb-2">
                40 cartas básicas para iniciar sua jornada no reino
              </p>

              <div className="flex items-center gap-4 text-yellow-300 text-sm">
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  <span>Exclusivo para novos jogadores</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>100% GRÁTIS</span>
                </div>
              </div>

              {!redeemed && (
                <div className="mt-4 p-3 bg-amber-800/50 rounded-lg border border-amber-600/30">
                  <p className="text-yellow-200 text-sm">
                    Próximo passo: Após resgatar, crie seu primeiro deck para começar a jogar!
                  </p>
                </div>
              )}
            </div>

            {/* Right Side - Action */}
            <div className="flex-shrink-0">
              {redeemed ? (
                <div className="text-center">
                  <div className="bg-green-600 rounded-xl p-4 mb-3 border-2 border-green-400/50">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-white" />
                      <Check className="w-5 h-5 text-green-300" />
                    </div>
                    <p className="text-white font-bold text-sm">Pacote Resgatado!</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-yellow-300 text-sm mb-3">
                    <Target className="w-4 h-4 text-pink-400" />
                    <span>Agora crie seu primeiro deck para começar a jogar!</span>
                  </div>
                  
                  <Button
                    onClick={onGoToDecks}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg underline"
                  >
                    Ir para Arsenal Real <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Button
                    onClick={handleRedeem}
                    disabled={redeeming || !user}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg border-2 border-green-400/50"
                  >
                    {redeeming ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Resgatando...
                      </>
                    ) : (
                      '🎁 Resgatar Pacote'
                    )}
                  </Button>
                  
                  {!user && (
                    <p className="text-yellow-300 text-sm mt-2">
                      Faça login para resgatar o pacote
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-600/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

