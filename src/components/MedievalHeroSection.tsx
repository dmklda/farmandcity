import React from 'react';
import { Button } from './ui/button';
import { Play, Sword, Crown, Zap, Shield, AlertTriangle } from 'lucide-react';

interface MedievalHeroSectionProps {
  userName: string;
  onStartGame: () => void;
  onSelectGameMode: () => void;
  onGoToDecks: () => void;
  decks: any[];
}

export const MedievalHeroSection: React.FC<MedievalHeroSectionProps> = React.memo(({
  userName,
  onStartGame,
  onSelectGameMode,
  onGoToDecks,
  decks
}) => {
  const hasActiveDeck = decks && decks.length > 0;
  const isDecksLoading = !decks; // Se decks é null/undefined, ainda está carregando
  return (
    <div className="space-y-8">
      {/* Main Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background with Medieval Texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/60 to-blue-900/60 backdrop-blur-sm border border-purple-500/30 rounded-3xl shadow-2xl">
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-600/20 to-transparent rounded-full blur-3xl"></div>
          
          {/* Subtle Medieval Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10 p-8 lg:p-12">
          {/* Welcome Text */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4 tracking-wide">
                Bem-vindo de volta, {userName}!
              </h2>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 blur-2xl opacity-20 -z-10"></div>
            </div>
            
            <p className="text-xl lg:text-2xl text-purple-200/90 mb-6 font-medium">
              Seu império medieval aguarda sua sabedoria
            </p>
            
            {/* Decorative Divider */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-purple-400"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-purple-400"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {isDecksLoading ? (
              <>
                {/* Loading State */}
                <Button 
                  disabled
                  className="relative group bg-slate-700/50 text-slate-400 font-bold px-10 py-4 text-lg transition-all duration-300 border border-slate-600/50 cursor-not-allowed"
                >
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                  <span>Carregando...</span>
                </Button>
              </>
            ) : hasActiveDeck ? (
              <>
                {/* Game Mode Button - Enabled */}
                <Button 
                  onClick={onSelectGameMode}
                  className="relative group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold px-10 py-4 text-lg transition-all duration-300 hover:scale-105 shadow-2xl shadow-green-500/25 border border-green-400/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Play className="h-6 w-6 mr-3 relative z-10" />
                  <span className="relative z-10">Escolher Modo de Jogo</span>
                </Button>
                
                {/* Quick Game Button - Enabled */}
                <Button 
                  onClick={onStartGame}
                  variant="outline"
                  className="relative group bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-4 text-lg transition-all duration-300 backdrop-blur-sm border-purple-400/30 hover:border-purple-300/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Sword className="h-6 w-6 mr-3 relative z-10" />
                  <span className="relative z-10">Jogar Agora</span>
                </Button>
              </>
            ) : (
              <>
                {/* Create Deck Button - When no deck exists */}
                <Button 
                  onClick={onGoToDecks}
                  className="relative group bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold px-10 py-4 text-lg transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/25 border border-amber-400/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Shield className="h-6 w-6 mr-3 relative z-10" />
                  <span className="relative z-10">Criar Primeiro Deck</span>
                </Button>
                
                {/* Disabled Game Mode Button */}
                <Button 
                  disabled
                  className="relative group bg-slate-700/50 text-slate-400 font-bold px-10 py-4 text-lg transition-all duration-300 border border-slate-600/50 cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-700/20 rounded-lg"></div>
                  <Play className="h-6 w-6 mr-3 relative z-10" />
                  <span className="relative z-10">Escolher Modo de Jogo</span>
                </Button>
              </>
            )}
          </div>

          {/* Warning Message for New Players */}
          {!hasActiveDeck && (
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/30 rounded-xl backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <p className="text-amber-200/90 text-sm font-medium">
                  <strong>Novo jogador?</strong> Primeiro resgate o Pacote Iniciante e crie seu primeiro deck para começar a jogar!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
     );
 });
