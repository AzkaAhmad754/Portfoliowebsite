import { useState } from "react";

export function MobileLayout() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const roles = [
    {
      id: 1,
      title: "UI/UX DESIGNER & FRONTEND DEVELOPER",
      role: "DESIGNER & EDITOR",
      color: "#A855F7",
      bgColor: "#6B21A8",
      skills: ["Figma", "21st.dev", "Stitch", "Claude Design", "Meshy", "Canva Pro"],
      company: "UI/UX Intern @ Hyperengage",
    },
    {
      id: 2,
      title: "CREATIVE WRITER",
      role: "WRITER",
      color: "#F59E0B",
      bgColor: "#92400E",
      skills: ["Poetry", "Short Stories", "Creative Narratives", "Articles", "SEO Content Writing"],
      company: "SEO Content Writer @ Shadiyana",
    },
    {
      id: 3,
      title: "CYBER SECURITY ANALYST",
      role: "SOC ANALYST",
      color: "#38BDF8",
      bgColor: "#0C4A6E",
      skills: ["Google Dorking", "Vulnerability Testing", "Kali", "Wireshark", "HUMINT Analysis"],
      company: "ResearchGate Publications",
    },
    {
      id: 4,
      title: "DATA ANALYTICS & STRATEGY",
      role: "DATA ANALYST & PROJECT MANAGER",
      color: "#129a44",
      bgColor: "#14532D",
      skills: ["Tableau", "Power BI", "Excel", "SQL", "Jupyter", "Notion", "Jira"],
      company: "20+ University Projects",
    },
    {
      id: 5,
      title: "PROJECTS",
      role: "DEVELOPER",
      color: "#C084FC",
      bgColor: "#7C3AED",
      skills: ["NFRW", "Chess AI", "Releaf", "Let's Unmask", "QuakeAlert PK", "Blood Connect"],
      company: "Full-Stack Developer",
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, rgba(88,28,135,0.05) 0%, rgba(168,85,247,0.08) 100%)",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {/* Hero Section */}
      <div style={{
        padding: "60px 20px 40px",
        textAlign: "center",
        borderBottom: "1px solid rgba(88,28,135,0.1)",
      }}>
        <h1 style={{
          fontFamily: "'Abril Fatface', serif",
          fontSize: "48px",
          color: "rgba(88,28,135,0.9)",
          margin: "0 0 12px",
          lineHeight: 1.2,
        }}>
          AZKA
        </h1>
        <p style={{
          fontSize: "18px",
          color: "rgba(88,28,135,0.7)",
          margin: "0 0 6px",
          fontWeight: 700,
          letterSpacing: "0.05em",
        }}>
          NUST CS FINAL YEAR STUDENT
        </p>
        <p style={{
          fontSize: "14px",
          color: "rgba(88,28,135,0.55)",
          margin: "0 0 20px",
          lineHeight: 1.5,
        }}>
          Looking for a role that doesn't kill my creativity
        </p>

        {/* Social Links */}
        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}>
          <a
            href="https://www.linkedin.com/in/azka-ahmad-2623162a3/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 16px",
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.3)",
              borderRadius: "20px",
              fontSize: "12px",
              color: "rgba(88,28,135,0.8)",
              textDecoration: "none",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(168,85,247,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(168,85,247,0.15)";
            }}
          >
            LinkedIn
          </a>
          <a
            href="mailto:aahmad.bscs23seecs@seecs.edu.pk"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 16px",
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.3)",
              borderRadius: "20px",
              fontSize: "12px",
              color: "rgba(88,28,135,0.8)",
              textDecoration: "none",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(168,85,247,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(168,85,247,0.15)";
            }}
          >
            Email
          </a>
        </div>
      </div>

      {/* Role Cards */}
      <div style={{
        padding: "30px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}>
        {roles.map((role) => (
          <div
            key={role.id}
            style={{
              background: "rgba(255,255,255,0.7)",
              border: `1.5px solid ${role.color}33`,
              borderRadius: "12px",
              padding: "18px",
              boxShadow: `0 4px 12px ${role.color}15`,
              backdropFilter: "blur(8px)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 20px ${role.color}25`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 12px ${role.color}15`;
            }}
          >
            <p
              style={{
                fontSize: "10px",
                color: role.color,
                margin: "0 0 4px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {role.role}
            </p>
            <h3
              style={{
                fontSize: "16px",
                color: "rgba(88,28,135,0.9)",
                margin: "0 0 2px",
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {role.title}
            </h3>
            <p
              style={{
                fontSize: "11px",
                color: role.color,
                margin: "0 0 10px",
                fontWeight: 600,
              }}
            >
              {role.company}
            </p>

            {/* Skills/Tools */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}>
              {role.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    display: "inline-block",
                    padding: "4px 8px",
                    background: `${role.color}15`,
                    border: `0.5px solid ${role.color}40`,
                    borderRadius: "12px",
                    fontSize: "10px",
                    color: role.color,
                    fontWeight: 500,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div style={{
        padding: "40px 16px 60px",
        borderTop: "1px solid rgba(88,28,135,0.1)",
      }}>
        <h2
          style={{
            fontFamily: "'Abril Fatface', serif",
            fontSize: "28px",
            color: "rgba(88,28,135,0.9)",
            margin: "0 0 8px",
            lineHeight: 1.2,
            textAlign: "center",
          }}
        >
          Let's Build
          <br />
          <span style={{ color: "rgba(168,85,247,0.8)" }}>Something Together</span>
        </h2>

        {!submitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            style={{
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              style={{
                padding: "12px 14px",
                border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                outline: "none",
                background: "rgba(255,255,255,0.85)",
                transition: "border 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)";
              }}
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{
                padding: "12px 14px",
                border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                outline: "none",
                background: "rgba(255,255,255,0.85)",
                transition: "border 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)";
              }}
            />
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me about your project..."
              style={{
                padding: "12px 14px",
                border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                outline: "none",
                background: "rgba(255,255,255,0.85)",
                resize: "none",
                transition: "border 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)";
              }}
            />
            <button
              type="submit"
              style={{
                padding: "14px",
                background: "linear-gradient(135deg, rgba(168,85,247,0.8), rgba(196,124,255,0.8))",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: "0.05em",
                transition: "all 0.2s",
                marginTop: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(168,85,247,1), rgba(196,124,255,1))";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(168,85,247,0.8), rgba(196,124,255,0.8))";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Send Message
            </button>
          </form>
        ) : (
          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
              padding: "24px",
              background: "rgba(18,154,68,0.08)",
              borderRadius: "8px",
              border: "1px solid rgba(18,154,68,0.2)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>✓</div>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "16px",
                fontFamily: "'Abril Fatface', serif",
                color: "rgba(88,28,135,0.9)",
              }}
            >
              Message Sent!
            </p>
            <p
              style={{
                margin: "0",
                fontSize: "12px",
                color: "rgba(88,28,135,0.6)",
              }}
            >
              Azka will get back to you soon. ✦
            </p>
          </div>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "40px",
            fontSize: "9px",
            color: "rgba(88,28,135,0.3)",
            letterSpacing: "0.1em",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          AZKA · V 2026 · CRAFTED WITH 'Frustration to build something different'
        </p>
      </div>
    </div>
  );
}
