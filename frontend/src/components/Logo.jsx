import React from 'react';

const Logo = ({ height = 44 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
      <svg
        width={height}
        height={height}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="nbBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E90FF" />
            <stop offset="100%" stopColor="#0055CC" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="40" height="40" rx="12" fill="url(#nbBg)" />
        <path
          d="M14 10 L14 23 L24 14 L24 34 L28 34 L28 21 L18 30 L18 10 Z"
          fill="white"
          opacity="0.95"
        />
        <circle cx="33" cy="11" r="3.5" fill="#FFD700" />
      </svg>
      <span style={{
        fontFamily: "'Quicksand', sans-serif",
        fontWeight: 800,
        fontSize: `${height * 0.42}px`,
        letterSpacing: '-0.5px',
        background: 'linear-gradient(135deg, #1E90FF, #0055CC)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        userSelect: 'none',
      }}>
        NewsBuzz
      </span>
    </div>
  );
};

export default Logo;
