"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function GameContent() {
  const searchParams = useSearchParams();
  const [teamId, setTeamId] = useState("");
  const [spun, setSpun] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clue, setClue] = useState(null); // { current: {isFinal}, riddle }
  const [qrCode, setQrCode] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const [qrVerified, setQrVerified] = useState(false);

  // Auto-fill teamId from URL if provided
  useEffect(() => {
    const urlTeamId = searchParams.get('teamId');
    if (urlTeamId) {
      setTeamId(urlTeamId);
    }
    // Also try from localStorage if not in URL
    const storedTeam = localStorage.getItem('treasureHuntTeam');
    if (!urlTeamId && storedTeam) {
      try {
        const team = JSON.parse(storedTeam);
        if (team?.teamId) setTeamId(String(team.teamId));
      } catch {}
    }
  }, [searchParams]);

  // When teamId is set, try to load current clue; if exists, mark as spun and show riddle
  useEffect(() => {
    (async () => {
      if (!teamId) return;
      try {
        const res = await fetch(`${BACKEND_URL}/game/${teamId}/clue`);
        if (res.ok) {
          const data = await res.json();
          setClue(data);
          setSpun(true);
        }
      } catch {}
    })();
  }, [teamId]);

  const fetchClue = async (tid) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/game/${tid}/clue`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load clue");
      setClue(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onSpin = async () => {
    if (!teamId) return setError("Enter your team ID");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/game/${teamId}/spin`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to spin");
      setSpun(true);
      setQrVerified(false);
      await fetchClue(teamId); // immediately load first riddle
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyQrOnly = async () => {
    if (!teamId) return setError("Enter your team ID");
    if (!qrCode) return setError("Enter scanned QR code");
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${BACKEND_URL}/game/${teamId}/verify-qr`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: qrCode }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "QR verification failed");
      setQrVerified(true);
      setMessage("QR verified. Now upload a selfie to proceed.");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const stopScanner = () => {
    setScanning(false);
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    const video = videoRef.current;
    const stream = video?.srcObject;
    if (stream && typeof stream.getTracks === "function") {
      stream.getTracks().forEach(t => t.stop());
    }
    if (video) {
      video.srcObject = null;
    }
  };

  const startScanner = async () => {
    try {
      setError("");
      setMessage("");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setScanning(true);

      const hasBarcodeDetector = typeof window !== "undefined" && "BarcodeDetector" in window;
      let detector = null;
      if (hasBarcodeDetector) {
        const formats = ["qr_code", "aztec", "data_matrix", "pdf417"];
        detector = new window.BarcodeDetector({ formats });
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      scanIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState !== 4) return;
        const width = videoRef.current.videoWidth;
        const height = videoRef.current.videoHeight;
        if (!width || !height) return;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        try {
          if (detector) {
            const result = await detector.detect(canvas);
            if (result && result.length > 0) {
              const text = result[0].rawValue || result[0].rawValue === "" ? result[0].rawValue : result[0].rawValue;
              if (text) {
                setQrCode(text.trim());
                stopScanner();
                // Auto-verify when captured
                await verifyQrOnly();
              }
            }
          }
        } catch (e) {
          // ignore frame errors
        }
      }, 300);
    } catch (e) {
      setError("Camera access denied or unavailable. Enter code manually.");
    }
  };

  useEffect(() => {
    return () => stopScanner();
  }, []);

  const startSpinAnimation = async () => {
    if (!teamId) return setError("Enter your team ID");
    setError("");
    setMessage("");
    setSpinning(true);
    const extraTurns = 720; // 2 full spins
    const randomDeg = Math.floor(Math.random() * 360);
    const newRotation = rotation + extraTurns + randomDeg;
    setRotation(newRotation);
    setTimeout(async () => {
      await onSpin(); // generate path + fetch first clue (riddle only)
      setSpinning(false);
    }, 2000);
  };

  const onVerifySelfie = async (e) => {
    e.preventDefault();
    if (!teamId) return setError("Enter your team ID");
    if (!qrCode) return setError("Enter scanned QR code");
    if (!file) return setError("Choose a selfie file");
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const form = new FormData();
      form.append("code", qrCode);
      form.append("selfie", file);
      const res = await fetch(`${BACKEND_URL}/game/${teamId}/verify-selfie`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit selfie");
      setMessage(data.completed ? "Finished!" : "Step completed. Loading next clue...");
      setQrCode("");
      setFile(null);
      if (!data.completed) await fetchClue(teamId);
      else setClue(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
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
        top: "10%",
        right: "5%",
        fontSize: "3rem",
        animation: "bounce 2s ease-in-out infinite"
      }}>
        💎
      </div>

      {/* Animated Compass */}
      <div style={{
        position: "absolute",
        top: "15%",
        left: "5%",
        fontSize: "2.5rem",
        animation: "rotate 4s linear infinite"
      }}>
        🧭
      </div>

      {/* Animated Map */}
      <div style={{
        position: "absolute",
        bottom: "10%",
        left: "10%",
        fontSize: "3rem",
        animation: "float 3s ease-in-out infinite"
      }}>
        🗺️
      </div>

      {/* Animated Crystal */}
      <div style={{
        position: "absolute",
        bottom: "20%",
        right: "15%",
        fontSize: "2.5rem",
        animation: "glow 2s ease-in-out infinite alternate"
      }}>
        🔮
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
        
        @keyframes glow {
          0%, 100% { 
            text-shadow: 0 0 10px #e879f9, 0 0 20px #e879f9, 0 0 30px #e879f9;
            transform: scale(1);
          }
          50% { 
            text-shadow: 0 0 20px #22d3ee, 0 0 30px #22d3ee, 0 0 40px #22d3ee;
            transform: scale(1.1);
          }
        }
        
        @keyframes glowText {
          0%, 100% { text-shadow: 0 0 10px #e879f9, 0 0 20px #e879f9, 0 0 30px #e879f9; }
          50% { text-shadow: 0 0 20px #22d3ee, 0 0 30px #22d3ee, 0 0 40px #22d3ee; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
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
        
        .game-title {
          font-family: 'Creepster', cursive;
          font-size: 2.5rem;
          color: #ffffff;
          text-align: center;
          margin-bottom: 1rem;
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
        
        .game-subtitle {
          font-family: 'Righteous', cursive;
          font-size: 1.2rem;
          color: #ffffff;
          text-align: center;
          margin-bottom: 2rem;
          text-shadow: 
            0 0 10px #22d3ee,
            0 0 20px #22d3ee,
            0 0 30px #22d3ee;
          filter: drop-shadow(0 0 3px rgba(0,0,0,1));
          font-weight: bold;
          animation: glowText 3s ease-in-out infinite alternate;
        }
        
        .fantasy-card {
          background: rgba(15,23,42,0.8);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(147,51,234,0.3);
          border-radius: 25px;
          padding: 2rem;
          box-shadow: 
            0 0 50px rgba(147,51,234,0.3),
            inset 0 0 50px rgba(147,51,234,0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .fantasy-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #e879f9, #22d3ee, #fbbf24, #f87171);
          border-radius: 25px;
          z-index: -1;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .fantasy-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 50px rgba(147,51,234,0.4);
        }
        
        .fantasy-input {
          background: rgba(30,41,59,0.8);
          border: 2px solid rgba(147,51,234,0.5);
          border-radius: 15px;
          padding: 1rem 1.5rem;
          font-family: 'Orbitron', monospace;
          font-size: 1rem;
          color: #e2e8f0;
          width: 100%;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(147,51,234,0.2);
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
          background: linear-gradient(45deg, #e879f9, #22d3ee);
          border: none;
          border-radius: 15px;
          padding: 1rem 2rem;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 30px rgba(147,51,234,0.4);
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .fantasy-button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 0 50px rgba(147,51,234,0.6);
        }
        
        .fantasy-button:active {
          transform: translateY(-1px) scale(1.02);
        }
        
        .fantasy-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .spin-wheel {
          position: relative;
          width: 300px;
          height: 300px;
          margin: 0 auto;
        }
        
        .wheel {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 8px solid rgba(147,51,234,0.5);
          background: conic-gradient(
            #fde047 0deg 30deg,
            #4ade80 30deg 60deg,
            #60a5fa 60deg 90deg,
            #fb7185 90deg 120deg,
            #a78bfa 120deg 150deg,
            #34d399 150deg 180deg,
            #fde047 180deg 210deg,
            #4ade80 210deg 240deg,
            #60a5fa 240deg 270deg,
            #fb7185 270deg 300deg,
            #a78bfa 300deg 330deg,
            #34d399 330deg 360deg
          );
          box-shadow: 
            0 0 50px rgba(147,51,234,0.4),
            inset 0 0 50px rgba(147,51,234,0.1);
          display: grid;
          place-items: center;
          transform: rotate(${rotation}deg);
          transition: spinning ? "transform 2s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none";
        }
        
        .wheel-center {
          font-family: 'Creepster', cursive;
          font-size: 3rem;
          color: #ffffff;
          text-shadow: 
            0 0 10px #e879f9,
            0 0 20px #e879f9,
            0 0 30px #e879f9;
          filter: drop-shadow(0 0 5px rgba(0,0,0,1));
          animation: glowText 2s ease-in-out infinite alternate;
        }
        
        .wheel-pointer {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-bottom: 25px solid #ffffff;
          filter: drop-shadow(0 0 10px rgba(255,255,255,0.8));
        }
        
        .riddle-card {
          background: rgba(15,23,42,0.9);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(34,211,238,0.5);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 
            0 0 50px rgba(34,211,238,0.3),
            inset 0 0 50px rgba(34,211,238,0.1);
          position: relative;
          overflow: hidden;
        }
        
        .riddle-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #22d3ee, #e879f9, #fbbf24, #f87171);
          border-radius: 20px;
          z-index: -1;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .riddle-title {
          font-family: 'Fredoka One', cursive;
          font-size: 1.5rem;
          color: #22d3ee;
          margin-bottom: 1rem;
          text-shadow: 
            0 0 10px #22d3ee,
            0 0 20px #22d3ee,
            0 0 30px #22d3ee;
          filter: drop-shadow(0 0 3px rgba(0,0,0,1));
          font-weight: bold;
        }
        
        .riddle-text {
          font-family: 'Orbitron', monospace;
          font-size: 1.1rem;
          color: #ffffff;
          line-height: 1.6;
          text-shadow: 0 0 10px rgba(255,255,255,0.8);
          filter: drop-shadow(0 0 2px rgba(0,0,0,1));
        }
        
        .final-indicator {
          font-family: 'Righteous', cursive;
          font-size: 1rem;
          color: #fbbf24;
          margin-top: 1rem;
          text-shadow: 
            0 0 10px #fbbf24,
            0 0 20px #fbbf24,
            0 0 30px #fbbf24;
          filter: drop-shadow(0 0 3px rgba(0,0,0,1));
          font-weight: bold;
          animation: glowText 2s ease-in-out infinite alternate;
        }
        
        .message {
          font-family: 'Orbitron', monospace;
          font-size: 1rem;
          margin: 1rem 0;
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
        
        .camera-container {
          position: relative;
          width: 100%;
          max-width: 420px;
          margin: 0 auto;
          border-radius: 15px;
          overflow: hidden;
          border: 2px solid rgba(34,211,238,0.5);
          box-shadow: 0 0 30px rgba(34,211,238,0.3);
        }
        
        .camera-overlay {
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 0 3px rgba(34,211,238,0.8);
          pointer-events: none;
          border-radius: 15px;
        }
        
        @media (max-width: 768px) {
          .game-title { font-size: 1.6rem; }
          .game-subtitle { font-size: 0.95rem; }
          .fantasy-card { padding: 1rem; }
          .spin-wheel { width: 220px; height: 220px; }
          .wheel-center { font-size: 2rem; }
          .fantasy-input { font-size: 0.95rem; padding: 0.8rem 1rem; }
          .fantasy-button { padding: 0.8rem 1.2rem; font-size: 0.7rem; }
        }

        @media (max-width: 420px) {
          .game-title { font-size: 1.4rem; }
          .game-subtitle { font-size: 0.9rem; }
          .spin-wheel { width: 200px; height: 200px; }
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
        <h1 className="game-title">🎯 TREASURE HUNT GAME 🎯</h1>
        <p className="game-subtitle">Embark on Your Epic Quest</p>

        <div style={{ width: "min(1100px, 96vw)", display: "grid", gap: "2rem" }}>
          {/* Team ID and Spin Section */}
          <div className="fantasy-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <input 
                className="fantasy-input" 
                value={teamId} 
                onChange={e => setTeamId(e.target.value)} 
                placeholder="Enter Team ID" 
                style={{ width: "200px" }}
              />
              <button 
                className="fantasy-button" 
                onClick={startSpinAnimation} 
                disabled={loading || spinning || !teamId}
              >
                {spinning ? "SPINNING..." : "SPIN PATH"}
              </button>
            </div>
          </div>

          {error && <p className="message error">{error}</p>}
          {message && <p className="message success">{message}</p>}

          {/* Spin Wheel Section - Only show if not spun yet */}
          {!spun && (
            <div className="fantasy-card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "center" }}>
              <div className="spin-wheel">
                <div className="wheel">
                  <div className="wheel-center">?</div>
                </div>
                <div className="wheel-pointer"></div>
              </div>
              <div>
                <p style={{ 
                  fontFamily: 'Orbitron, monospace', 
                  color: '#cbd5e1', 
                  lineHeight: 1.6,
                  fontSize: '1rem',
                  textShadow: '0 0 10px rgba(255,255,255,0.8)',
                  filter: 'drop-shadow(0 0 2px rgba(0,0,0,1))'
                }}>
                  Spin to generate your unique path. The wheel is cosmetic. Your first riddle appears below.
                  Solve it, reach the correct spot, scan its QR code, and upload your selfie to unlock the next riddle.
                </p>
              </div>
            </div>
          )}

          {/* Riddle Card */}
          {clue && (
            <div className="riddle-card">
              <h2 className="riddle-title">🔍 RIDDLE</h2>
              <p className="riddle-text">
                {typeof clue.riddle === 'string' ? clue.riddle : (clue.riddle?.text || '')}
              </p>
              {clue.current?.isFinal && <p className="final-indicator">🏆 Final Destination 🏆</p>}
            </div>
          )}

          {/* Verification Section - Only show if spun and have a riddle */}
          {spun && clue && (
            <div className="fantasy-card" style={{ display: "grid", gap: "1.5rem" }}>
              <div style={{ display: "grid", gap: "1rem" }}>
                <label className="fantasy-label">📱 Scanned QR Code</label>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <input 
                    className="fantasy-input" 
                    value={qrCode} 
                    onChange={e => setQrCode(e.target.value)} 
                    placeholder="QR-XXXXX" 
                  />
                  <button 
                    className="fantasy-button" 
                    type="button" 
                    onClick={verifyQrOnly} 
                    disabled={loading || !qrCode}
                  >
                    VERIFY QR
                  </button>
                  <button 
                    className="fantasy-button" 
                    type="button" 
                    onClick={scanning ? () => stopScanner() : () => startScanner()} 
                    style={{ 
                      background: scanning ? "linear-gradient(45deg, #ef4444, #dc2626)" : undefined 
                    }}
                  >
                    {scanning ? "STOP SCAN" : "OPEN SCANNER"}
                  </button>
                </div>
              </div>

              {scanning && (
                <div className="camera-container">
                  <video 
                    ref={videoRef} 
                    playsInline 
                    muted 
                    style={{ 
                      width: "100%", 
                      height: "auto", 
                      display: "block", 
                      background: "black" 
                    }} 
                  />
                  <div className="camera-overlay"></div>
                </div>
              )}

              {qrVerified && (
                <form onSubmit={onVerifySelfie} style={{ display: "grid", gap: "1rem" }}>
                  <label className="fantasy-label">📸 Team Selfie (opens camera)</label>
                  <input 
                    className="fantasy-input" 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    onChange={e => setFile(e.target.files?.[0] || null)} 
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button 
                      className="fantasy-button" 
                      type="submit" 
                      disabled={loading || !file}
                    >
                      UPLOAD SELFIE & NEXT
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameContent />
    </Suspense>
  );
}



