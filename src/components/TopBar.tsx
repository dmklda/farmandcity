import React from 'react';

interface TopBarProps {
  turn: number;
  turnMax: number;
  buildCount: number;
  buildMax: number;
  phase: string;
  onNextPhase: () => void;
  discardMode?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ turn, turnMax, buildCount, buildMax, phase, onNextPhase, discardMode }) => (
  <header className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex items-center justify-between box-border gap-4 relative overflow-hidden">
    {/* Animated background pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse"></div>
    </div>
    
    {/* Logo section */}
    <div className="flex items-center gap-3 relative z-10">
      <div className="relative">
        <span className="text-2xl animate-bounce" role="img" aria-label="coroa">👑</span>
        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm opacity-30 animate-ping"></div>
      </div>
      <h1 className="font-black text-2xl tracking-tight bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
        Famand
      </h1>
    </div>

    {/* Game stats */}
    <div className="flex items-center gap-4 relative z-10">
      <div className="relative group">
        <div className="bg-slate-800/80 backdrop-blur-sm border-2 border-blue-500 rounded-xl px-4 py-2 font-bold text-lg tracking-wide transition-all duration-300 group-hover:border-blue-400 group-hover:bg-slate-700/80 group-hover:scale-105">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Turno: {turn}/{turnMax}
          </div>
        </div>
        <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="relative group">
        <div className="bg-slate-800/80 backdrop-blur-sm border-2 border-amber-500 rounded-xl px-4 py-2 font-bold text-lg tracking-wide transition-all duration-300 group-hover:border-amber-400 group-hover:bg-slate-700/80 group-hover:scale-105">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            Construções: {buildCount}/{buildMax}
          </div>
        </div>
        <div className="absolute inset-0 bg-amber-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="relative group">
        <div className="bg-slate-800/80 backdrop-blur-sm border-2 border-emerald-500 rounded-xl px-4 py-2 font-bold text-lg tracking-wide transition-all duration-300 group-hover:border-emerald-400 group-hover:bg-slate-700/80 group-hover:scale-105">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Fase: {phase.toUpperCase()}
          </div>
        </div>
        <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>

    {/* Next phase button */}
    <div className="relative z-10">
      <button
        onClick={onNextPhase}
        disabled={discardMode}
        className={`
          relative px-8 py-3 rounded-xl font-bold text-lg border-2 transition-all duration-300 transform
          ${discardMode 
            ? 'bg-slate-700 border-slate-600 text-slate-400 cursor-not-allowed opacity-50' 
            : 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500 text-white hover:from-blue-500 hover:to-blue-600 hover:border-blue-400 hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-xl'
          }
        `}
      >
        <span className="relative z-10 flex items-center gap-2">
          <span className="text-xl">→</span>
          Próxima Fase
        </span>
        {!discardMode && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl blur-md opacity-0 hover:opacity-50 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl"></div>
          </>
        )}
      </button>
    </div>
  </header>
);

export default TopBar; 