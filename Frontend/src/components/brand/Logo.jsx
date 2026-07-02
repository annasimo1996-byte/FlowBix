// src/components/brand/Logo.jsx

function Logo({ size = '36px' }) {
  return (
    <div 
      style={{
        width: size,
        height: size,
        backgroundColor: 'rgb(124, 107, 255)',
        borderRadius: '10px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        
        // 🟢 EFFETTO LUMINOSO: Giochiamo con due ombre in contrasto
        boxShadow: `
          0 2px 4px rgba(0, 0, 0, 0.4),              /* 1. Ombra scura definita per il contrasto */
          0 4px 16px rgba(124, 107, 255, 0.5)      /* 2. Bagliore sfocato viola (il colore luminoso) */
        `,
      }}
    >
      <svg 
        width="55%" 
        height="55%" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M12 2L2 7L12 12L22 7L12 2Z" 
          fill="#FFFFFF"
        />
        <path 
          opacity="0.5" 
          d="M2 17L12 22L22 17V12L12 17L2 12V17Z" 
          fill="#FFFFFF"
        />
      </svg>
    </div>
  )
}

export default Logo