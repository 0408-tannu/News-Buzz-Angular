import React from 'react';

const QuizLogo = ({ size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="quizBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6C63FF" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="quizAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
        <filter id="quizShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6C63FF" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Background rounded square */}
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#quizBg)" filter="url(#quizShadow)" />

      {/* Clipboard body */}
      <rect x="16" y="18" width="32" height="38" rx="4" fill="white" opacity="0.95" />

      {/* Clipboard clip */}
      <rect x="24" y="14" width="16" height="8" rx="3" fill="white" opacity="0.95" />
      <rect x="28" y="12" width="8" height="4" rx="2" fill="url(#quizAccent)" />

      {/* Checkmark line 1 */}
      <circle cx="22" cy="30" r="2.5" fill="#22C55E" />
      <rect x="28" y="28.5" width="16" height="3" rx="1.5" fill="#6C63FF" opacity="0.3" />

      {/* X mark line 2 */}
      <circle cx="22" cy="38" r="2.5" fill="#EF4444" />
      <rect x="28" y="36.5" width="12" height="3" rx="1.5" fill="#6C63FF" opacity="0.3" />

      {/* Checkmark line 3 */}
      <circle cx="22" cy="46" r="2.5" fill="#22C55E" />
      <rect x="28" y="44.5" width="14" height="3" rx="1.5" fill="#6C63FF" opacity="0.3" />

      {/* Question mark badge */}
      <circle cx="50" cy="16" r="10" fill="url(#quizAccent)" />
      <text
        x="50"
        y="21"
        textAnchor="middle"
        fontFamily="'Quicksand', Arial, sans-serif"
        fontWeight="800"
        fontSize="15"
        fill="#fff"
      >
        ?
      </text>

      {/* Sparkle top-left */}
      <path d="M10 10 L12 7 L14 10 L12 13 Z" fill="#FFD700" opacity="0.7" />

      {/* Sparkle bottom-right */}
      <path d="M52 52 L54 49 L56 52 L54 55 Z" fill="#FFD700" opacity="0.5" />
    </svg>
  );
};

export default QuizLogo;
