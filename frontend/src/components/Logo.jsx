import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Logo = ({ height = 50 }) => {
  const { mode } = useContext(ThemeContext);
  const textColor = mode === 'dark' ? '#ffffff' : '#1a1a2e';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 64"
      height={height}
      fill="none"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="logoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4facfe" />
          <stop offset="100%" stopColor="#0066ff" />
        </linearGradient>
        <linearGradient id="logoOrange" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff9a56" />
          <stop offset="100%" stopColor="#ff5e62" />
        </linearGradient>
        <filter id="logoShadow" x="-10%" y="-10%" width="130%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0066ff" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Icon: Globe/newspaper hybrid */}
      <g filter="url(#logoShadow)">
        <circle cx="30" cy="32" r="24" fill="url(#logoBlue)" />
        {/* Lightning bolt / breaking news flash */}
        <path
          d="M24 18l8 0l-3 10h6l-12 18l3-12h-6z"
          fill="white"
          opacity="0.95"
        />
      </g>

      {/* "News" text - bold dark */}
      <text
        x="64"
        y="43"
        fontFamily="'Quicksand', 'Poppins', sans-serif"
        fontSize="34"
        fontWeight="800"
        fill={textColor}
        letterSpacing="-0.5"
      >
        News
      </text>

      {/* "Buzz" text - gradient blue */}
      <text
        x="168"
        y="43"
        fontFamily="'Quicksand', 'Poppins', sans-serif"
        fontSize="34"
        fontWeight="800"
        fill="url(#logoBlue)"
        letterSpacing="-0.5"
      >
        Buzz
      </text>

      {/* Underline accent bar */}
      <rect x="168" y="48" width="55" height="3.5" rx="2" fill="url(#logoOrange)" />

      {/* Small dot indicator */}
      <circle cx="263" cy="42" r="5" fill="url(#logoOrange)" />
    </svg>
  );
};

export default Logo;
