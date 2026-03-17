import React from 'react';

const Logo = ({ height = 44 }) => {
  const iconSize = height;
  const fontSize = height * 0.48;
  const id = React.useId().replace(/:/g, '');

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', filter: 'drop-shadow(0 2px 8px rgba(30,144,255,0.25))' }}
      >
        <defs>
          <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E90FF" />
            <stop offset="100%" stopColor="#0055CC" />
          </linearGradient>
          <linearGradient id={`${id}-shine`} x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id={`${id}-bolt`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </linearGradient>
        </defs>

        {/* Background - rounded square */}
        <rect x="2" y="2" width="48" height="48" rx="15" fill={`url(#${id}-bg)`} />

        {/* Shine overlay for depth */}
        <rect x="2" y="2" width="48" height="48" rx="15" fill={`url(#${id}-shine)`} />

        {/* "N" letterform - bold, geometric */}
        <path
          d="M14 36V16H18.5L28 29V16H32V36H27.5L18.5 23.5V36H14Z"
          fill="white"
          opacity="0.95"
        />

        {/* Lightning bolt accent - represents "Buzz" / speed */}
        <path
          d="M34 14L30 24H35L31 34"
          stroke={`url(#${id}-bolt)`}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Live indicator dot */}
        <circle cx="42" cy="12" r="4" fill="#FF3B30" />
        <circle cx="42" cy="12" r="1.8" fill="rgba(255,255,255,0.5)" />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 800,
          fontSize: `${fontSize}px`,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #1E90FF 0%, #0055CC 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          userSelect: 'none',
        }}>
          News<span style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Buzz</span>
        </span>
      </div>
    </div>
  );
};

export default Logo;
