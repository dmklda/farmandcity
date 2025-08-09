import React from 'react';
import { Button } from './ui/button';
import { User, LogOut, Settings, Crown, Shield, Sword } from 'lucide-react';

interface MedievalHeaderProps {
  user: any;
  hasAdminAccess: boolean;
  onShowPlayerStats: () => void;
  onLogout: () => void;
}

export const MedievalHeader: React.FC<MedievalHeaderProps> = ({
  user,
  hasAdminAccess,
  onShowPlayerStats,
  onLogout
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Header Background with Medieval Texture */}
      <div className="relative bg-gradient-to-b from-slate-900/95 via-purple-900/90 to-slate-900/95 backdrop-blur-md border-b border-purple-500/30 shadow-2xl">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60"></div>
        
        {/* Subtle Medieval Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-6">
              {/* Medieval Logo */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative p-3 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-xl border border-purple-400/50 shadow-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-inner">
                    <Crown className="w-6 h-6 text-slate-900" />
                  </div>
                </div>
              </div>
              
              {/* Title Section */}
              <div className="relative">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent tracking-wide">
                  Farmand
                </h1>
                <p className="text-xs text-purple-300/80 font-medium tracking-wider uppercase">
                  Império Medieval
                </p>
                {/* Decorative line */}
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60"></div>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4">
              {/* Online Status */}
              <div className="flex items-center space-x-2 text-purple-200/90 text-sm font-medium">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <span className="tracking-wide">Online</span>
              </div>
              
              {/* Profile Button */}
              <Button
                onClick={onShowPlayerStats}
                variant="outline"
                size="sm"
                className="relative group bg-slate-800/60 hover:bg-slate-700/60 border-purple-500/30 hover:border-purple-400/50 text-purple-200 hover:text-purple-100 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <User className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10 font-medium">Perfil</span>
              </Button>
                
              {/* Admin Button */}
              {hasAdminAccess && (
                <Button
                  onClick={() => window.location.href = '/admin/debug'}
                  variant="outline"
                  size="sm"
                  className="relative group bg-purple-900/40 hover:bg-purple-800/40 border-purple-500/50 hover:border-purple-400/60 text-purple-300 hover:text-purple-200 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Settings className="h-4 w-4 mr-2 relative z-10" />
                  <span className="relative z-10 font-medium">Admin</span>
                </Button>
              )}
              
              {/* Logout Button */}
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="relative group bg-red-900/40 hover:bg-red-800/40 border-red-500/50 hover:border-red-400/60 text-red-300 hover:text-red-200 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <LogOut className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10 font-medium">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
