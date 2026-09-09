"use client";

import { useEffect, useState } from "react";

export function OceanHUD() {
  const [session, setSession] = useState("00:00");
  const [fps, setFps] = useState(60);
  const [pos, setPos] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const start = performance.now();
    let frames = 0;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      frames += 1;
      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }
      const elapsed = Math.floor((now - start) / 1000);
      const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
      const ss = String(elapsed % 60).padStart(2, "0");
      setSession(`${mm}:${ss}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (event: PointerEvent) => {
      setPos({
        x: Math.round((event.clientX / window.innerWidth - 0.5) * 20),
        y: Math.round((0.5 - event.clientY / window.innerHeight) * 12),
        z: 3,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="ocean-hud" aria-hidden>
      <div className="ocean-hud-frame" />
      <div className="ocean-hud-title">MAD WORM</div>

      <aside className="ocean-hud-panel ocean-hud-left">
        <p className="ocean-hud-label">Telemetry</p>
        <div className="ocean-hud-row">
          <span>Depth</span>
          <strong>42M</strong>
        </div>
        <div className="ocean-hud-row">
          <span>Velocity</span>
          <strong>0.0 M/S</strong>
        </div>
        <div className="ocean-hud-row">
          <span>Session</span>
          <strong>{session}</strong>
        </div>
      </aside>

      <aside className="ocean-hud-panel ocean-hud-right">
        <p className="ocean-hud-label">Controls</p>
        <div className="ocean-hud-row">
          <span>Mouse</span>
          <strong>Navigate</strong>
        </div>
        <div className="ocean-hud-row">
          <span>Scroll</span>
          <strong>Zoom</strong>
        </div>
        <div className="ocean-hud-row">
          <span>Drag</span>
          <strong>Orbit</strong>
        </div>
      </aside>

      <div className="ocean-hud-status">
        <span>SYS ONLINE</span>
        <span>
          POS X:{pos.x} Y:{pos.y} Z:{pos.z}
        </span>
        <span>FPS {fps}</span>
      </div>
    </div>
  );
}
