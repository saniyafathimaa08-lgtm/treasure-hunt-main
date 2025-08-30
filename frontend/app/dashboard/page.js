"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function Dashboard() {
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Get team info from localStorage (set during login)
  useEffect(() => {
    const storedTeam = localStorage.getItem('treasureHuntTeam');
    if (storedTeam) {
      try {
        const team = JSON.parse(storedTeam);
        setTeamId(team.teamId);
        setTeamName(team.teamName);
        if (team.teamId) {
          checkProgress(team.teamId);
        }
      } catch (e) {
        console.error('Failed to parse stored team info');
      }
    }
  }, []);

  const checkProgress = async (tid) => {
    if (!tid) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/game/${tid}/clue`);
      if (res.ok) {
        const data = await res.json();
        setProgress(data);
      } else if (res.status === 404) {
        setProgress(null); // No progress yet
      } else {
        throw new Error("Failed to check progress");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const goToGame = () => {
    if (teamId) {
      router.push(`/game?teamId=${teamId}`);
    }
  };

  const startNewHunt = () => {
    if (teamId) {
      router.push(`/game?teamId=${teamId}`);
    }
  };

  if (!teamId) {
    return (
      <main style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#111827,#0b1020)" }} />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@500;700&display=swap');
          .arcade-title { font-family: 'Press Start 2P', cursive; letter-spacing: 2px; color: #e879f9; text-shadow: 0 0 6px rgba(232,121,249,.8); }
          .arcade-sub { font-family: 'Orbitron', sans-serif; color: #cbd5e1; }
          .glass { backdrop-filter: blur(8px); background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08); border-radius: 16px; padding: 18px; }
          .btn { font-family: 'Orbitron', sans-serif; font-weight: 700; background: linear-gradient(90deg,#22c55e,#06b6d4); color: #0b1020; border: none; border-radius: 12px; padding: 12px 16px; cursor: pointer; box-shadow: 0 8px 24px rgba(6,182,212,.35); transition: transform .15s ease; }
          .btn:hover { transform: translateY(-1px); }
        `}</style>

        <div style={{ position: "relative", zIndex: 1, display: "grid", placeItems: "center", minHeight: "100vh", padding: 20 }}>
          <div style={{ width: "min(1100px,96vw)", display: "grid", gap: 18 }}>
            <h1 className="arcade-title" style={{ fontSize: 22 }}>TREASURE HUNT DASHBOARD</h1>
            
            <div className="glass" style={{ textAlign: "center" }}>
              <p className="arcade-sub">Please login first to access your treasure hunt dashboard.</p>
              <button className="btn" onClick={() => router.push('/login')} style={{ marginTop: 12 }}>
                GO TO LOGIN
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#111827,#0b1020)" }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@500;700&display=swap');
        .arcade-title { font-family: 'Press Start 2P', cursive; letter-spacing: 2px; color: #e879f9; text-shadow: 0 0 6px rgba(232,121,249,.8); }
        .arcade-sub { font-family: 'Orbitron', sans-serif; color: #cbd5e1; }
        .glass { backdrop-filter: blur(8px); background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08); border-radius: 16px; padding: 18px; }
        .btn { font-family: 'Orbitron', sans-serif; font-weight: 700; background: linear-gradient(90deg,#22c55e,#06b6d4); color: #0b1020; border: none; border-radius: 12px; padding: 12px 16px; cursor: pointer; box-shadow: 0 8px 24px rgba(6,182,212,.35); transition: transform .15s ease; }
        .btn:hover { transform: translateY(-1px); }
        .progress-step { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 8px; padding: 12px; margin: 8px 0; }
        .progress-current { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); }
        .team-info { background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.3); border-radius: 8px; padding: 12px; margin-bottom: 16; }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, display: "grid", placeItems: "center", minHeight: "100vh", padding: 20 }}>
        <div style={{ width: "min(1100px,96vw)", display: "grid", gap: 18 }}>
          <h1 className="arcade-title" style={{ fontSize: 22 }}>TREASURE HUNT DASHBOARD</h1>

          {/* Team Info */}
          <div className="glass team-info">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 className="arcade-sub" style={{ fontSize: 18, marginBottom: 8, color: "#e879f9" }}>
                  Welcome, {teamName || `Team ${teamId}`}!
                </h2>
                <p className="arcade-sub" style={{ margin: 0, fontSize: 14 }}>
                  Your unique treasure hunt path awaits. Solve riddles, scan QR codes, and upload selfies to progress!
                </p>
              </div>
              <button 
                className="btn" 
                onClick={() => {
                  localStorage.removeItem('treasureHuntTeam');
                  router.push('/login');
                }}
                style={{ 
                  background: "linear-gradient(90deg,#ef4444,#dc2626)", 
                  fontSize: 12, 
                  padding: "8px 12px",
                  minWidth: "auto"
                }}
              >
                LOGOUT
              </button>
            </div>
          </div>

          {error && (
            <div className="glass" style={{ borderLeft: "3px solid #ef4444" }}>
              <p className="arcade-sub" style={{ color: "#fca5a5" }}>Error: {error}</p>
            </div>
          )}

          {/* Progress Display */}
          <div className="glass">
            <h2 className="arcade-sub" style={{ fontSize: 18, marginBottom: 12, color: "#e879f9" }}>
              {progress ? "Current Progress" : "Ready to Start!"}
            </h2>
            
            {!progress ? (
              <div style={{ textAlign: "center" }}>
                <p className="arcade-sub">You haven't started your treasure hunt yet!</p>
                <p className="arcade-sub" style={{ fontSize: 14, color: "#94a3b8", marginTop: 8 }}>
                  Spin the wheel to get your first riddle and begin your journey to 5 locations + final destination.
                </p>
                <button className="btn" onClick={startNewHunt} style={{ marginTop: 16 }}>
                  🎯 START TREASURE HUNT
                </button>
              </div>
            ) : (
              <div>
                <div className="progress-step progress-current">
                  <p className="arcade-sub" style={{ margin: 0 }}>
                    <strong>Current Riddle:</strong> {typeof progress?.riddle === 'string' ? progress?.riddle : (progress?.riddle?.text || '')}
                  </p>
                  {progress.current?.isFinal && (
                    <p className="arcade-sub" style={{ margin: "8px 0 0 0", color: "#93c5fd" }}>
                      🎯 Final Destination!
                    </p>
                  )}
                </div>
                
                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <p className="arcade-sub">Continue your hunt by scanning the QR code and uploading a selfie at the current location.</p>
                  <button className="btn" onClick={goToGame} style={{ marginTop: 8 }}>
                    CONTINUE IN GAME
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Game Flow Info */}
          <div className="glass" style={{ background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.3)" }}>
            <h3 className="arcade-sub" style={{ fontSize: 16, marginBottom: 8, color: "#60a5fa" }}>How It Works:</h3>
            <div style={{ display: "grid", gap: 8, fontSize: 14 }}>
              <p className="arcade-sub" style={{ margin: 0 }}>1️⃣ <strong>Spin Wheel</strong> → Get first riddle</p>
              <p className="arcade-sub" style={{ margin: 0 }}>2️⃣ <strong>Solve Riddle</strong> → Find the location</p>
              <p className="arcade-sub" style={{ margin: 0 }}>3️⃣ <strong>Scan QR Code</strong> → Prove you're there</p>
              <p className="arcade-sub" style={{ margin: 0 }}>4️⃣ <strong>Upload Selfie</strong> → Get next riddle</p>
              <p className="arcade-sub" style={{ margin: 0 }}>5️⃣ <strong>Repeat 5 times</strong> → Unlock final destination!</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
