// SVG recreation of the official Umatul Islam Center circular logo
export default function MasjidLogo({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Umatul Islam Center logo"
      role="img"
    >
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#d4f5d4"/>
        </radialGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1a3d2b" floodOpacity="0.25"/>
        </filter>
      </defs>

      {/* Outer black ring */}
      <circle cx="100" cy="100" r="98" fill="#111111"/>

      {/* Green ring */}
      <circle cx="100" cy="100" r="92" fill="none" stroke="#22c55e" strokeWidth="7"/>

      {/* Blue ring */}
      <circle cx="100" cy="100" r="85" fill="none" stroke="#3b4fc8" strokeWidth="3"/>

      {/* White/gradient inner fill */}
      <circle cx="100" cy="100" r="82" fill="url(#bgGrad)"/>

      {/* Arabic text: مركز أمة الإسلام */}
      <text
        x="100"
        y="52"
        textAnchor="middle"
        fontFamily="'Amiri', 'Noto Naskh Arabic', serif"
        fontSize="18"
        fontWeight="700"
        fill="#1a2a1a"
        direction="rtl"
      >
        مركز أمة الإسلام
      </text>

      {/* ── Mosque Silhouette ── */}
      {/* Main dome */}
      <ellipse cx="90" cy="105" rx="22" ry="10" fill="#3b2a1a"/>
      <path d="M68 105 Q90 68 112 105Z" fill="#3b2a1a"/>
      {/* Left small dome */}
      <ellipse cx="68" cy="115" rx="10" ry="5" fill="#3b2a1a"/>
      <path d="M58 115 Q68 98 78 115Z" fill="#3b2a1a"/>
      {/* Right small dome */}
      <ellipse cx="112" cy="115" rx="10" ry="5" fill="#3b2a1a"/>
      <path d="M102 115 Q112 98 122 115Z" fill="#3b2a1a"/>
      {/* Minaret */}
      <rect x="120" y="82" width="8" height="42" fill="#3b2a1a"/>
      <path d="M118 82 L128 82 L124 72Z" fill="#3b2a1a"/>
      <circle cx="124" cy="70" r="3" fill="#3b2a1a"/>
      {/* Crescent on main dome */}
      <path d="M87 78 Q92 74 97 78 Q93 76 87 78Z" fill="#3b2a1a"/>
      {/* Main building body */}
      <rect x="60" y="120" width="68" height="22" fill="#3b2a1a"/>
      {/* Arched windows */}
      <path d="M72 142 L72 128 Q78 122 84 128 L84 142Z" fill="#d4f5d4"/>
      <path d="M90 142 L90 128 Q96 122 102 128 L102 142Z" fill="#d4f5d4"/>
      <path d="M108 142 L108 128 Q114 122 120 128 L120 142Z" fill="#d4f5d4"/>

      {/* UIC text */}
      <text x="90" y="157" textAnchor="middle" fontFamily="'Cinzel','Georgia',serif" fontSize="11" fontWeight="800" fill="#1a2a1a" letterSpacing="1">UIC</text>

      {/* Curved bottom text: UMATUL ISLAM CENTER */}
      <path id="bottomArc" d="M 24,100 A 76,76 0 0,0 176,100" fill="none"/>
      <text fontFamily="'Cinzel','Georgia',serif" fontSize="10" fontWeight="700" fill="#1a2a1a" letterSpacing="1.5">
        <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
          UMATUL ISLAM CENTER
        </textPath>
      </text>
    </svg>
  )
}
