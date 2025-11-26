import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 2 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Call onFinish after fade out completes
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2800);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="splash-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              {/* Leaf shape */}
              <path
                d="M50 10 Q30 30 30 50 Q30 70 50 90 Q70 70 70 50 Q70 30 50 10 Z"
                fill="#2d6a4f"
                className="leaf-main"
              />
              {/* Leaf vein */}
              <path
                d="M50 15 L50 85"
                stroke="#fff"
                strokeWidth="2"
                className="leaf-vein"
              />
              {/* Side veins */}
              <path
                d="M50 30 Q40 35 35 40 M50 50 Q40 55 35 60 M50 70 Q40 75 35 80"
                stroke="#fff"
                strokeWidth="1.5"
                fill="none"
                className="leaf-vein-side"
              />
              <path
                d="M50 30 Q60 35 65 40 M50 50 Q60 55 65 60 M50 70 Q60 75 65 80"
                stroke="#fff"
                strokeWidth="1.5"
                fill="none"
                className="leaf-vein-side"
              />
              {/* Droplet */}
              <circle cx="50" cy="50" r="8" fill="#52b788" className="droplet">
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
          <h1 className="splash-title">PesticideShop</h1>
          <p className="splash-tagline">Quality Agricultural Solutions</p>
        </div>
        
        <div className="splash-loader">
          <div className="loader-bar">
            <div className="loader-progress"></div>
          </div>
        </div>
      </div>

      {/* Animated particles */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
