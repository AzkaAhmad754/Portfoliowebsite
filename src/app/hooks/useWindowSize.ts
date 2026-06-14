import { useState, useEffect } from "react";

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
  isMobile: boolean;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
    isMobile: false,
  });

  useEffect(() => {
    function handleResize() {
      const w = typeof window !== "undefined" ? window.innerWidth : undefined;
      const h = typeof window !== "undefined" ? window.innerHeight : undefined;
      setWindowSize({
        width: w,
        height: h,
        isMobile: !!(w && w < 768),
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
