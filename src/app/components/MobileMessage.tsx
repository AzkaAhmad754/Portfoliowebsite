import { useState, useEffect } from "react";

export function MobileMessage() {
  const [isSmall, setIsSmall] = useState(() => window.innerWidth < 1024);

  useEffect(() => {
    const checkSize = () => {
      setIsSmall(window.innerWidth < 1024);
    };

    // Check immediately and repeatedly for first 2 seconds
    checkSize();
    const t1 = setTimeout(checkSize, 100);
    const t2 = setTimeout(checkSize, 500);
    const t3 = setTimeout(checkSize, 1000);

    window.addEventListener("resize", checkSize);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", checkSize);
    };
  }, []);

  useEffect(() => {
    if (isSmall) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
    };
  }, [isSmall]);

  if (!isSmall) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "linear-gradient(135deg, rgba(88,28,135,1) 0%, rgba(109,40,217,1) 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999999,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      touchAction: "none",
      userSelect: "none",
      overflow: "hidden",
      WebkitOverflowScrolling: "touch" as any,
    }}>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div style={{ fontSize: "80px", marginBottom: "24px" }}>💻</div>
        <h1 style={{
          fontFamily: "'Abril Fatface', serif",
          fontSize: "36px",
          color: "#E9D5FF",
          margin: "0 0 16px",
          lineHeight: 1.2,
        }}>
          Open on Desktop
        </h1>
        <p style={{
          fontSize: "16px",
          color: "rgba(233,213,255,0.8)",
          margin: "0 0 32px",
          maxWidth: "280px",
          lineHeight: 1.6,
        }}>
          This experience is best viewed on a larger screen for the full 3D magic ✨
        </p>
        <p style={{
          fontSize: "12px",
          color: "rgba(233,213,255,0.6)",
          margin: "0",
          letterSpacing: "0.1em",
        }}>
          Expand your window to explore
        </p>
      </div>
    </div>
  );
}