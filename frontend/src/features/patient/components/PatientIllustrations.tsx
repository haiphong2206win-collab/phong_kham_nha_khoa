import React from 'react';

/**
 * Mascot Răng 3D với Khiên Y Tế xanh ngọc và dấu tích
 * Khớp chuẩn phong cách trang trí góc dưới Sidebar theo ảnh tham khảo
 */
export const ToothMascotWithShield: React.FC<{ className?: string }> = ({ className = "w-36 h-36" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      {/* Soft ambient mint glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D6F2EA]/80 via-[#E5F7F2]/60 to-transparent blur-xl" />
      
      <svg
        viewBox="0 0 200 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-md"
      >
        <defs>
          {/* Tooth Gradients */}
          <linearGradient id="toothBodyGrad" x1="40" y1="20" x2="130" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F0FAF7" />
            <stop offset="100%" stopColor="#D8EFE9" />
          </linearGradient>
          
          <linearGradient id="toothHighlight" x1="60" y1="20" x2="60" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
          </linearGradient>

          {/* Shield Gradients */}
          <linearGradient id="shieldGrad" x1="120" y1="90" x2="185" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="shieldBorder" x1="120" y1="80" x2="180" y2="165" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          <filter id="shieldShadow" x="110" y="80" width="80" height="90" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#065F46" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Ambient mint foliage / sparkle decor */}
        <path
          d="M32 145 C20 135 25 110 38 120 C42 124 45 140 32 145 Z"
          fill="#A7F3D0"
          opacity="0.8"
        />
        <path
          d="M25 125 C15 118 18 98 28 106 C32 110 33 122 25 125 Z"
          fill="#6EE7B7"
          opacity="0.6"
        />

        {/* Tooth Body Shadow */}
        <ellipse cx="85" cy="155" rx="55" ry="12" fill="#344C52" opacity="0.08" />

        {/* Tooth Body */}
        <path
          d="M 52 35
             C 65 24, 78 28, 86 35
             C 94 28, 107 24, 120 35
             C 134 47, 138 78, 134 105
             C 130 132, 115 152, 102 152
             C 95 152, 92 138, 86 138
             C 80 138, 77 152, 70 152
             C 57 152, 42 132, 38 105
             C 34 78, 38 47, 52 35 Z"
          fill="url(#toothBodyGrad)"
          stroke="#E2F2ED"
          strokeWidth="2"
        />

        {/* Tooth Glossy Highlight */}
        <path
          d="M 54 38
             C 63 30, 74 32, 82 38
             C 72 38, 48 55, 46 80
             C 44 65, 47 46, 54 38 Z"
          fill="url(#toothHighlight)"
        />

        {/* Cute Eyes */}
        <circle cx="68" cy="72" r="4.5" fill="#1E3A34" />
        <circle cx="66.5" cy="70" r="1.5" fill="#FFFFFF" />

        <circle cx="104" cy="72" r="4.5" fill="#1E3A34" />
        <circle cx="102.5" cy="70" r="1.5" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <circle cx="58" cy="80" r="5" fill="#FCA5A5" opacity="0.6" />
        <circle cx="114" cy="80" r="5" fill="#FCA5A5" opacity="0.6" />

        {/* Smiling Mouth */}
        <path
          d="M 80 82 Q 86 92 92 82"
          stroke="#1E3A34"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Medical Shield (Front Right) */}
        <g filter="url(#shieldShadow)">
          <path
            d="M 148 95
               C 168 95, 178 100, 178 100
               C 178 128, 168 152, 148 165
               C 128 152, 118 128, 118 100
               C 118 100, 128 95, 148 95 Z"
            fill="url(#shieldGrad)"
            stroke="url(#shieldBorder)"
            strokeWidth="3"
          />

          {/* Shield Inner Highlight */}
          <path
            d="M 148 100
               C 162 100, 170 104, 170 104
               C 170 118, 166 130, 148 142
               C 148 115, 148 105, 148 100 Z"
            fill="#FFFFFF"
            opacity="0.18"
          />

          {/* Shield White Checkmark */}
          <path
            d="M 137 128 L 145 136 L 160 120"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Sparkle Stars */}
        <path
          d="M 125 30 Q 128 35 133 36 Q 128 37 125 42 Q 124 37 119 36 Q 124 35 125 30 Z"
          fill="#34D399"
          opacity="0.8"
        />
        <path
          d="M 40 50 Q 42 54 46 55 Q 42 56 40 60 Q 39 56 35 55 Q 39 54 40 50 Z"
          fill="#FBBF24"
          opacity="0.85"
        />
      </svg>
    </div>
  );
};

/**
 * Minh họa Răng Niềng 3D cho Card "Tiến độ điều trị"
 */
export const ToothWithBraces: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 select-none ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        <defs>
          <linearGradient id="braceToothGrad" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F1FAF7" />
            <stop offset="100%" stopColor="#DCEDE7" />
          </linearGradient>

          <linearGradient id="bracketGrad" x1="0" y1="0" x2="10" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
        </defs>

        {/* Tooth Base */}
        <path
          d="M 28 20
             C 38 12, 47 15, 50 20
             C 53 15, 62 12, 72 20
             C 82 28, 85 48, 82 66
             C 80 82, 70 94, 62 94
             C 57 94, 55 86, 50 86
             C 45 86, 43 94, 38 94
             C 30 94, 20 82, 18 66
             C 15 48, 18 28, 28 20 Z"
          fill="url(#braceToothGrad)"
          stroke="#CEE7E0"
          strokeWidth="1.5"
        />

        {/* Eyes */}
        <circle cx="39" cy="42" r="3" fill="#1E3A34" />
        <circle cx="38" cy="41" r="1" fill="#FFFFFF" />
        <circle cx="61" cy="42" r="3" fill="#1E3A34" />
        <circle cx="60" cy="41" r="1" fill="#FFFFFF" />

        {/* Cheeks */}
        <circle cx="32" cy="48" r="3.5" fill="#FCA5A5" opacity="0.6" />
        <circle cx="68" cy="48" r="3.5" fill="#FCA5A5" opacity="0.6" />

        {/* Wire running across teeth */}
        <path
          d="M 24 60 Q 50 64 76 60"
          stroke="#64748B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Orthodontic Brackets */}
        {/* Left Bracket */}
        <rect x="30" y="54" width="9" height="11" rx="2" fill="url(#bracketGrad)" stroke="#475569" strokeWidth="1" />
        <circle cx="34.5" cy="59.5" r="1.5" fill="#0EA5E9" />

        {/* Center-Left Bracket */}
        <rect x="45" y="55" width="10" height="11" rx="2" fill="url(#bracketGrad)" stroke="#475569" strokeWidth="1" />
        <circle cx="50" cy="60.5" r="1.5" fill="#0EA5E9" />

        {/* Right Bracket */}
        <rect x="61" y="54" width="9" height="11" rx="2" fill="url(#bracketGrad)" stroke="#475569" strokeWidth="1" />
        <circle cx="65.5" cy="59.5" r="1.5" fill="#0EA5E9" />
      </svg>
    </div>
  );
};

/**
 * Minh họa nha khoa tổng hợp cho Hero Banner:
 * Gồm Răng 3D cầm kính lúp khám nha khoa + Ghế nha khoa hiện đại
 */
export const HeroDentalBannerArt: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-end select-none pointer-events-none overflow-hidden">
      {/* Background Soft Medical Chair Blur Mask */}
      <div className="absolute right-0 top-0 bottom-0 w-80 opacity-25 mix-blend-multiply overflow-hidden rounded-r-3xl">
        <img
          src="/backgrounds/bg-patient-chair.jpg"
          alt=""
          className="w-full h-full object-cover object-center filter blur-[0.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#E8F6F2]/70 to-[#E8F6F2]" />
      </div>

      {/* Modern Dental Chair Outline & Cute 3D Tooth Hero Vector */}
      <div className="relative z-10 flex items-center gap-4 pr-4 sm:pr-8">
        <svg
          viewBox="0 0 240 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-52 h-40 sm:w-64 sm:h-48 drop-shadow-md"
        >
          <defs>
            <linearGradient id="heroToothGrad" x1="40" y1="20" x2="120" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F1FAF8" />
              <stop offset="100%" stopColor="#D9EFEB" />
            </linearGradient>

            <linearGradient id="mirrorGlassGrad" x1="130" y1="50" x2="170" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            <linearGradient id="chairGrad" x1="160" y1="60" x2="230" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#70B8AC" />
              <stop offset="100%" stopColor="#388E81" />
            </linearGradient>
          </defs>

          {/* Dental Chair Simplified Modern Silhouette on Right */}
          <g opacity="0.85">
            {/* Chair Base & Pillar */}
            <ellipse cx="200" cy="162" rx="28" ry="7" fill="#CBD5E1" />
            <rect x="195" y="125" width="10" height="35" rx="3" fill="#94A3B8" />

            {/* Chair Cushion Back & Seat */}
            <path
              d="M 165 95 C 165 80, 180 70, 195 72 L 210 75 C 220 77, 226 86, 223 96 L 215 120 C 213 125, 205 130, 195 128 L 175 125 C 168 123, 163 115, 165 108 Z"
              fill="url(#chairGrad)"
            />
            {/* Headrest */}
            <rect x="180" y="55" width="22" height="14" rx="6" fill="#344C52" opacity="0.85" />
            {/* Instrument arm */}
            <path d="M 205 125 Q 225 105 230 75" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="230" cy="75" r="5" fill="#38BDF8" />
          </g>

          {/* Cute 3D Mascot Tooth in Foreground */}
          {/* Shadow */}
          <ellipse cx="80" cy="155" rx="42" ry="9" fill="#2E4741" opacity="0.12" />

          {/* Tooth Body */}
          <path
            d="M 50 48
               C 62 38, 73 42, 80 48
               C 87 42, 98 38, 110 48
               C 122 58, 126 84, 122 108
               C 118 132, 105 150, 93 150
               C 87 150, 84 138, 80 138
               C 76 138, 73 150, 67 150
               C 55 150, 42 132, 38 108
               C 34 84, 38 58, 50 48 Z"
            fill="url(#heroToothGrad)"
            stroke="#D0ECE4"
            strokeWidth="2"
          />

          {/* Tooth Eyes */}
          <circle cx="65" cy="80" r="4" fill="#1E3A34" />
          <circle cx="63.5" cy="78" r="1.5" fill="#FFFFFF" />
          <circle cx="95" cy="80" r="4" fill="#1E3A34" />
          <circle cx="93.5" cy="78" r="1.5" fill="#FFFFFF" />

          {/* Cheeks */}
          <circle cx="56" cy="88" r="4.5" fill="#FCA5A5" opacity="0.6" />
          <circle cx="104" cy="88" r="4.5" fill="#FCA5A5" opacity="0.6" />

          {/* Happy Open Smile */}
          <path
            d="M 72 88 Q 80 98 88 88"
            stroke="#1E3A34"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="#F87171"
          />

          {/* Dentist Mirror Hand */}
          <path
            d="M 105 105 Q 120 100 135 88"
            stroke="#94A3B8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Mirror Rim */}
          <circle cx="140" cy="84" r="14" fill="#E2E8F0" stroke="#64748B" strokeWidth="2.5" />
          {/* Mirror Glass */}
          <circle cx="140" cy="84" r="11" fill="url(#mirrorGlassGrad)" />
          <path
            d="M 134 80 Q 140 76 146 80"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />

          {/* Sparkles */}
          <path
            d="M 116 38 Q 118 42 122 43 Q 118 44 116 48 Q 115 44 111 43 Q 115 42 116 38 Z"
            fill="#F59E0B"
          />
          <path
            d="M 38 60 Q 40 63 43 64 Q 40 65 38 68 Q 37 65 34 64 Q 37 63 38 60 Z"
            fill="#10B981"
          />
        </svg>
      </div>
    </div>
  );
};

