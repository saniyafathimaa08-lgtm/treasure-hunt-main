"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentChar, setCurrentChar] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCreator, setShowCreator] = useState(false);

  const title = "IEDC TREASURE HUNT";
  const subtitle = "Embark on an Epic Adventure";

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        if (currentChar < title.length) {
          setCurrentChar(currentChar + 1);
        } else {
          setIsTyping(false);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentChar, isTyping, title.length]);

  const handleEnvelopeClick = () => {
    setShowCreator(true);
  };

  return (
    <main style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Animated Fantasy Background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, rgba(147,51,234,0.4) 0%, rgba(79,70,229,0.3) 50%, rgba(236,72,153,0.4) 100%)",
        animation: "fantasyPulse 8s ease-in-out infinite alternate"
      }} />
      
      {/* Floating Particles */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"rgba(255,255,255,0.6)\"/><circle cx=\"80\" cy=\"40\" r=\"0.5\" fill=\"rgba(255,255,255,0.4)\"/><circle cx=\"40\" cy=\"80\" r=\"0.8\" fill=\"rgba(255,255,255,0.5)\"/></svg>')",
        animation: "floatParticles 20s linear infinite"
      }} />

      {/* Animated Treasure Chest */}
      <div style={{
        position: "absolute",
        top: "20%",
        right: "10%",
        fontSize: "4rem",
        animation: "bounce 2s ease-in-out infinite"
      }}>
        💎
      </div>

      {/* Animated Compass */}
      <div style={{
        position: "absolute",
        top: "30%",
        left: "10%",
        fontSize: "3rem",
        animation: "rotate 4s linear infinite"
      }}>
        🧭
      </div>

      {/* Animated Map */}
      <div style={{
        position: "absolute",
        bottom: "20%",
        left: "15%",
        fontSize: "3.5rem",
        animation: "float 3s ease-in-out infinite"
      }}>
        🗺️
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Press+Start+2P&family=Creepster&family=Fredoka+One&family=Righteous&display=swap');
        
        @keyframes fantasyPulse {
          0% { 
            background: radial-gradient(ellipse at center, rgba(147,51,234,0.4) 0%, rgba(79,70,229,0.3) 50%, rgba(236,72,153,0.4) 100%);
            transform: scale(1);
          }
          50% {
            background: radial-gradient(ellipse at center, rgba(236,72,153,0.4) 0%, rgba(147,51,234,0.3) 50%, rgba(79,70,229,0.4) 100%);
            transform: scale(1.05);
          }
          100% { 
            background: radial-gradient(ellipse at center, rgba(79,70,229,0.4) 0%, rgba(236,72,153,0.3) 50%, rgba(147,51,234,0.4) 100%);
            transform: scale(1);
          }
        }
        
        @keyframes floatParticles {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-100px) rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes glowText {
          0%, 100% { text-shadow: 0 0 10px #e879f9, 0 0 20px #e879f9, 0 0 30px #e879f9; }
          50% { text-shadow: 0 0 20px #22d3ee, 0 0 30px #22d3ee, 0 0 40px #22d3ee; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .main-title {
          font-family: 'Creepster', cursive;
          font-size: 4rem;
          color: #ffffff;
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
          text-shadow: 
            0 0 10px #e879f9,
            0 0 20px #e879f9,
            0 0 30px #e879f9,
            0 0 40px #e879f9,
            0 0 50px #e879f9,
            0 0 60px #e879f9;
          filter: drop-shadow(0 0 5px rgba(0,0,0,1)) drop-shadow(0 0 10px rgba(0,0,0,1));
          font-weight: bold;
          letter-spacing: 3px;
          animation: glowText 2s ease-in-out infinite alternate;
        }
        
        .typing-cursor {
          display: inline-block;
          width: 3px;
          height: 4rem;
          background: #22d3ee;
          margin-left: 5px;
          animation: blink 1s infinite;
          vertical-align: top;
        }
        
        .subtitle {
          font-family: 'Righteous', cursive;
          font-size: 1.8rem;
          color: #ffffff;
          text-align: center;
          margin-bottom: 3rem;
          text-shadow: 
            0 0 10px #22d3ee,
            0 0 20px #22d3ee,
            0 0 30px #22d3ee;
          filter: drop-shadow(0 0 3px rgba(0,0,0,1));
          font-weight: bold;
          animation: glowText 3s ease-in-out infinite alternate;
          opacity: 0;
          animation: fadeInUp 1s ease-out 2s forwards;
        }
        
        .description {
          font-family: 'Orbitron', monospace;
          font-size: 1.2rem;
          color: #ffffff;
          text-align: center;
          margin-bottom: 4rem;
          text-shadow: 0 0 10px rgba(255,255,255,0.8);
          filter: drop-shadow(0 0 2px rgba(0,0,0,1));
          opacity: 0;
          animation: fadeInUp 1s ease-out 3s forwards;
        }
        
        .action-buttons {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
          opacity: 0;
          animation: fadeInUp 1s ease-out 4s forwards;
        }
        
        .action-btn {
          background: linear-gradient(45deg, #e879f9, #22d3ee);
          border: none;
          border-radius: 15px;
          padding: 1.2rem 2.5rem;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.9rem;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 30px rgba(147,51,234,0.4);
          text-transform: uppercase;
          letter-spacing: 2px;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }
        
        .action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .action-btn:hover::before {
          left: 100%;
        }
        
        .action-btn:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 0 50px rgba(147,51,234,0.6);
        }
        
        .action-btn:active {
          transform: translateY(-2px) scale(1.02);
        }
        
        .login-btn {
          background: linear-gradient(45deg, #fbbf24, #e879f9);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .highlight {
          color: #fbbf24;
          text-shadow: 
            0 0 10px #fbbf24,
            0 0 20px #fbbf24,
            0 0 30px #fbbf24;
          animation: glowText 2s ease-in-out infinite alternate;
        }
        
        .envelope-section {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
          opacity: 0;
          animation: fadeInUp 1s ease-out 6s forwards;
          padding-top: 120px;
        }
        
        .envelope-icon {
          background: rgba(15,23,42,0.8);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(147,51,234,0.5);
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            0 0 30px rgba(147,51,234,0.4),
            inset 0 0 30px rgba(147,51,234,0.1);
          position: relative;
          overflow: hidden;
        }
        
        .envelope-icon::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #e879f9, #22d3ee, #fbbf24, #f87171);
          border-radius: 50%;
          z-index: -1;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .envelope-icon:hover {
          transform: translateY(-5px) scale(1.1);
          box-shadow: 0 0 50px rgba(147,51,234,0.6);
        }
        
        .envelope-icon:active {
          transform: translateY(-2px) scale(1.05);
        }
        
        .envelope-emoji {
          font-size: 2rem;
          animation: bounce 2s ease-in-out infinite;
        }
        
        .envelope-tooltip {
          position: absolute;
          bottom: 100%;
          right: 0;
          background: rgba(15,23,42,0.95);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(147,51,234,0.8);
          border-radius: 10px;
          padding: 1rem 1.5rem;
          margin-bottom: 1rem;
          white-space: nowrap;
          font-family: 'Orbitron', monospace;
          font-size: 1.1rem;
          font-weight: bold;
          color: #ffffff;
          text-shadow: 
            0 0 10px #e879f9,
            0 0 20px #e879f9,
            0 0 30px #e879f9;
          filter: drop-shadow(0 0 5px rgba(0,0,0,1));
          opacity: 1;
          transform: translateY(0);
          transition: all 0.3s ease;
          pointer-events: none;
          animation: tooltipPulse 2s ease-in-out infinite;
          box-shadow: 
            0 0 20px rgba(147,51,234,0.4),
            inset 0 0 20px rgba(147,51,234,0.1);
          z-index: 1001;
        }
        
        @keyframes tooltipPulse {
          0%, 100% { 
            transform: translateY(0) scale(1);
            box-shadow: 0 0 20px rgba(147,51,234,0.4), inset 0 0 20px rgba(147,51,234,0.1);
          }
          50% { 
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 0 30px rgba(147,51,234,0.6), inset 0 0 30px rgba(147,51,234,0.2);
          }
        }
        
        .creator-section {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.5s ease;
        }
        
        .creator-section.show {
          opacity: 1;
          visibility: visible;
        }
        
        .creator-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          z-index: 1999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.5s ease;
        }
        
        .creator-overlay.show {
          opacity: 1;
          visibility: visible;
        }
        
        .creator-card {
          background: rgba(15,23,42,0.95);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(147,51,234,0.5);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 
            0 0 50px rgba(147,51,234,0.4),
            inset 0 0 50px rgba(147,51,234,0.1);
          position: relative;
          overflow: hidden;
          max-width: 400px;
          transition: all 0.3s ease;
          transform: scale(0.8);
        }
        
        .creator-section.show .creator-card {
          transform: scale(1);
        }
        
        .creator-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #e879f9, #22d3ee, #fbbf24, #f87171);
          border-radius: 20px;
          z-index: -1;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(239,68,68,0.8);
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          color: #ffffff;
          transition: all 0.3s ease;
        }
        
        .close-btn:hover {
          background: rgba(239,68,68,1);
          transform: scale(1.1);
        }
        
        .creator-avatar {
          font-size: 3rem;
          animation: bounce 2s ease-in-out infinite;
        }
        
        .creator-info {
          flex: 1;
        }
        
        .creator-name {
          font-family: 'Fredoka One', cursive;
          font-size: 1.5rem;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          text-shadow: 
            0 0 10px #fbbf24,
            0 0 20px #fbbf24,
            0 0 30px #fbbf24;
          filter: drop-shadow(0 0 3px rgba(0,0,0,1));
          font-weight: bold;
        }
        
        .creator-role {
          font-family: 'Orbitron', monospace;
          font-size: 1rem;
          color: #ffffff;
          margin: 0 0 1rem 0;
          text-shadow: 
            0 0 10px #22d3ee,
            0 0 20px #22d3ee,
            0 0 30px #22d3ee;
          filter: drop-shadow(0 0 3px rgba(0,0,0,1));
          font-weight: bold;
        }
        
        .creator-social {
          margin-top: 0.5rem;
        }
        
        .social-link {
          font-family: 'Orbitron', monospace;
          color: #ffffff;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          text-shadow: 
            0 0 10px #e879f9,
            0 0 20px #e879f9,
            0 0 30px #e879f9;
          filter: drop-shadow(0 0 3px rgba(0,0,0,1));
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: bold;
        }
        
        .social-link:hover {
          color: #fbbf24;
          text-shadow: 0 0 15px rgba(251,191,36,0.7);
          transform: scale(1.05);
        }
        
        @media (max-width: 768px) {
          .main-title { font-size: 2.5rem; letter-spacing: 2px; }
          .subtitle { font-size: 1.4rem; }
          .description { font-size: 1rem; }
          .action-buttons { gap: 1rem; }
          .action-btn { padding: 1rem 2rem; font-size: 0.8rem; }
          .creator-card { flex-direction: column; text-align: center; padding: 1.5rem; }
          .creator-avatar { font-size: 2.5rem; }
          .envelope-icon { width: 60px; height: 60px; }
          .envelope-emoji { font-size: 1.5rem; }
        }
      `}</style>

      <div style={{ 
        position: "relative", 
        zIndex: 1, 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "100vh", 
        padding: "2rem" 
      }}>
        <h1 className="main-title">
          {title.substring(0, currentChar)}
          {isTyping && <span className="typing-cursor"></span>}
        </h1>
        
        <p className="subtitle">
          Embark on an <span className="highlight">Epic Adventure</span>
        </p>
        
        <p className="description">
          Discover hidden treasures, solve mysterious riddles, and compete with legendary teams!<br/>
          Are you ready to become the ultimate treasure hunter?
        </p>
        
        <div className="action-buttons">
          <a href="/register" className="action-btn">
            🚀 START HUNT
          </a>
          <a href="/login" className="action-btn login-btn">
            🔑 CONTINUE
          </a>
        </div>
      </div>

      {/* Envelope Icon */}
      <div className="envelope-section">
        <div className="envelope-icon" onClick={handleEnvelopeClick}>
          <div className="envelope-emoji">✉️</div>
          <div className="envelope-tooltip">✨ Touch to reveal the Grandmaster ✨</div>
        </div>
      </div>

      {/* Creator Overlay */}
      <div className={`creator-overlay ${showCreator ? 'show' : ''}`} onClick={() => setShowCreator(false)}></div>
      
      {/* Creator Section */}
      <div className={`creator-section ${showCreator ? 'show' : ''}`}>
        <div className="creator-card">
          <button className="close-btn" onClick={() => setShowCreator(false)}>×</button>
          <div className="creator-avatar">👨‍💻</div>
          <div className="creator-info">
            <h3 className="creator-name">Midhun M</h3>
            <p className="creator-role">IEDC ASET Tech Lead</p>
            <div className="creator-social">
              <a href="https://instagram.com/sp.nxa" target="_blank" rel="noopener noreferrer" className="social-link">
                📸 @sp.nxa
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
