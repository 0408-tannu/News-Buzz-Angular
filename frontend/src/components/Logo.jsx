import React from 'react';

const Logo = ({ height = 44 }) => {
  const iconSize = height;
  const fontSize = height * 0.45;
  const id = React.useId().replace(/:/g, '');

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', filter: 'drop-shadow(0 2px 6px rgba(30,144,255,0.3))' }}
      >
        <defs>
          <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="50%" stopColor="#1E90FF" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id={`${id}-shine`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </linearGradient>
          <linearGradient id={`${id}-bolt`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <filter id={`${id}-glow`}>
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Background shape - squircle */}
        <rect x="2" y="2" width="44" height="44" rx="14" fill={`url(#${id}-bg)`} />
        
        {/* Shine overlay */}
        <rect x="2" y="2" width="44" height="44" rx="14" fill={`url(#${id}-shine)`} />
        
        {/* Newspaper fold lines */}
        <path d="M12 14 H28" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 20 H25" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 25 H22" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 30 H20" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Lightning bolt - "Buzz" */}
        <path
          d="M30 12 L26 23 H31 L27 36"
          stroke={`url(#${id}-bolt)`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter={`url(#${id}-glow)`}
        />
        
        {/* Notification dot */}
        <circle cx="38" cy="10" r="4" fill="#FF4757" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
        <circle cx="38" cy="10" r="1.5" fill="rgba(255,255,255,0.6)" />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 800,
          fontSize: `${fontSize}px`,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #0EA5E9 0%, #1E90FF 40%, #6366F1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          userSelect: 'none',
        }}>
          News<span style={{
            background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Buzz</span>
        </span>
      </div>
    </div>
  );
};

export default Logo;
