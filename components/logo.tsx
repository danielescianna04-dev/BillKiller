interface LogoProps {
  className?: string
  size?: number
}

export default function BillKillerLogo({ className = '', size = 32 }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Banconota/Fattura */}
      <rect 
        x="15" 
        y="35" 
        width="70" 
        height="45" 
        rx="4" 
        fill="#f59e0b" 
        opacity="0.9"
      />
      <rect 
        x="15" 
        y="35" 
        width="70" 
        height="45" 
        rx="4" 
        stroke="#d97706" 
        strokeWidth="2"
      />
      
      {/* Linee della fattura */}
      <line x1="25" y1="45" x2="55" y2="45" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="52" x2="65" y2="52" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="59" x2="50" y2="59" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      
      {/* Simbolo € */}
      <text x="65" y="70" fill="#fff" fontSize="20" fontWeight="bold" fontFamily="Arial">€</text>
      
      {/* Fulmine killer */}
      <path 
        d="M 50 10 L 40 40 L 50 40 L 45 60 L 65 35 L 55 35 L 60 10 Z" 
        fill="#ef4444"
        stroke="#dc2626"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      
      {/* Effetto taglio/slash */}
      <line 
        x1="20" 
        y1="75" 
        x2="80" 
        y2="40" 
        stroke="#dc2626" 
        strokeWidth="4" 
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  )
}

export function BillKillerLogoText({ className = '', size = 32 }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <BillKillerLogo size={size} />
      <span className="font-bold text-xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
        BillKiller
      </span>
    </div>
  )
}
