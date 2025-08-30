

"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Register() {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [members, setMembers] = useState([""]);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const addMember = () => {
    setMembers([...members, ""]);
  };

  const removeMember = (index) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredMembers = members.filter(m => m.trim());
    
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName, password, members: filteredMembers }),
    });
    const data = await res.json();
    if (res.ok && !data.error) {
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setMessage(data.message || data.error);
    }
  };

  return (
    <main style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Animated Fantasy Background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, rgba(236,72,153,0.3) 0%, rgba(147,51,234,0.2) 50%, rgba(79,70,229,0.3) 100%)",
        animation: "fantasyPulse 8s ease-in-out infinite alternate"
      }} />
      
      {/* Floating Particles */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"rgba(255,255,255,0.6)\"/><circle cx=\"80\" cy=\"40\" r=\"0.5\" fill=\"rgba(255,255,255,0.4)\"/><circle cx=\"40\" cy=\"80\" r=\"0.8\" fill=\"rgba(255,255,255,0.5)\"/></svg>')",
        animation: "floatParticles 20s linear infinite"
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Press+Start+2P&family=Creepster&family=Fredoka+One&display=swap');
        
        @keyframes fantasyPulse {
          0% { 
            background: radial-gradient(ellipse at center, rgba(236,72,153,0.4) 0%, rgba(147,51,234,0.3) 50%, rgba(79,70,229,0.4) 100%);
            transform: scale(1);
          }
          50% {
            background: radial-gradient(ellipse at center, rgba(79,70,229,0.4) 0%, rgba(236,72,153,0.3) 50%, rgba(147,51,234,0.4) 100%);
            transform: scale(1.05);
          }
          100% { 
            background: radial-gradient(ellipse at center, rgba(147,51,234,0.4) 0%, rgba(79,70,229,0.3) 50%, rgba(236,72,153,0.4) 100%);
            transform: scale(1);
          }
        }
        
        @keyframes floatParticles {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-100px) rotate(360deg); }
        }
        
        @keyframes glowText {
          0%, 100% { text-shadow: 0 0 10px #e879f9, 0 0 20px #e879f9, 0 0 30px #e879f9; }
          50% { text-shadow: 0 0 20px #22d3ee, 0 0 30px #22d3ee, 0 0 40px #22d3ee; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .fantasy-title {
          font-family: 'Creepster', cursive;
          font-size: 3.5rem;
          color: #ffffff;
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
          text-shadow: 
            0 0 10px #fbbf24,
            0 0 20px #fbbf24,
            0 0 30px #fbbf24,
            0 0 40px #fbbf24,
            0 0 50px #fbbf24,
            0 0 60px #fbbf24;
          filter: drop-shadow(0 0 5px rgba(0,0,0,1)) drop-shadow(0 0 10px rgba(0,0,0,1));
          font-weight: bold;
          letter-spacing: 2px;
          animation: glowText 2s ease-in-out infinite alternate;
        }
        
        .fantasy-subtitle {
          font-family: 'Orbitron', monospace;
          font-size: 1.2rem;
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
        }
        
        .fantasy-form {
          background: rgba(15,23,42,0.8);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(236,72,153,0.3);
          border-radius: 25px;
          padding: 3rem;
          box-shadow: 
            0 0 50px rgba(236,72,153,0.3),
            inset 0 0 50px rgba(236,72,153,0.1);
          position: relative;
          overflow: hidden;
          max-width: 600px;
          width: 90vw;
        }
        
        .fantasy-form::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #fbbf24, #e879f9, #22d3ee, #f87171);
          border-radius: 25px;
          z-index: -1;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .fantasy-input {
          background: rgba(30,41,59,0.8);
          border: 2px solid rgba(236,72,153,0.5);
          border-radius: 15px;
          padding: 1rem 1.5rem;
          font-family: 'Orbitron', monospace;
          font-size: 1rem;
          color: #e2e8f0;
          width: 100%;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(236,72,153,0.2);
        }
        
        .fantasy-input:focus {
          outline: none;
          border-color: #22d3ee;
          box-shadow: 0 0 30px rgba(34,211,238,0.4);
          transform: scale(1.02);
        }
        
        .fantasy-label {
          font-family: 'Fredoka One', cursive;
          font-size: 1.1rem;
          color: #fbbf24;
          margin-bottom: 0.5rem;
          display: block;
          text-shadow: 0 0 10px rgba(251,191,36,0.5);
        }
        
        .fantasy-button {
          background: linear-gradient(45deg, #fbbf24, #e879f9);
          border: none;
          border-radius: 15px;
          padding: 1rem 2rem;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.9rem;
          color: #0f172a;
          cursor: pointer;
          width: 100%;
          margin-top: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 0 30px rgba(236,72,153,0.4);
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .fantasy-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 0 50px rgba(236,72,153,0.6);
        }
        
        .fantasy-button:active {
          transform: translateY(-1px) scale(1.02);
        }
        
        .member-row {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .member-input {
          flex: 1;
          background: rgba(30,41,59,0.8);
          border: 2px solid rgba(236,72,153,0.5);
          border-radius: 15px;
          padding: 1rem 1.5rem;
          font-family: 'Orbitron', monospace;
          font-size: 1rem;
          color: #e2e8f0;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(236,72,153,0.2);
        }
        
        .member-input:focus {
          outline: none;
          border-color: #22d3ee;
          box-shadow: 0 0 30px rgba(34,211,238,0.4);
          transform: scale(1.02);
        }
        
        .add-member-btn {
          background: linear-gradient(45deg, #10b981, #22d3ee);
          border: none;
          border-radius: 10px;
          padding: 0.5rem 1rem;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(16,185,129,0.4);
        }
        
        .add-member-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(16,185,129,0.6);
        }
        
        .remove-member-btn {
          background: linear-gradient(45deg, #ef4444, #f87171);
          border: none;
          border-radius: 10px;
          padding: 0.5rem 1rem;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(239,68,68,0.4);
        }
        
        .remove-member-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(239,68,68,0.6);
        }
        
        .message {
          font-family: 'Orbitron', monospace;
          font-size: 1rem;
          margin-top: 1.5rem;
          text-align: center;
          padding: 1rem;
          border-radius: 10px;
          animation: glowText 2s ease-in-out infinite;
        }
        
        .message.success {
          color: #10b981;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.3);
        }
        
        .message.error {
          color: #ef4444;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
        }
        
        .login-link {
          font-family: 'Orbitron', monospace;
          color: #22d3ee;
          text-decoration: none;
          margin-top: 2rem;
          display: block;
          text-align: center;
          transition: all 0.3s ease;
          text-shadow: 0 0 10px rgba(34,211,238,0.5);
        }
        
        .login-link:hover {
          color: #e879f9;
          text-shadow: 0 0 15px rgba(232,121,249,0.7);
        }
        
        @media (max-width: 768px) {
          .fantasy-title { font-size: 2.5rem; }
          .fantasy-form { padding: 2rem; }
          .member-row { flex-direction: column; gap: 0.5rem; }
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
        <h1 className="fantasy-title">🌟 CREATE YOUR LEGEND 🌟</h1>
        <p className="fantasy-subtitle">Assemble your team of adventurers</p>
        
        <form onSubmit={handleSubmit} className="fantasy-form">
          <label className="fantasy-label">⚡ Legendary Team Name</label>
          <input 
            className="fantasy-input"
            value={teamName} 
            onChange={e => setTeamName(e.target.value)} 
            required 
            placeholder="Enter your legendary team name..."
          />
          
          <label className="fantasy-label">🔐 Mystical Password</label>
          <input 
            className="fantasy-input"
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            placeholder="Create your mystical password..."
          />
          
          <label className="fantasy-label">👥 Team Members</label>
          {members.map((member, index) => (
            <div key={index} className="member-row">
              <input
                className="member-input"
                value={member}
                onChange={(e) => updateMember(index, e.target.value)}
                placeholder={`Adventurer ${index + 1} name...`}
              />
              {members.length > 1 && (
                <button
                  type="button"
                  className="remove-member-btn"
                  onClick={() => removeMember(index)}
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            className="add-member-btn"
            onClick={addMember}
            style={{ marginBottom: "1.5rem" }}
          >
            ➕ ADD ADVENTURER
          </button>
          
          <button type="submit" className="fantasy-button">
            🚀 CREATE LEGEND
          </button>
          
          {message && (
            <div className={`message ${message.includes("successful") ? "success" : "error"}`}>
              {message}
            </div>
          )}
        </form>
        
        <a href="/login" className="login-link">
          🔑 Already have a team? Login here!
        </a>
      </div>
    </main>
  );
}
