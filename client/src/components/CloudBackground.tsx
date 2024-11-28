export function CloudBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      
      <style>{`
        @keyframes float {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        
        .cloud {
          position: absolute;
          width: 100px;
          height: 40px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          animation: float linear infinite;
        }
        
        .cloud::before,
        .cloud::after {
          content: '';
          position: absolute;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
        }
        
        .cloud::before {
          width: 50px;
          height: 50px;
          top: -20px;
          left: 15px;
        }
        
        .cloud::after {
          width: 30px;
          height: 30px;
          top: -10px;
          left: 45px;
        }
        
        .cloud-1 {
          top: 20%;
          animation-duration: 35s;
        }
        
        .cloud-2 {
          top: 50%;
          animation-duration: 45s;
          animation-delay: -20s;
        }
        
        .cloud-3 {
          top: 75%;
          animation-duration: 40s;
          animation-delay: -10s;
        }
      `}</style>
    </div>
  );
}
