import React, { useEffect, useState } from 'react';

export default function Intro({ onComplete }) {
  const [stage, setStage] = useState('entering');

  useEffect(() => {
    // Stage 1: Displaying the text
    const displayTimer = setTimeout(() => {
      setStage('exiting');
    }, 1800); // Wait 1.8 seconds before fading out

    // Stage 2: Tell parent to remove intro
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2600); // 1.8 + 0.8s exit animation

    return () => {
      clearTimeout(displayTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: stage === 'exiting' ? 'transparent' : '#040b16', // Deep space blue background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      transition: 'background 0.8s ease-out',
      pointerEvents: 'none'
    }}>
      <h1 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: '4.5rem',
        fontWeight: 300,
        background: 'linear-gradient(135deg, #ffffff 0%, #00f0ff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '0.15em',
        textTransform: 'lowercase',
        animation: stage === 'exiting'
          ? 'burnOut 0.8s ease-in forwards'
          : 'introTrackIn 1.8s ease-out forwards',
      }}>
        voitheia
      </h1>
      <style>{`
        @keyframes introTrackIn {
          0% { transform: scale(0.96); opacity: 0; filter: blur(4px); letter-spacing: 0.1em; text-shadow: 0 0 0 rgba(0, 240, 255, 0); }
          50% { opacity: 1; filter: blur(0); }
          100% { transform: scale(1); letter-spacing: 0.15em; filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.4)); opacity: 1; }
        }
        @keyframes burnOut {
          0% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.4)) brightness(1); letter-spacing: 0.15em; }
          50% { filter: drop-shadow(0 0 40px rgba(0, 240, 255, 0.8)) blur(2px) brightness(1.5); }
          100% { transform: scale(1.15); filter: drop-shadow(0 0 100px rgba(0, 240, 255, 1)) blur(15px) brightness(2); letter-spacing: 0.2em; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
