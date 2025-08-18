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
  const [backgroundClass, setBackgroundClass] = useState('');

  useEffect(() => {
    // Create a unique class name based on the fallbackImage path
    const className = `bg-image-${Math.random().toString(36).substring(2, 9)}`;
    
    // Create a style tag with the background image
    const style = document.createElement('style');
    style.innerHTML = `.${className} { background-image: url(${fallbackImage}); }`;
    document.head.appendChild(style);
    
    // Set the class name to be used
    setBackgroundClass(className);
    
    // Cleanup function to remove the style tag
    return () => {
      document.head.removeChild(style);
    };
  }, [fallbackImage]);


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
        className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat ${backgroundClass} ${className}`}
        data-testid="battlefield-fallback"
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
      className={`absolute inset-0 w-full h-full object-cover brightness-[0.8] contrast-[1.1] saturate-[0.9] ${className}`}
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