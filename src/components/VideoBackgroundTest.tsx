import React from 'react';
import videoBackground from '../assets/social_u1116686729_Top-down_panoramic_view_of_a_fantasy_board_game_m_7d50ae5f-3639-4f24-84ae-9aca1f26cec0_3.mp4';

export const VideoBackgroundTest: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'brightness(0.3) contrast(1.2) saturate(0.8)',
        }}
      >
        <source src={videoBackground} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Test content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20">
          <h1 className="text-white text-2xl font-bold mb-4">Video Background Test</h1>
          <p className="text-white/80">If you can see this, the video background is working!</p>
        </div>
      </div>
    </div>
  );
};

export default VideoBackgroundTest; 
