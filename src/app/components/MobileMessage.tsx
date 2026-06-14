import { useState, useEffect } from "react";

export function MobileMessage() {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsSmall(window.innerWidth < 768);
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  if (!isSmall) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(135deg, rgba(88,28,135,0.95) 0%, rgba(109,40,217,0.95) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div
          style={{
            fontSize: "80px",
            marginBottom: "24px",
            animation: "bounce 1.5s ease-in-out infinite",
          }}
        >
          💻
        </div>

        <h1
          style={{
            fontFamily: "'Abril Fatface', serif",
            fontSize: "36px",
            color: "#E9D5FF",
            margin: "0 0 16px",
            lineHeight: 1.2,
            letterSpacing: "0.05em",
          }}
        >
          Open on Desktop
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "rgba(233,213,255,0.8)",
            margin: "0 0 32px",
            maxWidth: "280px",
            lineHeight: 1.6,
          }}
        >
          This experience is best viewed on a larger screen for the full 3D magic ✨
        </p>

        <p
          style={{
            fontSize: "12px",
            color: "rgba(233,213,255,0.6)",
            margin: "0",
            letterSpacing: "0.1em",
          }}
        >
          Expand your window to explore
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
