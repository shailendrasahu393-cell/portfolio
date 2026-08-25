import { useEffect, useRef } from 'react';

/*
 * MatrixBg — Very subtle animated digital background.
 * Renders sparse, low-opacity floating characters on a canvas.
 * Automatically reduces to static on prefers-reduced-motion.
 * Lightweight: uses requestAnimationFrame and a single <canvas>.
 */

const CHARS = '01アイウエオカキクケコ{}[]<>/\\|';
const COLUMN_GAP = 20;          // px between columns (denser)
const FONT_SIZE = 12;            // px
const BASE_SPEED = 0.5;         // px per frame (faster)
const MAX_OPACITY = 0.15;        // higher visibility
const FADE_SPEED = 0.0015;

export default function MatrixBg() {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Create sparse columns
        const numCols = Math.floor(window.innerWidth / COLUMN_GAP);
        const drops = [];
        for (let i = 0; i < numCols; i++) {
            // 50% of columns are active for more density
            if (Math.random() > 0.5) continue;
            drops.push({
                x: i * COLUMN_GAP + Math.random() * 8,
                y: Math.random() * canvas.height,
                speed: BASE_SPEED + Math.random() * 0.3,
                opacity: Math.random() * MAX_OPACITY,
                fadeDir: Math.random() > 0.5 ? 1 : -1,
                char: CHARS[Math.floor(Math.random() * CHARS.length)],
                changeRate: 60 + Math.floor(Math.random() * 120), // frames between char change
                frame: 0,
            });
        }

        if (prefersReduced) {
            // Static render — draw once
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${FONT_SIZE}px 'Courier New', monospace`;
            for (const d of drops) {
                ctx.fillStyle = `rgba(139, 92, 246, ${d.opacity})`;
                ctx.fillText(d.char, d.x, d.y);
            }
            return () => window.removeEventListener('resize', resize);
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${FONT_SIZE}px 'Courier New', monospace`;

            for (const d of drops) {
                d.frame++;

                // Fade in/out
                d.opacity += FADE_SPEED * d.fadeDir;
                if (d.opacity >= MAX_OPACITY) { d.opacity = MAX_OPACITY; d.fadeDir = -1; }
                if (d.opacity <= 0.005) { d.opacity = 0.005; d.fadeDir = 1; }

                // Occasional character swap
                if (d.frame % d.changeRate === 0) {
                    d.char = CHARS[Math.floor(Math.random() * CHARS.length)];
                }

                // Draw
                ctx.fillStyle = `rgba(139, 92, 246, ${d.opacity})`;
                ctx.fillText(d.char, d.x, d.y);

                // Move down
                d.y += d.speed;
                if (d.y > canvas.height + 20) {
                    d.y = -20;
                    d.x = Math.floor(d.x / COLUMN_GAP) * COLUMN_GAP + Math.random() * 8;
                }
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: -1,
                pointerEvents: 'none',
                width: '100%',
                height: '100%',
            }}
        />
    );
}
