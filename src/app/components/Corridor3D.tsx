import { useState, useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform, motion } from "motion/react";
import { ModelViewer } from "./ModelViewer";
const portfolioImg = "/images/personalportfoliofigma.png";
const releafImg = "/images/releaf.png";
const s3cFigmaImg = "/images/s3cfigma.png";
const anthologyImg = "/images/ifyouwerelistening.png";
const researchgateImg = "/images/researchgate.png";
const tableauImg = "/images/tableaudashboard.png";
const streamlitImg = "/images/streamlitdashboard.png";
const nfrwImg = "/images/nfrw.png";
const chessImg = "/images/chessgame.png";
const letsunmaskImg = "/images/letsunmask.png";
const bloodconnectImg = "/images/bloodconnect.jpeg";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const PERSP = 1100;       // CSS perspective in px
const SCENE_Z = 9300;     // total Z travel (extended for 5 doors and the contact end)
const PAGES = 14;         // scroll pages

interface DoorConfig {
  id: number;
  z: number;          // scene Z position (negative)
  side: 1 | -1;       // room extends to +x or -x
  frame: string;
  glow: string;
  panel: string;
  title: string;
  role: string;
  isDark: boolean;
  roomBg: string;
}

const DOORS: DoorConfig[] = [
  {
    id: 1, z: -1500, side: 1,
    frame: "#6B21A8", glow: "#A855F7", panel: "#7C3AED",
    title: "UI/UX DESIGNER & FRONTEND DEVELOPER", role: "DESIGNER & EDITOR",
    isDark: false, roomBg: "rgba(240,232,255,0.97)",
  },
  {
    id: 2, z: -3000, side: -1,
    frame: "#92400E", glow: "#F59E0B", panel: "#B45309",
    title: "CREATIVE WRITER", role: "WRITER",
    isDark: false, roomBg: "rgba(255,248,237,0.97)",
  },
  {
    id: 3, z: -4500, side: 1,
    frame: "#0C4A6E", glow: "#38BDF8", panel: "#0369A1",
    title: "CYBER SECURITY ANALYST", role: "SOC ANALYST",
    isDark: true, roomBg: "rgba(5,20,40,0.97)",
  },
  {
    id: 4, z: -6000, side: -1,
    frame: "#14532D", glow: "#129a44", panel: "#166534",
    title: "DATA ANALYTICS & STRATEGY", role: "DATA ANALYST & PROJECT MANAGER",
    isDark: false, roomBg: "rgba(238,250,244,0.97)",
  },
  {
    id: 5, z: -7500, side: 1,
    frame: "#7C3AED", glow: "#C084FC", panel: "#6D28D9",
    title: "PROJECTS", role: "DEVELOPER",
    isDark: false, roomBg: "rgba(245,240,255,0.97)",
  },
];

// Tunnel rings for depth illusion
const RINGS = Array.from({ length: Math.ceil((SCENE_Z + 80) / 190) }, (_, i) => ({
  z: -(i * 190 + 80),
  opacity: Math.max(0.06, 0.18 - i * 0.0024),
  width: 520 + i * 5,
  height: 360 + i * 4,
}));

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// GLITCH TEXT
// ─────────────────────────────────────────────────────────────────────────────

const GCHARS = "!@#$%^&*<>?|~`";

function GlitchText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const trigger = () => {
      let count = 0;
      const iv = setInterval(() => {
        setDisplay(text.split("").map((c) =>
          Math.random() < 0.38 ? GCHARS[Math.floor(Math.random() * GCHARS.length)] : c
        ).join(""));
        if (++count >= 8) { clearInterval(iv); setDisplay(text); }
      }, 55);
      timer = setTimeout(trigger, 1800 + Math.random() * 2000);
    };
    timer = setTimeout(trigger, 1100);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {display}
      <span style={{
        position: "absolute", inset: 0,
        color: "#ff60e0", transform: "translateX(-2px)",
        opacity: 0.55, mixBlendMode: "screen",
        clipPath: "inset(0 0 70% 0)",
      }}>{display}</span>
      <span style={{
        position: "absolute", inset: 0,
        color: "#60e0ff", transform: "translateX(2px)",
        opacity: 0.55, mixBlendMode: "screen",
        clipPath: "inset(60% 0 0 0)",
      }}>{display}</span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREENSHOT PLACEHOLDER
// ─────────────────────────────────────────────────────────────────────────────

function ScreenshotPlaceholder({ label, desc, color }: { label: string; desc: string; color: string }) {
  return (
    <div style={{
      width: "100%",
      minHeight: 90,
      background: `${color}18`,
      border: `1.5px dashed ${color}55`,
      borderRadius: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px 12px",
      textAlign: "center",
      marginBottom: 8,
      boxSizing: "border-box",
    }}>
      <p style={{ margin: "0 0 3px", fontSize: 11, color: color, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600 }}>{label}</p>
      <p style={{ margin: 0, fontSize: 9, color: `${color}99`, fontFamily: "'Space Mono',monospace", lineHeight: 1.4 }}>{desc}</p>
      <p style={{ margin: "4px 0 0", fontSize: 8, color: "rgba(0,0,0,0.3)", fontStyle: "italic" }}>[ Replace with screenshot ]</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PILL BADGE
// ─────────────────────────────────────────────────────────────────────────────

function PillBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 20,
      background: `${color}22`,
      border: `1px solid ${color}55`,
      color: color,
      fontSize: 9,
      fontFamily: "'Space Mono', monospace",
      marginRight: 4,
      marginBottom: 4,
    }}>{label}</span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOOR ROOM CONTENT — per door id
// ─────────────────────────────────────────────────────────────────────────────

function DoorRoomContent({ config }: { config: DoorConfig }) {
  const c = config.frame;
  const textColor = config.isDark ? "#e0e8ff" : "#2E2E2E";
  const subColor = config.isDark ? "rgba(160,200,240,0.7)" : "rgba(46,46,46,0.6)";

  if (config.id === 1) {
    return (
      <div style={{ padding: "14px 16px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: textColor, fontFamily: "'Poppins',sans-serif", lineHeight: 1.2 }}>{config.title}</p>
        <div style={{ marginBottom: 8 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: subColor, fontFamily: "'Space Mono',monospace" }}>TOOLS</p>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {["Figma", "21st.dev", "Stitch", "Claude Design", "Meshy", "Canva Pro"].map(t => (
              <PillBadge key={t} label={t} color={c} />
            ))}
          </div>
        </div>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: c, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600 }}>UI/UX Intern @ Hyperengage</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, marginBottom: 10 }}>
          <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${c}22`, boxShadow: `0 8px 20px ${c}14` }}>
            <img src={portfolioImg} alt="Azka Portfolio" style={{ width: "100%", display: "block" }} />
          </div>
          <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${c}22`, boxShadow: `0 8px 20px ${c}14` }}>
            <img src={releafImg} alt="Releaf" style={{ width: "100%", display: "block" }} />
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
  <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${c}22`, boxShadow: `0 8px 20px ${c}14` }}>
<img src={s3cFigmaImg} alt="S3C Portal" style={{ width: "50%", display: "block", margin: "0 auto" }} />          </div>
          <p style={{ margin: "8px 0 0", fontSize: 10, color: subColor, fontFamily: "'Space Mono',monospace" }}>S3C Portal</p>
        </div>
      </div>
    );
  }

  if (config.id === 2) {
    return (
      <div style={{ padding: "14px 16px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: textColor, fontFamily: "'Poppins',sans-serif", lineHeight: 1.2 }}>{config.title}</p>
                <p style={{ margin: "0 0 2px", fontSize: 12, color: subColor, fontFamily: "'Space Mono',monospace" }}>Writer: @azqawrites (Instagram Writing Page)</p>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: c, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600 }}>SEO Content Writer @ Shadiyana</p>

        <p style={{ margin: "0 0 4px", fontSize: 12, color: textColor, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600 }}>Co-author of Published Anthology</p>
        <p style={{ margin: "0 0 2px", fontSize: 12, color: c, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>&quot;If You Were Listening&quot;</p>
        <p style={{ margin: "0 0 6px", fontSize: 12, color: subColor, fontFamily: "'Space Mono',monospace" }}>Published by TWS Publications</p>
        <div style={{ marginTop: 12 }}>
<img src={anthologyImg} alt="If You Were Listening anthology" style={{ width: "45%", borderRadius: 10, border: `1px solid ${c}22`, boxShadow: `0 8px 20px ${c}14`, display: "block", margin: "0 auto" }} />        </div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: textColor, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Winner of SEECS Got Talent (twice)</p>

      </div>
    );
  }

  if (config.id === 3) {
    return (
      <div style={{ padding: "14px 16px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
        {config.isDark && (
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `linear-gradient(rgba(0,180,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.06) 1px, transparent 1px)`,
            backgroundSize: "30px 30px", pointerEvents: "none",
          }} />
        )}
        <p style={{ margin: "0 0 8px", fontSize: 13, color: textColor, fontFamily: "'Poppins',sans-serif", lineHeight: 1.2, position: "relative" }}>{config.title}</p>
        <p style={{ margin: "0 0 4px", fontSize: 15, color: "#38BDF8", fontFamily: "'Space Mono',monospace", position: "relative" }}>ResearchGate Publications:</p>
        <p style={{ margin: "0 0 2px", fontSize: 12, color: textColor, fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1.4, position: "relative" }}>• "Importance of Human Intelligence (HUMINT) in an Automated Security Environment"</p>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: textColor, fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1.4, position: "relative" }}>• "Pak Cyber World 2025: Out of the Shadows"</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, position: "relative" }}>
          <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(56,189,248,0.18)", boxShadow: "0 8px 22px rgba(56,189,248,0.08)" }}>
            <img src={researchgateImg} alt="ResearchGate" style={{ width: "100%", display: "block" }} />
            <div style={{ padding: 10, background: "rgba(255,255,255,0.92)" }}>
              <p style={{ margin: 0, fontSize: 15, color: "#0f172a", fontFamily: "'Space Mono',monospace" }}>ResearchGate Publication</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (config.id === 4) {
    return (
      <div style={{ padding: "14px 16px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: textColor, fontFamily: "'Poppins',sans-serif", lineHeight: 1.2 }}>{config.title}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, marginBottom: 10 }}>
          <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${c}22`, boxShadow: `0 8px 20px ${c}14`, aspectRatio: "16 / 10" }}>
            <img src={tableauImg} alt="Tableau Dashboard" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${c}22`, boxShadow: `0 8px 20px ${c}14`, aspectRatio: "16 / 10" }}>
            <img src={streamlitImg} alt="QuakeAlert PK" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
        <p style={{ margin: "0 0 4px", fontSize: 12, color: textColor, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, lineHeight: 1.4 }}>Across 20+ university projects, frequently served as team lead and coordinator</p>
        <p style={{ margin: "0 0 2px", fontSize: 14, color: c, fontFamily: "'Space Mono',monospace" }}>Project Manager:</p>
        <p style={{ margin: 0, fontSize: 12, color: subColor, fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1.4 }}>Software Engineering Project — Agile planning · Task coordination · Project delivery</p>
      </div>
    );
  }

  if (config.id === 5) {
    return (
      <div style={{ padding: "14px 16px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: textColor, fontFamily: "'Poppins',sans-serif", lineHeight: 1.2 }}>{config.title}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, marginBottom: 10 }}>
          {[
            { src: nfrwImg, label: "NFRW" },
            { src: chessImg, label: "Chess Game Interface" },
            { src: releafImg, label: "Releaf" },
            { src: letsunmaskImg, label: "Let's Unmask" },
            { src: streamlitImg, label: "QuakeAlert PK" },
            { src: bloodconnectImg, label: "Blood Connect" },
          ].map((item) => (
            <div key={item.label} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${c}22`, boxShadow: `0 8px 20px ${c}14`, aspectRatio: "16 / 10" }}>
              <img src={item.src} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <p style={{ margin: "8px 0 0", fontSize: 10, color: subColor, fontFamily: "'Space Mono',monospace" }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// DOOR SIDE PANEL CONTENT (opposite side of main room)
// ─────────────────────────────────────────────────────────────────────────────

function DoorSidePanelContent({ config }: { config: DoorConfig }) {
  const c = config.frame;

  const themes: Record<number, { label: string; env: string[] }> = {
    1: {
     label:"Video Editor Tools ",
      env: ["Opus AI", "Descript", "Adobe Premiere Pro", "Cap Cut", "DaVinci Resolve"],
    },
    2: {
      label: "Writer",
      env: [
        "For me writing is the very thing that keeps me alive.",
        "I write poetry, short stories, creative narratives and articles.",
        "Yes its true that heart is true to win and will as wills.",
        "The one that burns and then it turns desires into is",
        "Skills: Leadership, Communication and Team Collaboration",
      ],
    },
    3: {
      label: "Security Operations Center",
      env: ["Google Dorking", "Vulnerability Testing", "Kali", "Wireshark", "SQL Injections"],
    },
    4: {
      label: "Analytics Laboratory",
      env: [
        "DA skills: ",
        "Tableau",
        "Power BI",
        "Excel",
        "Google Sheets",
        "Jupyter Notebook",
        "SQL",
        "PM skills: ",
        "Notion, Jira, GitHub",
      ],
    },
    5: {
      label: "Developer Projects",
      env: ["NFRW — Community fundraising", "Chess AI with custom art", "Releaf nursery marketplace", "Let's Unmask deepfake detection", "QuakeAlert PK, Earthquake risk detection", "Blood Connect, blood request and donation platform"],
    },
  };

  const theme = themes[config.id];
  const textColor = config.isDark ? "#e0e8ff" : "#2E2E2E";
  const subColor = config.isDark ? "rgba(160,200,240,0.6)" : "rgba(46,46,46,0.5)";

  return (
    <div style={{ padding: "14px 14px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <p style={{ margin: "0 0 6px", fontSize: 12, color: c, letterSpacing: "0.2em", fontFamily: "'Space Mono',monospace", textTransform: "uppercase" }}>Video Editor</p>
      <p style={{ margin: "0 0 10px", fontSize: 15, color: textColor, fontFamily: "'Abril Fatface',serif", lineHeight: 1.3 }}>{theme.label}</p>
      <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
        {theme.env.map((e, i) => {
          const isQuoteLine = config.id === 2 && (e.startsWith("Yes its true") || e.startsWith("The one that burns"));
          const isHeadingLine = config.id === 4 && (e.startsWith("DA skills:") || e.startsWith("PM skills:"));
          return (
            <li key={i} style={{
              fontSize: isQuoteLine ? 14 : isHeadingLine ? 13 : 12,
              color: isQuoteLine ? c : isHeadingLine ? c : subColor,
              fontFamily: isQuoteLine ? "'Abril Fatface', serif" : isHeadingLine ? "'Space Mono',monospace" : "'Plus Jakarta Sans',sans-serif",
              fontWeight: isQuoteLine ? 700 : isHeadingLine ? 700 : 400,
              textAlign: isQuoteLine ? "center" : "left",
              marginBottom: isQuoteLine || isHeadingLine ? 8 : 4,
              lineHeight: 1.4,
            }}>{e}</li>
          );
        })}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOOR PORTAL (CSS 3D)
// ─────────────────────────────────────────────────────────────────────────────

function DoorPortal({ config, sceneZ }: { config: DoorConfig; sceneZ: number }) {
  const doorAbsZ = Math.abs(config.z);

  // Stays open once camera passes — no closing
  const openAmount = Math.max(0, Math.min(1, (sceneZ - (doorAbsZ - 700)) / 700));
  const approaching = openAmount; // alias for glow opacity
  const doorVisibility = Math.max(0, Math.min(1, (sceneZ - 220) / 240));

  // Door swings open by rotating on its hinge side
  const panelRotateY = openAmount * 88 * config.side; // degrees

  const DW = 240;
  const DH = 320;
  const FRAME_T = 14;

  const roomOpacity = Math.max(0, (openAmount - 0.25) / 0.75);

  return (
    <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: `translate(-50%, -50%) translateZ(${config.z}px)`,
      transformStyle: "preserve-3d",
      opacity: doorVisibility,
      transition: "opacity 0.2s ease-out",
    }}>
      {/* Glow aura behind door */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: DW * 2.5,
        height: DH * 2,
        transform: "translate(-50%, -50%) translateZ(-2px)",
        background: `radial-gradient(ellipse, ${config.glow}${Math.round(approaching * 60).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Frame — Left pillar */}
      <div style={{
        position: "absolute",
        left: -(DW / 2) - FRAME_T,
        top: -(DH / 2) - FRAME_T,
        width: FRAME_T,
        height: DH + FRAME_T * 2,
        background: `linear-gradient(to right, ${config.frame}cc, ${config.frame})`,
        borderRadius: "4px 0 0 4px",
        boxShadow: approaching > 0.3 ? `0 0 20px ${config.glow}88` : "none",
      }} />
      {/* Frame — Right pillar */}
      <div style={{
        position: "absolute",
        left: DW / 2,
        top: -(DH / 2) - FRAME_T,
        width: FRAME_T,
        height: DH + FRAME_T * 2,
        background: `linear-gradient(to left, ${config.frame}cc, ${config.frame})`,
        borderRadius: "0 4px 4px 0",
        boxShadow: approaching > 0.3 ? `0 0 20px ${config.glow}88` : "none",
      }} />
      {/* Frame — Top beam */}
      <div style={{
        position: "absolute",
        left: -(DW / 2) - FRAME_T,
        top: -(DH / 2) - FRAME_T,
        width: DW + FRAME_T * 2,
        height: FRAME_T,
        background: `linear-gradient(to bottom, ${config.frame}cc, ${config.frame})`,
        borderRadius: "4px 4px 0 0",
        boxShadow: approaching > 0.3 ? `0 0 20px ${config.glow}88` : "none",
      }} />

      {/* World label above frame */}
      <div style={{
  position: "absolute",
  top: -(DH / 2) - FRAME_T - 60,
  left: "50%",
  transform: "translateX(-50%)",
  whiteSpace: "nowrap",
  opacity: Math.min(1, approaching * 2),
  textAlign: "center",
  pointerEvents: "none",
}}>
  <div style={{
    position: "absolute",
    top: 6,
    left: 6,
    fontSize: "clamp(28px, 4.5vw, 58px)",
    fontFamily: "'Abril Fatface', serif",
    color: config.frame,
    letterSpacing: "0.12em",
    lineHeight: 1,
    filter: "blur(2px)",
    opacity: 0.5,
  }}>
    ✦ {config.role} ✦
  </div>
  <div style={{
    position: "relative",
    fontSize: "clamp(28px, 4.5vw, 58px)",
    fontFamily: "'Abril Fatface', serif",
    color: config.glow,
    letterSpacing: "0.12em",
    lineHeight: 1,
    textShadow: `2px 2px 0px ${config.frame}, 4px 4px 0px ${config.frame}99, 6px 6px 0px ${config.frame}55, 0 0 40px ${config.glow}99`,
  }}>
    ✦ {config.role} ✦
  </div>
</div>

      {/* Door panel — rotates open */}
      <div style={{
        position: "absolute",
        left: -(DW / 2),
        top: -(DH / 2),
        width: DW,
        height: DH,
        transformStyle: "preserve-3d",
        transformOrigin: config.side === 1 ? "left center" : "right center",
        transform: `rotateY(${-panelRotateY}deg)`,
        background: `linear-gradient(135deg, ${config.panel}ee, ${config.frame}cc)`,
        borderRadius: 4,
        overflow: "hidden",
      }}>
        {/* Scan lines on panel */}
        {[-60, 0, 60].map((y, i) => (
          <div key={i} style={{
            position: "absolute",
            top: "50%",
            left: "10%",
            width: "80%",
            height: 1,
            transform: `translateY(${y}px)`,
            background: `linear-gradient(90deg, transparent, ${config.glow}cc, transparent)`,
            animation: `scanline ${2 + i * 0.5}s ease-in-out infinite`,
          }} />
        ))}
        {/* Door number */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 52,
          color: `${config.glow}44`,
          fontFamily: "'Abril Fatface', serif",
        }}>
          {config.id}
        </div>
      </div>

      {/* ── MAIN ROOM INTERIOR (on hinge side) ── */}
      <div style={{
        position: "absolute",
        top: -(DH / 2),
        left: config.side === 1 ? DW / 2 : undefined,
        right: config.side === -1 ? DW / 2 : undefined,
        width: 520,
        height: DH,
        display: "flex",
        flexDirection: "column",
        opacity: roomOpacity,
        pointerEvents: roomOpacity > 0.4 ? "auto" : "none",
        transition: "opacity 0.3s",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: config.roomBg,
          backdropFilter: "blur(4px)",
          borderRadius: config.side === 1 ? "0 8px 8px 0" : "8px 0 0 8px",
          overflow: "hidden",
        }}>
          <DoorRoomContent config={config} />
        </div>
      </div>

      {/* ── SIDE INFO PANEL (opposite side of main room) ── */}
      <div style={{
        position: "absolute",
        top: -(DH / 2),
        left: config.side === -1 ? DW / 2 : undefined,
        right: config.side === 1 ? DW / 2 : undefined,
        width: 260,
        height: DH,
        opacity: roomOpacity,
        pointerEvents: "none",
        transition: "opacity 0.3s",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: config.isDark ? "rgba(10,20,35,0.95)" : "rgba(255,255,255,0.88)",
          backdropFilter: "blur(4px)",
          borderRadius: config.side === -1 ? "0 8px 8px 0" : "8px 0 0 8px",
          border: `1px solid ${config.frame}33`,
          overflow: "hidden",
        }}>
          <DoorSidePanelContent config={config} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GARDEN END
// ─────────────────────────────────────────────────────────────────────────────

function GardenEnd({ sceneZ }: { sceneZ: number }) {
  const gardenZ = -8800;
  const visibility = Math.max(0, Math.min(1, (sceneZ - (Math.abs(gardenZ) - 500)) / 600));
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: `translate(-50%, -50%) translateZ(${gardenZ}px)`,
      width: 700,
      opacity: visibility,
      transition: "opacity 0.6s",
      pointerEvents: visibility > 0.5 ? "auto" : "none",
    }}>
      {/* Garden ground gradient */}
      <div style={{
        position: "absolute",
        bottom: "-60vh",
        left: "-50vw",
        width: "200vw",
        height: "60vh",
        background: "linear-gradient(to top, #c2f2ba, #d0f0c0, transparent)",
        pointerEvents: "none",
      }} />

      {/* Floating petals */}
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{
          position: "absolute",
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 100}%`,
          width: 8 + (i % 4) * 4,
          height: 8 + (i % 4) * 4,
          borderRadius: "50% 0 50% 0",
          background: ["#f9c8e0", "#d8c8ff", "#ffdde8", "#c8e8ff"][i % 4],
          animation: `float-petal ${4 + i % 3}s ease-in-out infinite`,
          animationDelay: `${i * 0.4}s`,
          opacity: 0.7,
          pointerEvents: "none",
        }} />
      ))}

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Contact panel - full width */}
        <div style={{ flex: 1, width: "100%" }}>
          <h2 style={{
            fontFamily: "'Abril Fatface', serif",
            fontSize: 28,
            color: "#2E2E2E",
            margin: "0 0 4px",
            lineHeight: 1.1,
          }}>
            Let's Build<br />
            <span style={{ color: "#CDB4DB" }}>Something Together</span>
          </h2>

          <div style={{ display: "flex", gap: 10, margin: "12px 0" }}>
            <a href="https://www.linkedin.com/in/azka-ahmad-2623162a3/" target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 16px",
                background: "rgba(255,255,255,0.85)",
                borderRadius: 50,
                border: "1.5px solid rgba(205,180,219,0.5)",
                fontSize: 12,
                color: "#2E2E2E",
                textDecoration: "none",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: "0 4px 16px rgba(180,150,220,0.2)",
              }}>
              LinkedIn
            </a>
            <a href="mailto:aahmad.bscs23seecs@seecs.edu.pk"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 16px",
                background: "rgba(255,255,255,0.85)",
                borderRadius: 50,
                border: "1.5px solid rgba(205,180,219,0.5)",
                fontSize: 12,
                color: "#2E2E2E",
                textDecoration: "none",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: "0 4px 16px rgba(180,150,220,0.2)",
              }}>
              Email
            </a>
          </div>

          {!submitted ? (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(12px)",
                borderRadius: 14,
                padding: "14px",
                border: "1.5px solid rgba(205,180,219,0.3)",
                boxShadow: "0 4px 32px rgba(180,150,220,0.12)",
              }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input required value={name} onChange={e => setName(e.target.value)}
                  placeholder="Name"
                  style={{ flex: 1, padding: "7px 10px", border: "1px solid rgba(205,180,219,0.4)", borderRadius: 8, fontSize: 12, fontFamily: "'Plus Jakarta Sans',sans-serif", outline: "none", background: "rgba(255,255,255,0.8)" }} />
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  style={{ flex: 1, padding: "7px 10px", border: "1px solid rgba(205,180,219,0.4)", borderRadius: 8, fontSize: 12, fontFamily: "'Plus Jakarta Sans',sans-serif", outline: "none", background: "rgba(255,255,255,0.8)" }} />
              </div>
              <textarea required rows={2} value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Tell me about your project..."
                style={{ width: "100%", padding: "7px 10px", border: "1px solid rgba(205,180,219,0.4)", borderRadius: 8, fontSize: 12, fontFamily: "'Plus Jakarta Sans',sans-serif", outline: "none", resize: "none", background: "rgba(255,255,255,0.8)", boxSizing: "border-box", marginBottom: 8 }} />
              <button type="submit"
                style={{
                  width: "100%", padding: "9px", border: "none",
                  background: "linear-gradient(135deg, #CDB4DB, #D8C8FF)",
                  borderRadius: 8, fontSize: 12, cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  color: "#2E2E2E", letterSpacing: "0.1em",
                  boxShadow: "0 4px 16px rgba(180,150,220,0.25)",
                }}>
                Send Message
              </button>
            </form>
          ) : (
            <div style={{
              textAlign: "center",
              background: "rgba(255,255,255,0.75)",
              borderRadius: 14,
              padding: "20px 14px",
              border: "1.5px solid rgba(205,180,219,0.3)",
            }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>✓</div>
              <p style={{ margin: 0, fontSize: 14, fontFamily: "'Abril Fatface',serif", color: "#2E2E2E" }}>Sent!</p>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "rgba(46,46,46,0.5)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Azka will be in touch. ✦</p>
            </div>
          )}
        </div>
      </div>

      <p style={{
        textAlign: "center",
        marginTop: 20,
        fontSize: 9,
        color: "rgba(46,46,46,0.3)",
        letterSpacing: "0.15em",
        fontFamily: "'Space Mono', monospace",
      }}>
        AZKA · V 2026 · CRAFTED WITH 'Frustration to build something different'
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// END WALL
// ─────────────────────────────────────────────────────────────────────────────

function EndWall({ sceneZ }: { sceneZ: number }) {
  const endZ = -9600;
  const visible = Math.max(0, Math.min(1, (sceneZ - 220) / 240));
  return (
    <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: `translate(-50%, -50%) translateZ(${endZ}px)`,
      width: 900,
      height: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, rgba(88,28,135,0.6) 0%, rgba(109,40,217,0.4) 50%, rgba(124,58,237,0.5) 100%)",
      border: "2px solid rgba(192,132,252,0.4)",
      borderRadius: 8,
      backdropFilter: "blur(8px)",
      boxShadow: "0 0 80px rgba(168,85,247,0.3), inset 0 0 60px rgba(88,28,135,0.3)",
      pointerEvents: "none",
      opacity: visible,
      transition: "opacity 0.25s ease-out",
    }}>
      {/* Ornamental corners */}
      {[
        { top: 16, left: 16 },
        { top: 16, right: 16 },
        { bottom: 16, left: 16 },
        { bottom: 16, right: 16 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute",
          ...pos,
          width: 40,
          height: 40,
          border: "1.5px solid rgba(192,132,252,0.5)",
          borderRadius: 2,
        }} />
      ))}
      <div style={{ textAlign: "center" }}>
        <p style={{
          margin: "0 0 8px",
          fontFamily: "'Abril Fatface', serif",
          fontSize: 64,
          color: "rgba(192,132,252,0.25)",
          letterSpacing: "0.2em",
          lineHeight: 1,
        }}>AZKA</p>
        <p style={{
          margin: 0,
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          color: "rgba(192,132,252,0.3)",
          letterSpacing: "0.4em",
        }}>END OF CORRIDOR</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CORRIDOR 3D COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function Corridor3D() {
  const scrollYMV = useMotionValue(0);
  const smoothedScroll = useSpring(scrollYMV, { damping: 28, stiffness: 180, mass: 0.8 });
  const [maxScroll, setMaxScroll] = useState(1);
  const [rawSceneZ, setRawSceneZ] = useState(0);

  useEffect(() => {
    const update = () => {
      const total = (PAGES - 1) * window.innerHeight;
      setMaxScroll(total);
    };
    update();
    window.addEventListener("resize", update);

    const onScroll = () => scrollYMV.set(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Subscribe to smoothed spring to read sceneZ for door open/close logic
  useEffect(() => {
    return smoothedScroll.on("change", (v) => {
      setRawSceneZ((v / maxScroll) * SCENE_Z);
    });
  }, [smoothedScroll, maxScroll]);

  const sceneZ = rawSceneZ;

  const activeDoor = DOORS.slice().reverse().find((door) => sceneZ >= Math.abs(door.z) - 500) ?? DOORS[0];
  const wallColorStrong = hexToRgba(activeDoor.frame, 0.16);
  const wallColorSoft = hexToRgba(activeDoor.frame, 0.08);
  const wallGradientLeft = `linear-gradient(to right, ${wallColorStrong}, ${wallColorSoft})`;
  const wallGradientRight = `linear-gradient(to left, ${wallColorStrong}, ${wallColorSoft})`;

  // Do not show doors until scroll begins; hero section stays visible until after small scroll
  const doorVisibility = Math.max(0, Math.min(1, (sceneZ - 220) / 240));
  const avatarOpacity = Math.max(0, 1 - sceneZ / 380);
  const heroOpacity = Math.max(0, 1 - sceneZ / 320);

  return (
    <>
      {/* Inject keyframes */}
      <style>{`
        @keyframes float-petal {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(8deg); }
        }
        @keyframes scanline {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>

      {/* Perspective viewport */}
      <div style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: `radial-gradient(ellipse at 50% 45%, #e8d8ff 0%, #D9F2FF 40%, #c8d8ee 100%)`,
        perspective: `${PERSP}px`,
        perspectiveOrigin: "50% 48%",
      }}>
        {/* 3D Scene — translateZ drives camera movement */}
        <motion.div style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          translateZ: useTransform(smoothedScroll, [0, maxScroll], [0, SCENE_Z]),
        }}>

          {/* ── TUNNEL RINGS ── */}
          {RINGS.map((ring, i) => (
            <div key={i} style={{
              position: "absolute",
              top: "48%",
              left: "50%",
              width: ring.width,
              height: ring.height,
              transform: `translate(-50%, -50%) translateZ(${ring.z}px)`,
              border: `1px solid rgba(120,60,180,${ring.opacity})`,
              borderRadius: 6,
              pointerEvents: "none",
            }} />
          ))}

          {/* ── FLOOR PLANE ── */}
          <div style={{
            position: "absolute",
            width: "400vw",
            height: "9000px",
            left: "-150vw",
            top: "58%",
            transform: "rotateX(88deg)",
            transformOrigin: "top center",
            background: "linear-gradient(to bottom, rgba(180,210,240,0.15), rgba(160,200,230,0.05))",
            pointerEvents: "none",
          }} />

          {/* ── CEILING PLANE ── */}
          <div style={{
            position: "absolute",
            width: "400vw",
            height: "9000px",
            left: "-150vw",
            bottom: "58%",
            transform: "rotateX(-88deg)",
            transformOrigin: "bottom center",
            background: "linear-gradient(to top, rgba(220,200,255,0.15), transparent)",
            pointerEvents: "none",
          }} />

          {/* ── LEFT WALL ── */}
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: "4000px",
            transformOrigin: "left center",
            transform: "rotateY(90deg)",
            background: wallGradientLeft,
            pointerEvents: "none",
          }} />

          {/* ── RIGHT WALL ── */}
          <div style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: "4000px",
            transformOrigin: "right center",
            transform: "rotateY(-90deg)",
            background: wallGradientRight,
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            bottom: "42%",
            right: "calc(50% - 262px)",
            width: 4,
            height: "9000px",
            background: "linear-gradient(to bottom, rgba(120,60,180,0.35), transparent)",
            transform: "rotateX(88deg)",
            transformOrigin: "top center",
            pointerEvents: "none",
          }} />

          {/* ── FLOOR GLOW STRIP ── */}
          <div style={{
            position: "absolute",
            width: "0px",
            height: "9000px",
            left: "50%",
            top: "58%",
            transform: "translateX(-50%) rotateX(88deg)",
            transformOrigin: "top center",
            background: "linear-gradient(to bottom, #c8a8ff, transparent)",
            boxShadow: "0 0 20px #c8a8ff",
            pointerEvents: "none",
          }} />

          {/* ── LEFT WALL PLACARD WITH PERSPECTIVE TEXT (hero section) ── */}
          <div style={{
            position: "absolute",
            bottom: "30%",
            left: "3%",
            width: 360,
            transform: "translateZ(0px) perspective(950px) rotateY(26deg)",
            transformOrigin: "left center",
            opacity: heroOpacity,
            pointerEvents: "none",
          }}>
            <div style={{
              background: "rgba(88,28,135,0.18)",
              border: "2px solid rgba(88,28,135,0.34)",
              borderRadius: 16,
              padding: "24px 26px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 18px 40px rgba(88,28,135,0.18)",
            }}>
              <p style={{
                margin: "0 0 10px",
                fontSize: "clamp(26px, 4vw, 48px)",
                fontFamily: "'Space Mono', monospace",
                color: "rgba(88,28,135,1)",
                letterSpacing: "0.08em",
                fontWeight: 800,
                lineHeight: 1.02,
              }}>
                <GlitchText text="JUST A CS STUDENT?" />
              </p>
              <p style={{
                margin: 0,
                fontSize: "clamp(22px, 3.4vw, 40px)",
                fontFamily: "'Space Mono', monospace",
                color: "rgba(88,28,135,0.95)",
                letterSpacing: "0.1em",
                fontWeight: 800,
                lineHeight: 1.06,
              }}>
                <GlitchText text="NO WAY." />
              </p>
            </div>
          </div>

          {/* ── AVATAR BILLBOARD WITH 3D MODEL ── */}
          <div style={{
            position: "absolute",
            bottom: "0%",
            left: "27%",
            width: 320,
            height: 500,
            transform: "translateX(-50%) translateZ(0px)",
            opacity: avatarOpacity,
            transition: "opacity 0.15s",
            pointerEvents: "none",
          }}>
            <ModelViewer
              modelPath="/models/avatarstatic.glb"
              alt="Azka 3D Model"
              scale={1.45}
              rotation={[0, 0.2, 0]}
              position={[0, -0.5, 0]}
              cameraPosition={[0, 0.85, 3.2]}
              autoRotate={false}
              floatAnim={false}
              oscillate={true}
              oscillationSpeed={0.35}
              oscillationAmplitude={0.40}
            />
          </div>

          {/* ── RIGHT WALL TEXT (NUST CS Final Year Student) ── */}
          <div style={{
            position: "absolute",
            top: "46%",
            right: "10%",
            width: 280,
            transform: "translateY(-50%) translateZ(-10px) perspective(950px) rotateY(-34deg)",
            transformOrigin: "right center",
            opacity: heroOpacity,
            pointerEvents: "none",
          }}>
            <div style={{
              background: "rgba(255,255,255,0.18)",
              border: "2px solid rgba(88,28,135,0.28)",
              borderRadius: 18,
              padding: "22px 20px",
              boxShadow: "0 20px 55px rgba(88,28,135,0.14)",
              backdropFilter: "blur(10px)",
            }}>
              <p style={{
                margin: "0 0 10px",
                fontSize: "clamp(18px, 2vw, 30px)",
                fontFamily: "'Space Mono', monospace",
                color: "rgba(88,28,135,0.98)",
                fontWeight: 800,
                letterSpacing: "0.08em",
                lineHeight: 1.05,
              }}>NUST CS FINAL YEAR STUDENT</p>
              <p style={{
                margin: 0,
                fontSize: "clamp(12px, 1.35vw, 16px)",
                fontFamily: "'Space Mono', monospace",
                color: "rgba(88,28,135,0.72)",
                lineHeight: 1.5,
              }}>Looking for a role that doesn't kill my creativity</p>
            </div>
          </div>

          {/* ── LAPTOP MODEL ON RIGHT SIDE ── */}
          <div style={{
            position: "absolute",
            top: "58%",
            right: "12%",
            width: 260,
            height: 260,
            transform: "translateY(-50%) translateZ(0px) perspective(700px) rotateY(-18deg)",
            opacity: heroOpacity,
            pointerEvents: "none",
          }}>
            <ModelViewer
key="laptop-model" modelPath="/models/laptop.glb"              alt="Laptop 3D Model"
              scale={1.4}
              rotation={[-0.18, 0.62, 0]}
              position={[0, 0.4, 0]}
              cameraPosition={[0, 0.6, 3.1]}
              autoRotate={true}
              floatAnim={false}
            />
          </div>

          {/* ── HERO TEXT (AZKA behind avatar) ── */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) translateZ(-420px)",
            opacity: heroOpacity,
            textAlign: "center",
            pointerEvents: "none",
          }}>
            <h1 style={{
              fontFamily: "'Abril Fatface', serif",
              fontSize: "clamp(100px, 18vw, 260px)",
              color: "rgba(88,28,135,0.65)",
              lineHeight: 0.85,
              letterSpacing: "-0.01em",
              margin: 0,
            }}>
              AZKA
            </h1>
          </div>

          {/* ── GLITCH SUBTITLE (scroll prompt) ── */}
          <div style={{
            position: "absolute",
            bottom: "28%",
            left: "50%",
            transform: "translateX(-50%) translateZ(20px)",
            opacity: 4,
            textAlign: "center",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}>
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                margin: "8px 0 0",
                fontSize: "clamp(13px, 1vw, 11px)",
                fontFamily: "'Space Mono', monospace",
                color: "rgba(88,28,135,0.55)",
                letterSpacing: "0.4em",
              }}
            >
              SCROLL <b> 2 </b>EXPLORE            
              </motion.p>
          </div>

          {/* ── AMBIENT FLOATING DOTS ── */}
          {Array.from({ length: 50 }, (_, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                top: `${10 + (i * 37) % 80}%`,
                left: `${5 + (i * 53) % 90}%`,
                width: 3 + (i % 4),
                height: 3 + (i % 4),
                borderRadius: "50%",
                background: ["#e8d0ff", "#ffd8e8", "#c8e8ff", "#d8fce8"][i % 4],
                transform: `translateZ(${-(i * 170) % 7500}px)`,
                pointerEvents: "none",
                boxShadow: `0 0 6px ${["#e8d0ff", "#ffd8e8", "#c8e8ff", "#d8fce8"][i % 4]}`,
              }}
              animate={{ y: [0, -8, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
            />
          ))}

          {/* ── DOOR PORTALS ── */}
          {DOORS.map((door) => (
            <DoorPortal key={door.id} config={door} sceneZ={sceneZ} />
          ))}

          {/* ── END WALL ── */}
          <EndWall sceneZ={sceneZ} />

          {/* ── GARDEN END ── */}
          <GardenEnd sceneZ={sceneZ} />

        </motion.div>
      </div>
    </>
  );
}


