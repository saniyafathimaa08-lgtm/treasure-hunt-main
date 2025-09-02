import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [excelUrl, setExcelUrl] = useState("");

  useEffect(() => {
    // Fetch all teams and their details
    fetch("/api/admin/teams")
      .then(res => res.json())
      .then(data => {
        setTeams(data.teams || []);
        setLoading(false);
      });
  }, []);

  const downloadExcel = async () => {
    const res = await fetch("/api/export");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    setExcelUrl(url);
  };

  return (
    <main style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Animated Art Background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        background: "linear-gradient(120deg, #fcb69f 0%, #a1c4fd 100%)",
        animation: "adminArtMove 10s ease-in-out infinite alternate"
      }} />
      <style>{`
        @keyframes adminArtMove {
          0% { background: linear-gradient(120deg, #fcb69f 0%, #a1c4fd 100%); }
          100% { background: linear-gradient(120deg, #c2e9fb 0%, #ffecd2 100%); }
        }
        .responsive-content {
          position: relative;
          z-index: 1;
          padding: 3rem 2rem;
          max-width: 900px;
          margin: 0 auto;
        }
        .responsive-table {
          width: 100%;
          border-collapse: collapse;
          overflow-x: auto;
          font-size: 18px;
        }
        @media (max-width: 900px) {
          .responsive-content { padding: 2rem 0.5rem; }
          .responsive-table { font-size: 15px; }
        }
        @media (max-width: 600px) {
          .responsive-content { padding: 1rem 0.2rem; }
          .responsive-table { font-size: 12px; }
          th, td { padding: 6px !important; }
        }
      `}</style>
  <div className="responsive-content">
        <h2 style={{ color: "#2c5364", fontFamily: "cursive", fontSize: 36, marginBottom: 30, textShadow: "2px 2px 8px #fff" }}>Admin Dashboard 🛡️</h2>
        <button onClick={downloadExcel} style={{ background: "linear-gradient(90deg,#a1c4fd,#fcb69f)", color: "#2c5364", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: "bold", fontSize: 18, boxShadow: "0 2px 8px #fcb69f", marginBottom: 30 }}>Download Excel</button>
        {excelUrl && <a href={excelUrl} download="teams.xlsx" style={{ marginLeft: 20, color: "#2c5364", fontWeight: "bold" }}>Click to Save</a>}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 20, boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)", padding: 30, overflowX: "auto" }}>
          {loading ? <p>Loading teams...</p> : (
            <table className="responsive-table">
              <thead>
                <tr style={{ background: "#a1c4fd" }}>
                  <th style={{ padding: 10, borderRadius: 8 }}>Team Name</th>
                  <th style={{ padding: 10, borderRadius: 8 }}>Team ID</th>
                  <th style={{ padding: 10, borderRadius: 8 }}>Members</th>
                  <th style={{ padding: 10, borderRadius: 8 }}>Progress Index</th>
                  <th style={{ padding: 10, borderRadius: 8 }}>Selfies</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(teams) && teams.map(team => (
                  <tr key={team.id} style={{ background: "#fcb69f22" }}>
                    <td style={{ padding: 10 }}>{team.teamName || team.name}</td>
                    <td style={{ padding: 10 }}>{team.id}</td>
                    <td style={{ padding: 10 }}>{Array.isArray(team.members) ? team.members.map(m => m.name).join(", ") : "-"}</td>
                    <td style={{ padding: 10 }}>{team.progress?.currentIndex ?? "-"}</td>
                    <td style={{ padding: 10 }}>
                      {Array.isArray(team.selfies) && team.selfies.map((s, idx) => (
                        <img key={idx} src={s.imageUrl || s.photo} alt={`Selfie ${idx+1}`} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8, marginRight: 6, boxShadow: "0 2px 8px #a1c4fd" }} />
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
