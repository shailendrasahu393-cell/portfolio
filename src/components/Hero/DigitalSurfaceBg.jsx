import { useEffect, useRef, useState } from 'react';

/**
 * DigitalSurfaceBg
 * A lightweight canvas-based background for the Hero section.
 * Renders a subtle perspective grid, slowly moving nodes (particles), and connecting lines.
 * Reacts to mouse movement by gently repelling nodes and adding a slight glow.
 */

const CONFIG = {
    NODE_COUNT: 70,        // Sparsely populated
    CONNECTION_DIST: 140,  // Max distance to draw connecting lines
    MOUSE_RADIUS: 180,     // Radius of mouse interaction
    BASE_SPEED: 0.15,
    GRID_OPACITY: 0.03,
    NODE_OPACITY: 0.15,
    LINE_OPACITY: 0.05,
    ACCENT_COLOR: '249, 115, 22', // #f97316 (Orange)
    CYAN_COLOR: '251, 146, 60'    // #fb923c (Lighter Orange accent)
};

export default function DigitalSurfaceBg() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const rafRef = useRef(null);

    // Track reduced motion
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);
        const handleChange = (e) => setReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimize by making canvas opaque if possible, but we use it transparently. Actually, keep default (transparent).

        // For performance, we'll keep it transparent to merge with CSS gradient underneath.
        const ctxTransparent = canvas.getContext('2d');

        let width = 0;
        let height = 0;
        let nodes = [];

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initNodes();
        };

        const initNodes = () => {
            nodes = [];
            for (let i = 0; i < CONFIG.NODE_COUNT; i++) {
                nodes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * CONFIG.BASE_SPEED,
                    vy: (Math.random() - 0.5) * CONFIG.BASE_SPEED,
                    size: Math.random() * 1.5 + 0.5,
                    color: Math.random() > 0.8 ? CONFIG.CYAN_COLOR : CONFIG.ACCENT_COLOR
                });
            }
        };

        resize();
        window.addEventListener('resize', resize);

        const handleMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };
        const handleMouseLeave = () => {
            mouseRef.current.x = -1000;
            mouseRef.current.y = -1000;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        const drawGrid = () => {
            ctxTransparent.lineWidth = 1;
            ctxTransparent.strokeStyle = `rgba(255, 255, 255, ${CONFIG.GRID_OPACITY})`;

            // Draw horizontal perspective lines
            for (let y = height / 2; y < height; y += (y - height / 2) * 0.15 + 10) {
                ctxTransparent.beginPath();
                ctxTransparent.moveTo(0, y);
                ctxTransparent.lineTo(width, y);
                ctxTransparent.stroke();
            }

            // Draw vertical perspective lines vanishing to center
            const centerX = width / 2;
            const centerY = (height / 2) - 100; // Vanishing point slightly above center

            for (let x = -width; x < width * 2; x += 150) {
                ctxTransparent.beginPath();
                ctxTransparent.moveTo(centerX, centerY);
                ctxTransparent.lineTo(x, height);
                ctxTransparent.stroke();
            }
        };

        const drawStatic = () => {
            ctxTransparent.clearRect(0, 0, width, height);
            drawGrid();
            nodes.forEach(node => {
                ctxTransparent.beginPath();
                ctxTransparent.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                ctxTransparent.fillStyle = `rgba(${node.color}, ${CONFIG.NODE_OPACITY})`;
                ctxTransparent.fill();
            });
        };

        if (reducedMotion) {
            drawStatic();
            return () => {
                window.removeEventListener('resize', resize);
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseleave', handleMouseLeave);
            };
        }

        const animate = () => {
            ctxTransparent.clearRect(0, 0, width, height);

            // Draw subtle fading background to clear
            // But we have CSS background, so just clearRect is better

            drawGrid();

            const { x: mx, y: my } = mouseRef.current;

            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];

                // Update position
                node.x += node.vx;
                node.y += node.vy;

                // Bounce off edges
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                // Mouse interaction
                const dx = node.x - mx;
                const dy = node.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let currentOpacity = CONFIG.NODE_OPACITY;

                if (dist < CONFIG.MOUSE_RADIUS) {
                    // Repel slightly
                    const force = (CONFIG.MOUSE_RADIUS - dist) / CONFIG.MOUSE_RADIUS;
                    node.x += (dx / dist) * force * 0.5;
                    node.y += (dy / dist) * force * 0.5;

                    // Glow
                    currentOpacity = Math.min(0.6, CONFIG.NODE_OPACITY + force * 0.5);
                }

                // Draw connections
                for (let j = i + 1; j < nodes.length; j++) {
                    const other = nodes[j];
                    const odx = node.x - other.x;
                    const ody = node.y - other.y;
                    const odist = Math.sqrt(odx * odx + ody * ody);

                    if (odist < CONFIG.CONNECTION_DIST) {
                        const lineOpacity = (1 - odist / CONFIG.CONNECTION_DIST) * CONFIG.LINE_OPACITY;
                        ctxTransparent.beginPath();
                        ctxTransparent.moveTo(node.x, node.y);
                        ctxTransparent.lineTo(other.x, other.y);
                        ctxTransparent.strokeStyle = `rgba(${CONFIG.CYAN_COLOR}, ${lineOpacity})`;
                        ctxTransparent.lineWidth = 0.5;
                        ctxTransparent.stroke();
                    }
                }

                // Draw node
                ctxTransparent.beginPath();
                ctxTransparent.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                ctxTransparent.fillStyle = `rgba(${node.color}, ${currentOpacity})`;
                ctxTransparent.fill();

                // Draw technical data label on a few nodes near mouse
                if (dist < 80 && i % 3 === 0) {
                    ctxTransparent.fillStyle = `rgba(255, 255, 255, 0.4)`;
                    ctxTransparent.font = `8px 'Courier New', monospace`;
                    ctxTransparent.fillText(`[${node.x.toFixed(0)}]`, node.x + 4, node.y - 4);
                }
            }

            // Draw faint radial glow at mouse
            if (mx > 0 && my > 0) {
                const gradient = ctxTransparent.createRadialGradient(mx, my, 0, mx, my, CONFIG.MOUSE_RADIUS);
                gradient.addColorStop(0, `rgba(${CONFIG.ACCENT_COLOR}, 0.04)`);
                gradient.addColorStop(1, `transparent`);
                ctxTransparent.fillStyle = gradient;
                ctxTransparent.beginPath();
                ctxTransparent.arc(mx, my, CONFIG.MOUSE_RADIUS, 0, Math.PI * 2);
                ctxTransparent.fill();
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [reducedMotion]);

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
                height: '100%'
            }}
        />
    );
}
