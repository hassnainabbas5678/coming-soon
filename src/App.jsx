import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function App() {
  const mouseX = useMotionValue(window.innerWidth / 2);
  const mouseY = useMotionValue(window.innerHeight / 2);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const canvasRef = useRef(null);

  // Track mouse
  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00f2ff";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#05070b] font-orbitron">
      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Glow */}
      <motion.div
        className="absolute rounded-full bg-gradient-to-br from-[#00f2ff33] to-transparent blur-[60px] w-[300px] sm:w-[350px] md:w-[400px] h-[300px] sm:h-[350px] md:h-[400px] pointer-events-none z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ x: smoothX, y: smoothY }}
      />

      {/* Content */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-[#8efcff] uppercase mb-2 sm:mb-3 text-lg sm:text-xl md:text-2xl tracking-wider drop-shadow-[0_0_6px_#00f2ff]">
          Innovify Edge
        </h2>
        <h1 className="text-[#00f2ff] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-widest drop-shadow-[0_0_12px_#00f2ff]">
          COMING SOON
        </h1>
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-[#b6faff] drop-shadow-[0_0_6px_#00f2ff] max-w-md">
          Engineering the future of software
        </p>
      </motion.div>
    </div>
  );
}
