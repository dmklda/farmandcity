import React, { useRef, useEffect, useState } from 'react';

interface AnimatedBattlefieldBackgroundProps {
  videoUrl: string;
  fallbackImage?: string;
  className?: string;
}

export const AnimatedBattlefieldBackground: React.FC<AnimatedBattlefieldBackgroundProps> = ({
  videoUrl,
  fallbackImage = '/src/assets/boards_backgrounds/grid-board-background.jpg',
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);



  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      setHasError(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsVideoLoaded(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl]);

  if (hasError || !isVideoLoaded) {
    return (
      <div 
        className={`absolute inset-0 w-full h-full ${className}`}
        style={{ 
          backgroundImage: `url(${fallbackImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
      style={{
        filter: 'brightness(0.8) contrast(1.1) saturate(0.9)',
      }}
    >
      <source src={videoUrl} type="video/mp4" />
      {/* Fallback para imagem estática se vídeo não carregar */}
      <img 
        src={fallbackImage} 
        alt="Background fallback"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </video>
  );
}; 