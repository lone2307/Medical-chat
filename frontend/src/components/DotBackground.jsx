import React, { useEffect, useRef } from "react";

export default function DotBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // SETTINGS
    const NUM_DOTS = 180;
    const EXTRA_DOTS = 17;
    const DOT_RADIUS = 3;
    const DOT_COLOR = [245, 100, 169]; // no alpha here, we’ll control it per-dot
    const LINE_COLOR = [235, 110, 169];
    const NEAREST_K = 7;
    const MAX_LINE_DIST = 180;
    const FLOAT_SPEED = 0.6;
    const DAMPING = 0.96;

    const FADE_SPEED = 0.05; // how fast dots fade in/out per frame

    let dpr = Math.max(1, window.devicePixelRatio || 1);
    let width = 0,
      height = 0;
    let dots = [];
    let specialDots = [];
    let mouse = { x: null, y: null, active: false };

    function resize() {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
    }

    function buildDots() {
      dots = [];
      for (let i = 0; i < NUM_DOTS; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const vx = (Math.random() * 2 - 1) * 0.25;
        const vy = (Math.random() * 2 - 1) * 0.25;
        dots.push({ x, y, vx, vy, alpha: 0, connected: false });
      }

      specialDots = [];
      for (let i = 0; i < EXTRA_DOTS; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const vx = (Math.random() * 2 - 1) * 0.5;
        const vy = (Math.random() * 2 - 1) * 0.5;
        specialDots.push({ x, y, vx, vy });
      }
    }

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
      mouse.y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
      mouse.active = true;
    }
    function onPointerLeave() {
      mouse.x = null;
      mouse.y = null;
      mouse.active = false;
    }

    function findNearest(mx, my, k) {
      if (mx == null || my == null) return [];
      const arr = dots.map((d) => {
        const dx = d.x - mx;
        const dy = d.y - my;
        return { dot: d, dsq: dx * dx + dy * dy };
      });
      arr.sort((a, b) => a.dsq - b.dsq);
      return arr.slice(0, k);
    }

    let lastTime = performance.now();
    function frame(now) {
      const dt = Math.min(40, now - lastTime) / 1000;
      lastTime = now;

      // reset connection flags
      dots.forEach((d) => (d.connected = false));

      // update regular dots
      dots.forEach((d, i) => {
        d.vx += Math.sin(now * 0.001 + i) * 0.0009 * FLOAT_SPEED;
        d.vy += Math.cos(now * 0.001 + i) * 0.0009 * FLOAT_SPEED;
        d.vx *= DAMPING;
        d.vy *= DAMPING;
        d.x += d.vx * Math.max(1, 60 * dt);
        d.y += d.vy * Math.max(1, 60 * dt);

        if (d.x < 0) d.x = width;
        if (d.x > width) d.x = 0;
        if (d.y < 0) d.y = height;
        if (d.y > height) d.y = 0;
      });

      // update special dots
      specialDots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < 0 || d.x > width) d.vx *= -1;
        if (d.y < 0 || d.y > height) d.vy *= -1;
      });

      ctx.clearRect(0, 0, width, height);

      // connect mouse to nearest dots
      if (mouse.active) {
        const nearest = findNearest(mouse.x, mouse.y, NEAREST_K);
        nearest.forEach(({ dot, dsq }) => {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / MAX_LINE_DIST;
          if (t > 0) {
            dot.connected = true; // mark dot as connected
            ctx.strokeStyle = `rgba(${LINE_COLOR.join(",")}, ${
              Math.pow(t, 1.6) * 0.9
            })`;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(dot.x, dot.y);
            ctx.stroke();
          }
        });
      }

      // connect special dots to nearby regular dots
      specialDots.forEach((s) => {
        const nearest = findNearest(s.x, s.y, NEAREST_K);
        nearest.forEach(({ dot, dsq }) => {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / MAX_LINE_DIST;
          if (t > 0) {
            dot.connected = true; // mark dot as connected
            ctx.strokeStyle = `rgba(${LINE_COLOR.join(",")}, ${
              Math.pow(t, 1.6) * 0.9
            })`;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(dot.x, dot.y);
            ctx.stroke();
          }
        });
      });

      // update dot alpha (fade in/out)
      dots.forEach((d) => {
        if (d.connected) {
          d.alpha = Math.min(1, d.alpha + FADE_SPEED); // fade in
        } else {
          d.alpha = Math.max(0, d.alpha - FADE_SPEED); // fade out
        }
      });

      // draw visible dots only
      ctx.beginPath();
      dots.forEach((d) => {
        if (d.alpha > 0) {
          ctx.moveTo(d.x + DOT_RADIUS, d.y);
          ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
        }
      });
      ctx.fillStyle = `rgba(${DOT_COLOR.join(",")}, 1)`;
      ctx.globalAlpha = 1; // reset
      dots.forEach((d) => {
        if (d.alpha > 0) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${DOT_COLOR.join(",")}, ${d.alpha})`;
          ctx.fill();
        }
      });

      // draw special dots (always visible)
      ctx.beginPath();
      specialDots.forEach((d) => {
        ctx.moveTo(d.x + DOT_RADIUS, d.y);
        ctx.arc(d.x, d.y, DOT_RADIUS + 1.5, 0, Math.PI * 2);
      });
      ctx.fillStyle = `rgba(${LINE_COLOR.join(",")}, 0.9)`;
      ctx.fill();

      requestAnimationFrame(frame);
    }

    // listeners
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove);
    window.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("touchend", onPointerLeave);

    resize();
    requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("touchend", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
}
