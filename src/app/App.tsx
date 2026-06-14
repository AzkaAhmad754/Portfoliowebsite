import { useEffect } from "react";
import { Corridor3D } from "./components/Corridor3D";
import { CursorSparkle } from "./components/CursorSparkle";

export default function App() {
  useEffect(() => {
    // Make body tall so the page is scrollable — drives the 3D camera
    document.body.style.height = `${PAGES * 100}vh`;
    document.body.style.overflowX = "hidden";

    const style = document.createElement("style");
    style.textContent = `
      html { scroll-behavior: smooth; }
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 0; }
      body { cursor: none; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.style.height = "";
      document.body.style.overflowX = "";
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {/* CSS 3D scroll-driven corridor — fixed, fills viewport */}
      <Corridor3D />
      {/* Sparkle cursor trail — canvas overlay */}
      <CursorSparkle />
    </>
  );
}

const PAGES = 14;
