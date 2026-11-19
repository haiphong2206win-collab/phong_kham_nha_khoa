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
};/**
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
};/**
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
/**
 * Mascot Răng 3D đeo tai nghe chăm sóc khách hàng (Headset) & vẫy tay chào
 * Sử dụng riêng cho Card "Cần hỗ trợ đặt lịch?" ở màn hình FE-2B.2
 */
export const ToothWithHeadset: React.FC<{ className?: string }> = ({ className = "w-28 h-28" }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 select-none pointer-events-none ${className}`}>
      {/* Soft mint ambient glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#A7F3D0]/60 via-[#D1FAE5]/40 to-transparent blur-lg" />

      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-md"
      >
        <defs>
          <linearGradient id="headsetToothGrad" x1="25" y1="15" x2="85" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F0FAF8" />
            <stop offset="100%" stopColor="#D5EFE8" />
          </linearGradient>

          <linearGradient id="headsetBandGrad" x1="20" y1="20" x2="90" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>

          <linearGradient id="earcupGrad" x1="0" y1="0" x2="10" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* Tooth Shadow */}
        <ellipse cx="56" cy="106" rx="36" ry="8" fill="#1E384C" opacity="0.08" />

        {/* Headset Over-Head Band */}
        <path
          d="M 24 50 C 22 24, 88 24, 86 50"
          stroke="url(#headsetBandGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tooth Body */}
        <path
          d="M 34 32
             C 44 23, 53 26, 58 32
             C 63 26, 72 23, 82 32
             C 92 41, 95 65, 92 86
             C 89 104, 78 110, 68 110
             C 63 110, 61 100, 58 100
             C 55 100, 53 110, 48 110
             C 38 110, 27 104, 24 86
             C 21 65, 24 41, 34 32 Z"
          fill="url(#headsetToothGrad)"
          stroke="#CEEDE4"
          strokeWidth="1.8"
        />

        {/* Glossy Reflection */}
        <path
          d="M 36 35
             C 42 28, 50 30, 56 35
             C 48 35, 32 48, 30 68
             C 28 56, 30 42, 36 35 Z"
          fill="#FFFFFF"
          opacity="0.8"
        />

        {/* Left Earcup */}
        <rect x="18" y="44" width="8" height="18" rx="4" fill="url(#earcupGrad)" />
        <rect x="23" y="47" width="3" height="12" rx="1.5" fill="#A7F3D0" />

        {/* Right Earcup */}
        <rect x="84" y="44" width="8" height="18" rx="4" fill="url(#earcupGrad)" />
        <rect x="84" y="47" width="3" height="12" rx="1.5" fill="#A7F3D0" />

        {/* Microphone Arm */}
        <path
          d="M 88 56 C 92 72, 85 82, 68 82"
          stroke="#0D9488"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Microphone Sponge */}
        <ellipse cx="66" cy="82" rx="4" ry="3" fill="#065F46" />

        {/* Eyes with sparkle */}
        <circle cx="45" cy="58" r="3.5" fill="#1E384C" />
        <circle cx="43.8" cy="56.5" r="1.2" fill="#FFFFFF" />

        <circle cx="69" cy="58" r="3.5" fill="#1E384C" />
        <circle cx="67.8" cy="56.5" r="1.2" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <circle cx="38" cy="65" r="4" fill="#FCA5A5" opacity="0.6" />
        <circle cx="76" cy="65" r="4" fill="#FCA5A5" opacity="0.6" />

        {/* Cute Smile */}
        <path
          d="M 51 65 Q 57 74 63 65"
          stroke="#1E384C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="#F87171"
        />

        {/* Waving Hand (Left/Bottom) */}
        <path
          d="M 92 68 Q 102 62 104 52"
          stroke="#CEEDE4"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="104" cy="52" r="3" fill="#FFFFFF" stroke="#CEEDE4" strokeWidth="1.5" />

        {/* Small sparkle */}
        <path
          d="M 96 28 Q 98 32 102 33 Q 98 34 96 38 Q 95 34 91 33 Q 95 32 96 28 Z"
          fill="#34D399"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};/**
 * Minh họa Ghế Nha Khoa & Răng Thiên Thần cho Hero Banner Đặt Lịch (FE-2B.2)
 */
export const BookingHeroDentalArt: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-end select-none pointer-events-none overflow-hidden">
      {/* Background Soft Medical Chair Blur Mask */}
      <div className="absolute right-0 top-0 bottom-0 w-72 sm:w-88 opacity-30 mix-blend-multiply overflow-hidden rounded-r-3xl">
        <img
          src="/backgrounds/bg-patient-chair.jpg"
          alt=""
          className="w-full h-full object-cover object-center filter blur-[0.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#E8F6F2]/75 to-[#E8F6F2]" />
      </div>

      {/* Modern Dental Chair Outline & Mascot with Shield */}
      <div className="relative z-10 flex items-center gap-3 sm:gap-6 pr-3 sm:pr-8">
        <svg
          viewBox="0 0 240 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-48 h-36 sm:w-60 sm:h-44 drop-shadow-md"
        >
          <defs>
            <linearGradient id="bookHeroToothGrad" x1="30" y1="15" x2="105" y2="135" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F1FAF8" />
              <stop offset="100%" stopColor="#D7EFEA" />
            </linearGradient>

            <linearGradient id="bookChairGrad" x1="140" y1="50" x2="220" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#70B8AC" />
              <stop offset="100%" stopColor="#2E877A" />
            </linearGradient>

            <linearGradient id="bookShieldGrad" x1="85" y1="75" x2="130" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Dental Chair in Background */}
          <g opacity="0.8">
            <ellipse cx="190" cy="148" rx="26" ry="6" fill="#CBD5E1" />
            <rect x="186" y="115" width="8" height="32" rx="3" fill="#94A3B8" />
            {/* Chair Contour */}
            <path
              d="M 158 85 C 158 72, 172 62, 185 64 L 202 67 C 210 69, 216 77, 213 86 L 206 108 C 204 113, 196 117, 188 115 L 168 112 C 161 110, 156 103, 158 97 Z"
              fill="url(#bookChairGrad)"
            />
            {/* Headrest */}
            <rect x="172" y="48" width="20" height="12" rx="5" fill="#344C52" opacity="0.85" />
            {/* Lamp / instrument arm */}
            <path d="M 196 115 Q 215 95 220 68" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="220" cy="68" r="4.5" fill="#38BDF8" />
          </g>

          {/* Cute 3D Tooth Hero with Cross Shield */}
          {/* Shadow */}
          <ellipse cx="68" cy="142" rx="38" ry="8" fill="#2E4741" opacity="0.1" />

          {/* Tooth Body */}
          <path
            d="M 40 38
               C 50 30, 60 32, 66 38
               C 72 32, 82 30, 92 38
               C 102 47, 105 70, 102 92
               C 99 113, 88 128, 77 128
               C 72 128, 70 118, 66 118
               C 62 118, 60 128, 55 128
               C 44 128, 33 113, 30 92
               C 27 70, 30 47, 40 38 Z"
            fill="url(#bookHeroToothGrad)"
            stroke="#D0ECE4"
            strokeWidth="1.8"
          />

          {/* Eyes */}
          <circle cx="53" cy="66" r="3.5" fill="#1E384C" />
          <circle cx="51.8" cy="64.5" r="1.2" fill="#FFFFFF" />
          <circle cx="79" cy="66" r="3.5" fill="#1E384C" />
          <circle cx="77.8" cy="64.5" r="1.2" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <circle cx="45" cy="73" r="4" fill="#FCA5A5" opacity="0.6" />
          <circle cx="87" cy="73" r="4" fill="#FCA5A5" opacity="0.6" />

          {/* Happy Smile */}
          <path
            d="M 60 73 Q 66 81 72 73"
            stroke="#1E384C"
            strokeWidth="2"
            strokeLinecap="round"
            fill="#F87171"
          />

          {/* Front Medical Cross Shield */}
          <g filter="drop-shadow(0 2px 4px rgba(4,120,87,0.25))">
            <path
              d="M 100 82
                 C 114 82, 122 86, 122 86
                 C 122 108, 114 125, 100 134
                 C 86 125, 78 108, 78 86
                 C 78 86, 86 82, 100 82 Z"
              fill="url(#bookShieldGrad)"
              stroke="#A7F3D0"
              strokeWidth="2"
            />
            {/* White Cross on Shield */}
            <path
              d="M 96 102 H 104 M 100 98 V 106"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </g>

          {/* Sparkles */}
          <path
            d="M 98 28 Q 100 32 103 33 Q 100 34 98 38 Q 97 34 94 33 Q 97 32 98 28 Z"
            fill="#F59E0B"
          />
          <path
            d="M 30 52 Q 32 55 35 56 Q 32 57 30 60 Q 29 57 26 56 Q 29 55 30 52 Z"
            fill="#10B981"
          />
        </svg>
      </div>
    </div>
  );
};/**
 * Minh họa Răng 3D tươi cười đứng cạnh Lịch hẹn khám (FE-2B.3)
 * Phù hợp hoàn hảo với ảnh mô phỏng Lịch khám của tôi
 */
export const AppointmentsHeroArt: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-end select-none pointer-events-none overflow-hidden">
      {/* Background Soft Medical Chair Blur Mask */}
      <div className="absolute right-0 top-0 bottom-0 w-72 sm:w-88 opacity-25 mix-blend-multiply overflow-hidden rounded-r-3xl">
        <img
          src="/backgrounds/bg-patient-chair.jpg"
          alt=""
          className="w-full h-full object-cover object-center filter blur-[0.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#E8F6F2]/75 to-[#E8F6F2]" />
      </div>

      <div className="relative z-10 flex items-center gap-3 sm:gap-6 pr-3 sm:pr-8">
        <svg
          viewBox="0 0 240 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-48 h-36 sm:w-60 sm:h-44 drop-shadow-md"
        >
          <defs>
            <linearGradient id="appToothGrad" x1="130" y1="20" x2="200" y2="135" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F1FAF8" />
              <stop offset="100%" stopColor="#D5EFE8" />
            </linearGradient>

            <linearGradient id="calHeaderGrad" x1="30" y1="40" x2="110" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>

            <linearGradient id="calCheckGrad" x1="55" y1="75" x2="95" y2="115" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* 1. 3D Calendar Card on Left */}
          <g filter="drop-shadow(0 4px 6px rgba(14,165,233,0.15))">
            {/* Calendar Shadow */}
            <ellipse cx="75" cy="142" rx="42" ry="7" fill="#1E384C" opacity="0.1" />

            {/* Calendar Page Base */}
            <rect x="35" y="45" width="78" height="88" rx="14" fill="#FFFFFF" stroke="#E0F2FE" strokeWidth="2" />

            {/* Calendar Header Band */}
            <path
              d="M 35 59 C 35 51.268 41.268 45 49 45 L 99 45 C 106.732 45 113 51.268 113 59 L 113 72 L 35 72 Z"
              fill="url(#calHeaderGrad)"
            />

            {/* Golden Binding Rings */}
            <rect x="48" y="38" width="6" height="14" rx="3" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
            <rect x="71" y="38" width="6" height="14" rx="3" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
            <rect x="94" y="38" width="6" height="14" rx="3" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />

            {/* Calendar Sheet Lines */}
            <rect x="45" y="82" width="22" height="4" rx="2" fill="#E2E8F0" />
            <rect x="45" y="92" width="18" height="4" rx="2" fill="#E2E8F0" />
            <rect x="45" y="102" width="26" height="4" rx="2" fill="#E2E8F0" />

            {/* Big Green/Teal Check Badge on Calendar */}
            <circle cx="86" cy="98" r="16" fill="url(#calCheckGrad)" stroke="#A7F3D0" strokeWidth="2" />
            <path
              d="M 78 98 L 84 104 L 95 92"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>

          {/* 2. Cute 3D Smiling Mascot Tooth on Right */}
          {/* Tooth Shadow */}
          <ellipse cx="165" cy="144" rx="38" ry="8" fill="#1E384C" opacity="0.08" />

          {/* Tooth Body */}
          <path
            d="M 138 42
               C 148 33, 158 35, 164 42
               C 170 35, 180 33, 190 42
               C 200 51, 203 75, 200 98
               C 197 120, 186 134, 175 134
               C 170 134, 168 123, 164 123
               C 160 123, 158 134, 153 134
               C 142 134, 131 120, 128 98
               C 125 75, 128 51, 138 42 Z"
            fill="url(#appToothGrad)"
            stroke="#CEEDE4"
            strokeWidth="2"
          />

          {/* Glossy Reflection */}
          <path
            d="M 140 45
               C 146 38, 153 40, 159 45
               C 151 45, 136 56, 134 76
               C 132 64, 134 52, 140 45 Z"
            fill="#FFFFFF"
            opacity="0.8"
          />

          {/* Eyes */}
          <circle cx="151" cy="70" r="3.5" fill="#1E384C" />
          <circle cx="149.8" cy="68.5" r="1.2" fill="#FFFFFF" />
          <circle cx="177" cy="70" r="3.5" fill="#1E384C" />
          <circle cx="175.8" cy="68.5" r="1.2" fill="#FFFFFF" />

          {/* Cheeks */}
          <circle cx="143" cy="77" r="4" fill="#FCA5A5" opacity="0.6" />
          <circle cx="185" cy="77" r="4" fill="#FCA5A5" opacity="0.6" />

          {/* Open Smile */}
          <path
            d="M 158 77 Q 164 86 170 77"
            stroke="#1E384C"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="#F87171"
          />

          {/* Waving Hand on Right */}
          <path
            d="M 198 78 Q 212 70 216 58"
            stroke="#CEEDE4"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="216" cy="58" r="3.5" fill="#FFFFFF" stroke="#CEEDE4" strokeWidth="1.5" />

          {/* Sparkles */}
          <path
            d="M 194 30 Q 196 34 199 35 Q 196 36 194 40 Q 193 36 190 35 Q 193 34 194 30 Z"
            fill="#F59E0B"
          />
          <path
            d="M 118 36 Q 120 39 123 40 Q 120 41 118 44 Q 117 41 114 40 Q 117 39 118 36 Z"
            fill="#10B981"
          />
        </svg>
      </div>
    </div>
  );
};/**
 * Minh họa Lịch mini 3D cho Card "Lưu ý về lịch khám"
 */
export const MiniCalendarArt: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 select-none pointer-events-none ${className}`}>
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        <defs>
          <linearGradient id="miniCalGrad" x1="15" y1="15" x2="65" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>
        {/* Base */}
        <rect x="12" y="18" width="56" height="52" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        {/* Header */}
        <path d="M 12 26 C 12 21.58 15.58 18 20 18 L 60 18 C 64.42 18 68 21.58 68 26 L 68 34 L 12 34 Z" fill="url(#miniCalGrad)" />
        {/* Rings */}
        <rect x="22" y="13" width="4" height="10" rx="2" fill="#FBBF24" />
        <rect x="38" y="13" width="4" height="10" rx="2" fill="#FBBF24" />
        <rect x="54" y="13" width="4" height="10" rx="2" fill="#FBBF24" />
        {/* Grid dots / check */}
        <circle cx="26" cy="44" r="2.5" fill="#94A3B8" />
        <circle cx="38" cy="44" r="2.5" fill="#94A3B8" />
        <circle cx="50" cy="44" r="2.5" fill="#94A3B8" />
        <circle cx="26" cy="56" r="2.5" fill="#94A3B8" />
        <circle cx="38" cy="56" r="2.5" fill="#94A3B8" />
        <circle cx="50" cy="56" r="7" fill="#10B981" />
        <path d="M 47 56 L 49.5 58.5 L 53.5 54" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};/**
 * Minh họa 3D Hero Art cho trang Hồ sơ cá nhân (FE-2B.4)
 * Bao gồm hồ sơ y tế / clipboard với dấu tích chứng nhận + Mascot răng trắng vui vẻ
 * Khớp chuẩn ảnh mockup duyệt FE-2B.4
 */
export const ProfileHeroArt: React.FC<{ className?: string }> = ({ className = "w-64 h-36" }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 select-none pointer-events-none ${className}`}>
      {/* Mint glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D7F3EB]/60 via-[#E8F8F4]/80 to-transparent blur-xl" />

      <svg
        viewBox="0 0 280 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-sm"
      >
        <defs>
          {/* Clipboard gradients */}
          <linearGradient id="clipBoardGrad" x1="60" y1="20" x2="160" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2F5EF" />
          </linearGradient>
          <linearGradient id="clipBorderGrad" x1="60" y1="20" x2="160" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7CD5C1" />
            <stop offset="100%" stopColor="#2BB89B" />
          </linearGradient>

          {/* Tooth gradients */}
          <linearGradient id="profileToothBody" x1="160" y1="30" x2="250" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F4FCF9" />
            <stop offset="100%" stopColor="#DBEFE8" />
          </linearGradient>
          <linearGradient id="profileToothCap" x1="180" y1="18" x2="225" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="verifiedCheckGrad" x1="120" y1="100" x2="155" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Ambient dental chair silhouette / background soft arcs */}
        <path
          d="M 20 120 C 35 70, 75 40, 120 45"
          stroke="#CDEEE5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="4 6"
          opacity="0.7"
        />
        <path
          d="M 30 135 C 50 110, 80 95, 110 100"
          stroke="#DDF4EE"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Floating mint leaf decor */}
        <path
          d="M 35 48 C 24 35 28 20 42 28 C 46 32 46 45 35 48 Z"
          fill="#A7F3D0"
          opacity="0.8"
        />
        <path
          d="M 250 120 C 265 110 268 95 258 88 C 252 93 245 106 250 120 Z"
          fill="#A7F3D0"
          opacity="0.7"
        />

        {/* === MEDICAL CLIPBOARD (LEFT) === */}
        <g transform="translate(48, 22)">
          {/* Shadow */}
          <rect x="2" y="6" width="94" height="118" rx="14" fill="#134E4A" opacity="0.08" />

          {/* Board base */}
          <rect
            x="0"
            y="0"
            width="94"
            height="118"
            rx="14"
            fill="url(#clipBoardGrad)"
            stroke="url(#clipBorderGrad)"
            strokeWidth="2.2"
          />

          {/* Top Gold Clip */}
          <rect x="30" y="-8" width="34" height="14" rx="4" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.2" />
          <circle cx="47" cy="-2" r="2.5" fill="#FFFFFF" />

          {/* Inner ID Card Sheet */}
          <rect x="10" y="16" width="74" height="88" rx="8" fill="#FFFFFF" opacity="0.9" />

          {/* Avatar circle placeholder */}
          <circle cx="47" cy="40" r="16" fill="#E6F7F2" />
          <path
            d="M 40 48 C 40 43, 44 40, 47 40 C 50 40, 54 43, 54 48 Z"
            fill="#7CD5C1"
          />
          <circle cx="47" cy="34" r="5" fill="#7CD5C1" />

          {/* ID Card info lines */}
          <rect x="20" y="64" width="54" height="4.5" rx="2.25" fill="#BCE7DD" />
          <rect x="26" y="74" width="42" height="3.5" rx="1.75" fill="#D3F1E9" />
          <rect x="22" y="83" width="50" height="3.5" rx="1.75" fill="#D3F1E9" />
        </g>

        {/* Verified Badge Overlay on Clipboard */}
        <g transform="translate(112, 100)">
          <circle cx="16" cy="16" r="16" fill="#FFFFFF" stroke="#E2F5EF" strokeWidth="2" />
          <circle cx="16" cy="16" r="13" fill="url(#verifiedCheckGrad)" />
          <path
            d="M 10 16 L 14 20 L 22 12"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* === CUTE 3D TOOTH CHARACTER (RIGHT) === */}
        <g transform="translate(150, 18)">
          {/* Ground shadow */}
          <ellipse cx="60" cy="124" rx="42" ry="9" fill="#134E4A" opacity="0.12" />

          {/* Left Little Arm */}
          <path
            d="M 22 68 Q 12 78 18 88"
            stroke="#C4EBE0"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Tooth Body */}
          <path
            d="M 32 30
               C 44 18, 55 22, 62 28
               C 69 22, 80 18, 92 30
               C 104 42, 106 68, 102 92
               C 99 114, 86 122, 75 122
               C 68 122, 65 110, 60 110
               C 55 110, 52 122, 45 122
               C 34 122, 21 114, 18 92
               C 14 68, 16 42, 32 30 Z"
            fill="url(#profileToothBody)"
            stroke="#CEEDE4"
            strokeWidth="2.2"
          />

          {/* Mint Dental Cap / Cute Tuft */}
          <path
            d="M 68 16 C 75 10 88 12 94 20 C 85 24 74 23 68 16 Z"
            fill="url(#profileToothCap)"
          />

          {/* Tooth Highlight */}
          <path
            d="M 34 32 C 40 24 50 25 56 30 C 48 30 28 42 26 62 C 24 50 28 38 34 32 Z"
            fill="#FFFFFF"
            opacity="0.85"
          />

          {/* Eyes */}
          <circle cx="48" cy="58" r="4" fill="#1E384C" />
          <circle cx="46.5" cy="56.5" r="1.3" fill="#FFFFFF" />

          <circle cx="76" cy="58" r="4" fill="#1E384C" />
          <circle cx="74.5" cy="56.5" r="1.3" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <ellipse cx="40" cy="66" rx="4.5" ry="3" fill="#FCA5A5" opacity="0.65" />
          <ellipse cx="84" cy="66" rx="4.5" ry="3" fill="#FCA5A5" opacity="0.65" />

          {/* Happy Smile */}
          <path
            d="M 54 66 Q 62 76 70 66"
            stroke="#1E384C"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="#F87171"
          />

          {/* Waving Right Hand */}
          <path
            d="M 98 62 Q 112 52 116 42"
            stroke="#C4EBE0"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="116" cy="42" r="4" fill="#FFFFFF" stroke="#C4EBE0" strokeWidth="2" />
        </g>

        {/* Sparkles */}
        <path
          d="M 252 26 Q 254 30 257 31 Q 254 32 252 36 Q 251 32 248 31 Q 251 30 252 26 Z"
          fill="#F59E0B"
        />
        <path
          d="M 148 16 Q 150 19 153 20 Q 150 21 148 24 Q 147 21 144 20 Q 147 19 148 16 Z"
          fill="#10B981"
        />
      </svg>
    </div>
  );
};/**
 * FE-2B.5: Minh họa nha khoa Hero Art cho Lộ trình điều trị
 * Gồm Răng 3D cầm khiên bảo vệ, bảng checklist lộ trình y tế và lịch tái khám
 */
export const TreatmentHeroArt: React.FC<{ className?: string }> = ({ className = 'w-64 h-36' }) => {
  return (
    <div className={`relative select-none pointer-events-none flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 320 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="treatToothGrad" x1="140" y1="20" x2="220" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F2FAF8" />
            <stop offset="100%" stopColor="#D2EFE8" />
          </linearGradient>

          <linearGradient id="treatClipboardGrad" x1="200" y1="20" x2="290" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          <linearGradient id="treatShieldGrad" x1="180" y1="90" x2="230" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>

          <linearGradient id="treatCalendarGrad" x1="240" y1="70" x2="310" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F0FDF4" />
          </linearGradient>
        </defs>

        {/* Backdrop Glow */}
        <ellipse cx="200" cy="95" rx="100" ry="60" fill="#E6F7F2" opacity="0.6" />

        {/* 1. Medical Treatment Checklist / Clipboard (Behind Tooth) */}
        <g>
          {/* Board */}
          <rect x="210" y="32" width="76" height="96" rx="14" fill="#34D399" opacity="0.9" />
          <rect x="214" y="36" width="68" height="88" rx="10" fill="#FFFFFF" />
          {/* Clip */}
          <rect x="236" y="26" width="24" height="12" rx="4" fill="#F59E0B" />
          <circle cx="248" cy="32" r="2.5" fill="#FFFFFF" />

          {/* Checklist rows */}
          {/* Row 1 */}
          <rect x="222" y="48" width="10" height="10" rx="3" fill="#10B981" />
          <path d="M 224 53 L 226.5 55.5 L 230 50.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="236" y="51" width="38" height="4" rx="2" fill="#94A3B8" />

          {/* Row 2 */}
          <rect x="222" y="64" width="10" height="10" rx="3" fill="#10B981" />
          <path d="M 224 69 L 226.5 71.5 L 230 66.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="236" y="67" width="32" height="4" rx="2" fill="#94A3B8" />

          {/* Row 3 */}
          <rect x="222" y="80" width="10" height="10" rx="3" fill="#E2E8F0" />
          <rect x="236" y="83" width="40" height="4" rx="2" fill="#CBD5E1" />

          {/* Row 4 */}
          <rect x="222" y="96" width="10" height="10" rx="3" fill="#E2E8F0" />
          <rect x="236" y="99" width="28" height="4" rx="2" fill="#CBD5E1" />
        </g>

        {/* 2. Calendar Grid Card (Right Side) */}
        <g>
          {/* Calendar Body */}
          <rect x="250" y="74" width="62" height="66" rx="12" fill="url(#treatCalendarGrad)" stroke="#A7F3D0" strokeWidth="1.5" />
          <path d="M 250 86 L 312 86" stroke="#A7F3D0" strokeWidth="1" />
          {/* Hanging Rings */}
          <rect x="262" y="70" width="5" height="7" rx="2.5" fill="#10B981" />
          <rect x="278" y="70" width="5" height="7" rx="2.5" fill="#10B981" />
          <rect x="294" y="70" width="5" height="7" rx="2.5" fill="#10B981" />

          {/* Mini Calendar Dots / Grid */}
          <circle cx="262" cy="98" r="3" fill="#10B981" />
          <circle cx="274" cy="98" r="3" fill="#10B981" />
          <circle cx="286" cy="98" r="3" fill="#10B981" />
          <circle cx="298" cy="98" r="3" fill="#CBD5E1" />

          <circle cx="262" cy="112" r="3" fill="#10B981" />
          <circle cx="274" cy="112" r="3" fill="#CBD5E1" />
          <circle cx="286" cy="112" r="3" fill="#CBD5E1" />
          <circle cx="298" cy="112" r="3" fill="#CBD5E1" />

          <circle cx="262" cy="126" r="3" fill="#CBD5E1" />
          <circle cx="274" cy="126" r="3" fill="#CBD5E1" />
          <circle cx="286" cy="126" r="3" fill="#CBD5E1" />
        </g>

        {/* 3. Cute 3D Tooth Mascot */}
        <g>
          {/* Shadow */}
          <ellipse cx="170" cy="162" rx="46" ry="10" fill="#144C3F" opacity="0.14" />

          {/* Tooth Body Outline */}
          <path
            d="M 135 52
               C 148 40, 162 45, 170 52
               C 178 45, 192 40, 205 52
               C 218 64, 215 88, 212 110
               C 210 126, 204 148, 194 154
               C 184 160, 178 142, 175 130
               C 173 122, 167 122, 165 130
               C 162 142, 156 160, 146 154
               C 136 148, 130 126, 128 110
               C 125 88, 122 64, 135 52 Z"
            fill="url(#treatToothGrad)"
            stroke="#B6E6DC"
            strokeWidth="1.8"
          />

          {/* Cute Eyes */}
          <circle cx="156" cy="78" r="4.5" fill="#1E384C" />
          <circle cx="154.5" cy="76" r="1.5" fill="#FFFFFF" />

          <circle cx="184" cy="78" r="4.5" fill="#1E384C" />
          <circle cx="182.5" cy="76" r="1.5" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <ellipse cx="147" cy="88" rx="5" ry="3.5" fill="#FCA5A5" opacity="0.65" />
          <ellipse cx="193" cy="88" rx="5" ry="3.5" fill="#FCA5A5" opacity="0.65" />

          {/* Cheerful Smile */}
          <path
            d="M 163 88 Q 170 99 177 88"
            stroke="#1E384C"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="#F87171"
          />

          {/* Left Hand Holding Shield */}
          <path
            d="M 132 94 Q 120 102 126 114"
            stroke="#C0ECE2"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Shield */}
          <path
            d="M 108 98 Q 126 94 144 98 C 144 118, 134 136, 126 144 C 118 136, 108 118, 108 98 Z"
            fill="url(#treatShieldGrad)"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          {/* White Plus Symbol on Shield */}
          <rect x="123" y="107" width="6" height="18" rx="2" fill="#FFFFFF" />
          <rect x="117" y="113" width="18" height="6" rx="2" fill="#FFFFFF" />

          {/* Right Hand Pointing to Checklist */}
          <path
            d="M 206 90 Q 218 84 224 88"
            stroke="#C0ECE2"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="224" cy="88" r="4" fill="#FFFFFF" stroke="#C0ECE2" strokeWidth="2" />
        </g>

        {/* Decorative Sparkles & Mint Leaves */}
        <path
          d="M 94 40 Q 96 44 100 45 Q 96 46 94 50 Q 93 46 89 45 Q 93 44 94 40 Z"
          fill="#10B981"
        />
        <path
          d="M 288 38 Q 290 41 293 42 Q 290 43 288 46 Q 287 43 284 42 Q 287 41 288 38 Z"
          fill="#F59E0B"
        />
      </svg>
    </div>
  );
};/**
 * FE-2B.5: Mascot răng nha khoa cầm dấu hỏi "?" cho card Hỗ trợ & hướng dẫn
 */
export const ToothMascotWithQuestion: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <div className={`relative select-none pointer-events-none flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          <linearGradient id="qToothGrad" x1="30" y1="20" x2="90" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F1FAF8" />
            <stop offset="100%" stopColor="#D4EFE9" />
          </linearGradient>

          <linearGradient id="qBubbleGrad" x1="15" y1="50" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5EEAD4" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="68" cy="108" rx="34" ry="7" fill="#144C3F" opacity="0.12" />

        {/* Tooth Body */}
        <path
          d="M 45 36
             C 54 28, 64 31, 70 36
             C 76 31, 86 28, 95 36
             C 104 45, 102 62, 100 78
             C 98 90, 94 104, 86 108
             C 79 112, 75 100, 73 92
             C 71 86, 67 86, 65 92
             C 63 100, 59 112, 52 108
             C 44 104, 40 90, 38 78
             C 36 62, 34 45, 45 36 Z"
          fill="url(#qToothGrad)"
          stroke="#C2ECE3"
          strokeWidth="1.5"
        />

        {/* Cute Eyes */}
        <circle cx="58" cy="56" r="3.5" fill="#1E384C" />
        <circle cx="57" cy="55" r="1" fill="#FFFFFF" />

        <circle cx="80" cy="56" r="3.5" fill="#1E384C" />
        <circle cx="79" cy="55" r="1" fill="#FFFFFF" />

        {/* Cheeks */}
        <circle cx="51" cy="64" r="3.5" fill="#FCA5A5" opacity="0.6" />
        <circle cx="87" cy="64" r="3.5" fill="#FCA5A5" opacity="0.6" />

        {/* Curious Smile */}
        <path
          d="M 64 64 Q 69 72 74 64"
          stroke="#1E384C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="#F87171"
        />

        {/* Question Bubble Badge on Left */}
        <g>
          <circle cx="32" cy="72" r="16" fill="url(#qBubbleGrad)" stroke="#FFFFFF" strokeWidth="2" />
          <text
            x="32"
            y="78"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="18"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            ?
          </text>
        </g>

        {/* Small Sparkles */}
        <path
          d="M 98 28 Q 100 31 103 32 Q 100 33 98 36 Q 97 33 94 32 Q 97 31 98 28 Z"
          fill="#F59E0B"
        />
      </svg>
    </div>
  );
};

/**
 * FE-2B.6: Mascot Hero Art cho Câu hỏi thường gặp (FAQ)
 * Bao gồm Mascot Răng 3D, Bảng kiểm nha khoa, bong bóng dấu hỏi và tia sáng
 */
export const FaqHeroArt: React.FC<{ className?: string }> = ({ className = "w-64 h-36" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D1F2E8]/70 via-[#E4F8F2]/50 to-transparent blur-xl" />

      <svg
        viewBox="0 0 280 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-sm"
      >
        <defs>
          <linearGradient id="faqToothGrad" x1="120" y1="30" x2="200" y2="135" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F2FBF8" />
            <stop offset="100%" stopColor="#D4EFE9" />
          </linearGradient>

          <linearGradient id="faqBoardGrad" x1="180" y1="20" x2="260" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E6F5F1" />
          </linearGradient>

          <linearGradient id="faqBubbleGrad" x1="70" y1="40" x2="115" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>

        {/* Ambient Leaves */}
        <path d="M 235 125 C 255 110, 260 135, 245 145 Z" fill="#A7F3D0" opacity="0.7" />
        <path d="M 245 105 C 265 95, 268 115, 255 122 Z" fill="#6EE7B7" opacity="0.6" />

        {/* Shadow */}
        <ellipse cx="165" cy="138" rx="55" ry="9" fill="#144C3F" opacity="0.12" />
        <ellipse cx="225" cy="136" rx="35" ry="7" fill="#144C3F" opacity="0.10" />

        {/* Dental Clipboard Board behind Tooth */}
        <g transform="translate(185, 25) rotate(6)">
          <rect x="0" y="0" width="62" height="92" rx="10" fill="url(#faqBoardGrad)" stroke="#BEE3D9" strokeWidth="2" />
          {/* Clip */}
          <rect x="18" y="-6" width="26" height="12" rx="4" fill="#169C89" />
          <circle cx="31" cy="-1" r="2.5" fill="#FFFFFF" />
          {/* Check lines */}
          <circle cx="12" cy="24" r="4" fill="#34D399" />
          <path d="M 10 24 L 11.5 25.5 L 14 22.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="20" y1="24" x2="52" y2="24" stroke="#A4CAC1" strokeWidth="2.5" strokeLinecap="round" />

          <circle cx="12" cy="40" r="4" fill="#34D399" />
          <path d="M 10 40 L 11.5 41.5 L 14 38.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="20" y1="40" x2="52" y2="40" stroke="#A4CAC1" strokeWidth="2.5" strokeLinecap="round" />

          <circle cx="12" cy="56" r="4" fill="#34D399" />
          <path d="M 10 56 L 11.5 57.5 L 14 54.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="20" y1="56" x2="48" y2="56" stroke="#A4CAC1" strokeWidth="2.5" strokeLinecap="round" />

          <line x1="12" y1="72" x2="42" y2="72" stroke="#CEEBE3" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* 3D Smiling Tooth Mascot */}
        <g transform="translate(95, 20)">
          <path
            d="M 45 28
               C 56 18, 68 22, 75 28
               C 82 22, 94 18, 105 28
               C 116 38, 114 58, 111 76
               C 109 90, 104 106, 95 110
               C 87 114, 83 100, 80 91
               C 78 84, 72 84, 70 91
               C 67 100, 63 114, 55 110
               C 46 106, 41 90, 39 76
               C 36 58, 34 38, 45 28 Z"
            fill="url(#faqToothGrad)"
            stroke="#C0ECE1"
            strokeWidth="1.5"
          />

          {/* Happy Eyes */}
          <circle cx="62" cy="50" r="4" fill="#1E384C" />
          <circle cx="60.5" cy="48.5" r="1.3" fill="#FFFFFF" />

          <circle cx="88" cy="50" r="4" fill="#1E384C" />
          <circle cx="86.5" cy="48.5" r="1.3" fill="#FFFFFF" />

          {/* Blush Cheeks */}
          <circle cx="53" cy="60" r="4" fill="#FCA5A5" opacity="0.65" />
          <circle cx="97" cy="60" r="4" fill="#FCA5A5" opacity="0.65" />

          {/* Warm Happy Smile */}
          <path
            d="M 68 60 Q 75 70 82 60"
            stroke="#1E384C"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="#F87171"
          />

          {/* Star Sparkle on Tooth */}
          <path
            d="M 46 36 Q 48 39 51 40 Q 48 41 46 44 Q 45 41 42 40 Q 45 39 46 36 Z"
            fill="#34D399"
          />
        </g>

        {/* Left Speech Bubble with Question Mark '?' */}
        <g transform="translate(60, 48)">
          <circle cx="25" cy="25" r="22" fill="url(#faqBubbleGrad)" stroke="#FFFFFF" strokeWidth="2.5" />
          <path d="M 38 40 L 46 48 L 41 38 Z" fill="#0D9488" />
          <text
            x="25"
            y="33"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="24"
            fontWeight="900"
            fontFamily="sans-serif"
          >
            ?
          </text>
        </g>

        {/* Golden Sunburst Sparkles */}
        <path
          d="M 195 18 Q 197 22 201 23 Q 197 24 195 28 Q 194 24 190 23 Q 194 22 195 18 Z"
          fill="#F59E0B"
        />
        <path
          d="M 78 24 Q 79 26 82 27 Q 79 28 78 30 Q 77 28 75 27 Q 77 26 78 24 Z"
          fill="#F59E0B"
        />
      </svg>
    </div>
  );
};

/**
 * FE-2B.6: Mascot Răng Đeo Tai Nghe (Headphone Mascot)
 * Cho khối "Cần thêm hỗ trợ?" theo đúng chuẩn mockup được duyệt
 */
export const ToothMascotWithHeadphone: React.FC<{ className?: string }> = ({ className = "w-28 h-24" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 160 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          <linearGradient id="hpToothGrad" x1="35" y1="25" x2="115" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F2FBF8" />
            <stop offset="100%" stopColor="#D4EFE9" />
          </linearGradient>

          <linearGradient id="hpGrad" x1="20" y1="20" x2="135" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#0F766E" />
          </linearGradient>

          <linearGradient id="chatBubbleGrad" x1="105" y1="75" x2="140" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="78" cy="120" rx="36" ry="7" fill="#144C3F" opacity="0.12" />

        {/* Headphone Arch Over Tooth */}
        <path
          d="M 38 60 C 35 25, 120 25, 118 60"
          stroke="url(#hpGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tooth Body */}
        <path
          d="M 52 40
             C 61 32, 71 35, 78 40
             C 85 35, 95 32, 104 40
             C 113 49, 111 66, 109 82
             C 107 94, 103 108, 95 112
             C 88 116, 84 104, 82 96
             C 80 90, 76 90, 74 96
             C 72 104, 68 116, 61 112
             C 53 108, 49 94, 47 82
             C 45 66, 43 49, 52 40 Z"
          fill="url(#hpToothGrad)"
          stroke="#C0ECE1"
          strokeWidth="1.5"
        />

        {/* Left Earcup */}
        <rect x="30" y="52" width="12" height="22" rx="6" fill="#169C89" stroke="#A7F3D0" strokeWidth="1.5" />
        <ellipse cx="36" cy="63" rx="3.5" ry="7" fill="#0F766E" />

        {/* Right Earcup */}
        <rect x="114" y="52" width="12" height="22" rx="6" fill="#169C89" stroke="#A7F3D0" strokeWidth="1.5" />
        <ellipse cx="120" cy="63" rx="3.5" ry="7" fill="#0F766E" />

        {/* Eyes */}
        <circle cx="67" cy="58" r="3.5" fill="#1E384C" />
        <circle cx="65.5" cy="56.5" r="1.1" fill="#FFFFFF" />

        <circle cx="89" cy="58" r="3.5" fill="#1E384C" />
        <circle cx="87.5" cy="56.5" r="1.1" fill="#FFFFFF" />

        {/* Cheeks */}
        <circle cx="59" cy="66" r="3.5" fill="#FCA5A5" opacity="0.6" />
        <circle cx="97" cy="66" r="3.5" fill="#FCA5A5" opacity="0.6" />

        {/* Smile */}
        <path
          d="M 73 66 Q 78 74 83 66"
          stroke="#1E384C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="#F87171"
        />

        {/* Little Speech Bubble with Three Dots */}
        <g transform="translate(108, 72)">
          <rect x="0" y="0" width="30" height="20" rx="10" fill="url(#chatBubbleGrad)" />
          <path d="M 6 18 L 0 24 L 8 20 Z" fill="#059669" />
          <circle cx="9" cy="10" r="1.8" fill="#FFFFFF" />
          <circle cx="15" cy="10" r="1.8" fill="#FFFFFF" />
          <circle cx="21" cy="10" r="1.8" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};
