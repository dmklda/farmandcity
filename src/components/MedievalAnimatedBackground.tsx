import React from 'react';
import videoBackground from '../assets/main_background.mp4';

export const MedievalAnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'brightness(0.25) contrast(1.3) saturate(0.7) hue-rotate(5deg)',
        }}
      >
        <source src={videoBackground} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for better content readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Medieval gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-purple-900/40 to-blue-900/40"></div>

      {/* Subtle medieval texture overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='medieval' x='0' y='0' width='50' height='50' patternUnits='userSpaceOnUse'%3E%3Cpath d='M25 25c0-13.807-11.193-25-25-25s-25 11.193-25 25 11.193 25 25 25 25-11.193 25-25zm0 0c0 13.807 11.193 25 25 25s25-11.193 25-25-11.193-25-25-25-25 11.193-25 25z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23medieval)'/%3E%3C/svg%3E")`
      }}></div>

      {/* Floating medieval particles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Crown particles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-400/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-blue-400/20 rounded-full animate-bounce"></div>
        
        {/* Sword particles */}
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-green-400/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-red-400/20 rounded-full animate-ping"></div>
        <div className="absolute top-2/3 right-1/2 w-2.5 h-2.5 bg-indigo-400/30 rounded-full animate-bounce"></div>
        
        {/* Shield particles */}
        <div className="absolute top-1/6 left-1/6 w-2 h-2 bg-cyan-400/25 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/6 right-1/6 w-3 h-3 bg-pink-400/20 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 left-1/4 w-2 h-2 bg-orange-400/30 rounded-full animate-bounce"></div>
      </div>

      {/* Animated medieval grid pattern */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"></div>
      </div>

      {/* Gradient orbs for depth - Medieval themed */}
      <div className="absolute top-0 -left-4 w-80 h-80 bg-purple-500/8 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
      <div className="absolute top-0 -right-4 w-80 h-80 bg-yellow-500/8 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-80 h-80 bg-blue-500/8 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      
      {/* Additional medieval orbs */}
      <div className="absolute top-1/2 -left-8 w-60 h-60 bg-green-500/6 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-1000"></div>
      <div className="absolute bottom-1/2 -right-8 w-60 h-60 bg-red-500/6 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-3000"></div>

      {/* Subtle light rays effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse animation-delay-1000"></div>
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-pink-400 to-transparent animate-pulse animation-delay-2000"></div>
      </div>

      {/* Floating scroll effect */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl animate-float"></div>
      </div>
      
      <div className="absolute bottom-1/4 left-1/4 w-24 h-24 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-2xl animate-float animation-delay-2000"></div>
      </div>
    </div>
  );
};

// Custom animations for medieval theme
const customAnimations = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-20px) rotate(180deg); 
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
`;

export default MedievalAnimatedBackground;
