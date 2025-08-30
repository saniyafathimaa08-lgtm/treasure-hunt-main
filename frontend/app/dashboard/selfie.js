import { useState } from "react";

export default function SelfieUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please select a selfie!");
    const formData = new FormData();
    formData.append("selfie", file);
    // TODO: Add teamId and node info
    const res = await fetch("/api/selfie", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setMessage(data.message || data.error);
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
        background: "radial-gradient(circle at 20% 40%, #fcb69f 0%, #a1c4fd 100%)",
        animation: "artMove 10s ease-in-out infinite alternate"
      }} />
      <style>{`
        @keyframes artMove {
          0% { background: radial-gradient(circle at 20% 40%, #fcb69f 0%, #a1c4fd 100%); }
          100% { background: radial-gradient(circle at 80% 60%, #c2e9fb 0%, #ffecd2 100%); }
        }
        .responsive-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 32px 16px;
        }
        .responsive-form {
          background: rgba(255,255,255,0.95);
          padding: 30px;
          border-radius: 30px;
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37);
          text-align: center;
          min-width: 350px;
          max-width: 100vw;
        }
        h2 {
          color: #2c5364;
          font-family: cursive;
          font-size: 32px;
          margin-bottom: 20px;
          text-shadow: 2px 2px 8px #fff;
        }
        @media (max-width: 900px) {
          h2 { font-size: 24px; }
          .responsive-form { min-width: 220px; padding: 18px; }
        }
        @media (max-width: 600px) {
          h2 { font-size: 16px; }
          .responsive-content { padding: 16px 4px; }
          .responsive-form { min-width: 100px; padding: 8px; border-radius: 16px; }
        }
      `}</style>
      <div className="responsive-content">
        <h2>Upload Team Selfie 📸</h2>
        <form onSubmit={handleSubmit} className="responsive-form">
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: 20 }} />
          {preview && <img src={preview} alt="Preview" style={{ width: 180, height: 180, objectFit: "cover", borderRadius: 20, marginBottom: 20, boxShadow: "0 4px 16px #a1c4fd" }} />}
          <button type="submit" style={{ width: "100%", background: "linear-gradient(90deg,#a1c4fd,#fcb69f)", color: "#2c5364", border: "none", borderRadius: 10, padding: "12px", fontWeight: "bold", fontSize: 18, boxShadow: "0 2px 8px #fcb69f" }}>Upload Selfie</button>
          {message && <p style={{ marginTop: 15, color: message.includes("error") ? "red" : "green" }}>{message}</p>}
        </form>
      </div>
    </main>
  );
}
