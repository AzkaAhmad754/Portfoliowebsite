import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

const COLORS = [
  "rgba(205,180,219,",
  "rgba(216,200,255,",
  "rgba(217,242,255,",
  "rgba(255,255,255,",
  "rgba(180,200,255,",
  "rgba(255,200,230,",
];

export function CursorSparkle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);
  const lastSpawn = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const spawnParticle = () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.current.push({
        x: mouse.current.x + (Math.random() - 0.5) * 10,
        y: mouse.current.y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        maxLife: 1,
        size: Math.random() * 6 + 2,
        color,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    };

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, alpha: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `${color}${alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `${color}0.8)`;
      const spikes = 4;
      const outerR = size;
      const innerR = size * 0.4;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const a = (i * Math.PI) / spikes;
        if (i === 0) ctx.moveTo(r * Math.cos(a), r * Math.sin(a));
        else ctx.lineTo(r * Math.cos(a), r * Math.sin(a));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawCursorIcon = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = "rgba(255,255,255,0.95)";
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "rgba(255,255,255,0.8)";
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(2.5, 0);
      ctx.lineTo(6, -1.5);
      ctx.lineTo(9, 6);
      ctx.lineTo(7.5, 6.5);
      ctx.lineTo(5.5, -0.5);
      ctx.lineTo(0, 2);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    const loop = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (time - lastSpawn.current > 20) {
        spawnParticle();
        if (Math.random() > 0.6) spawnParticle();
        lastSpawn.current = time;
      }

      particles.current = particles.current.filter((p) => p.life > 0);
      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life -= 0.025;
        p.rotation += p.rotationSpeed;
        drawStar(ctx, p.x, p.y, p.size * p.life, p.rotation, p.life, p.color);
      }

      drawCursorIcon(ctx, mouse.current.x, mouse.current.y);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
