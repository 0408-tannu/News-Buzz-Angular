import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Logo = ({ height = 44 }) => {
  const { mode } = useContext(ThemeContext);
  const textColor = mode === 'dark' ? '#f0f0f0' : '#1a1a2e';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 260 56"
      height={height}
      fill="none"
    >
      <defs>
        <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e90ff" />
          <stop offset="100%" stopColor="#0055cc" />
        </linearGradient>
        <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#e63946" />
        </linearGradient>
      </defs>

      {/* Icon: Rounded square with "N" */}
      <rect x="4" y="8" width="40" height="40" rx="10" fill="url(#logoGrad1)" />

      {/* Letter N inside the icon */}
      <path
        d="M14 38V18h3l12 14V18h3v20h-3L17 24v14h-3z"
        fill="white"
      />

      {/* Buzz signal waves */}
      <path
        d="M42 16c3-3 7-4 7 0s-4 3-7 0"
        stroke="url(#logoGrad2)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M44 10c5-4 10-5 10 0s-5 4-10 0"
        stroke="url(#logoGrad2)"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M46 5c6-4 12-5 12 0s-6 4-12 0"
        stroke="url(#logoGrad2)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* "News" text */}
      <text
        x="62"
        y="38"
        fontFamily="'Quicksand', 'Segoe UI', sans-serif"
        fontSize="30"
        fontWeight="700"
        fill={textColor}
      >
        News
      </text>

      {/* "Buzz" text with gradient */}
      <text
        x="155"
        y="38"
        fontFamily="'Quicksand', 'Segoe UI', sans-serif"
        fontSize="30"
        fontWeight="700"
        fill="url(#logoGrad1)"
      >
        Buzz
      </text>

      {/* Accent dot */}
      <circle cx="243" cy="35" r="4" fill="url(#logoGrad2)" />
    </svg>
  );
};

export default Logo;
