import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './ProfileCard.css';

/* ─── Helpers ─── */
const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, p = 3) => parseFloat(v.toFixed(p));
const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

const ANIMATION_CONFIG = {
    INITIAL_DURATION: 1200,
    INITIAL_X_OFFSET: 70,
    INITIAL_Y_OFFSET: 60,
    ENTER_TRANSITION_MS: 180
};

/* ─── Elastic Drag Hook ─── */
function useElasticDrag(wrapRef) {
    const stateRef = useRef({
        dragging: false,
        startX: 0,
        startY: 0,
        curX: 0,
        curY: 0,
        velX: 0,
        velY: 0,
        rafId: null,
    });

    const STIFFNESS = 0.14;
    const DAMPING = 0.72;
    const MAX_DRAG = 110;

    const applyTransform = useCallback((x, y, scale = 1) => {
        const el = wrapRef.current;
        if (!el) return;
        el.style.setProperty('--drag-x', `${x}px`);
        el.style.setProperty('--drag-y', `${y}px`);
        el.style.setProperty('--drag-scale', `${scale}`);
    }, [wrapRef]);

    const springLoop = useCallback(() => {
        const s = stateRef.current;
        if (s.dragging) return;
        const ax = -s.curX * STIFFNESS;
        const ay = -s.curY * STIFFNESS;
        s.velX = (s.velX + ax) * DAMPING;
        s.velY = (s.velY + ay) * DAMPING;
        s.curX += s.velX;
        s.curY += s.velY;
        const dist = Math.hypot(s.curX, s.curY);
        const scale = 1 + (dist / MAX_DRAG) * 0.05;
        applyTransform(s.curX, s.curY, scale);
        if (Math.abs(s.curX) > 0.2 || Math.abs(s.curY) > 0.2) {
            s.rafId = requestAnimationFrame(springLoop);
        } else {
            s.curX = 0; s.curY = 0; s.velX = 0; s.velY = 0;
            applyTransform(0, 0, 1);
            s.rafId = null;
        }
    }, [applyTransform]);

    const onPointerDown = useCallback((e) => {
        const el = wrapRef.current;
        if (!el) return;
        e.preventDefault();
        const s = stateRef.current;
        if (s.rafId) { cancelAnimationFrame(s.rafId); s.rafId = null; }
        s.dragging = true;
        s.startX = e.clientX - s.curX;
        s.startY = e.clientY - s.curY;
        el.setPointerCapture(e.pointerId);
        el.classList.add('dragging');
    }, [wrapRef]);

    const onPointerMove = useCallback((e) => {
        const s = stateRef.current;
        if (!s.dragging) return;
        const rawX = e.clientX - s.startX;
        const rawY = e.clientY - s.startY;
        const dist = Math.hypot(rawX, rawY);
        const factor = dist > 0 ? Math.min(1, MAX_DRAG / dist) * Math.sqrt(dist / MAX_DRAG) : 1;
        s.curX = rawX * factor * 0.85;
        s.curY = rawY * factor * 0.85;
        const scale = 1 + (Math.hypot(s.curX, s.curY) / MAX_DRAG) * 0.06;
        applyTransform(s.curX, s.curY, scale);
    }, [applyTransform]);

    const onPointerUp = useCallback((e) => {
        const el = wrapRef.current;
        if (!el) return;
        const s = stateRef.current;
        if (!s.dragging) return;
        s.dragging = false;
        s.velX = -s.curX * 0.18;
        s.velY = -s.curY * 0.18;
        el.classList.remove('dragging');
        if (s.rafId) cancelAnimationFrame(s.rafId);
        s.rafId = requestAnimationFrame(springLoop);
    }, [wrapRef, springLoop]);

    return { onPointerDown, onPointerMove, onPointerUp };
}

/* ─── Profile Card ─── */
const ProfileCardComponent = ({
    avatarUrl,
    innerGradient,
    behindGlowEnabled = true,
    behindGlowColor,
    className = '',
    enableTilt = true,
    name,
}) => {
    const wrapRef = useRef(null);
    const shellRef = useRef(null);
    const enterTimerRef = useRef(null);
    const leaveRafRef = useRef(null);

    /* ── Tilt Engine ── */
    const tiltEngine = useMemo(() => {
        if (!enableTilt) return null;
        let rafId = null, running = false, lastTs = 0;
        let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
        const DEFAULT_TAU = 0.2, INITIAL_TAU = 0.8;
        let initialUntil = 0;

        const setVarsFromXY = (x, y) => {
            const shell = shellRef.current;
            const wrap = wrapRef.current;
            if (!shell || !wrap) return;
            const w = shell.clientWidth || 1;
            const h = shell.clientHeight || 1;
            const px = clamp((100 / w) * x);
            const py = clamp((100 / h) * y);
            const cx = px - 50, cy = py - 50;
            const props = {
                '--pointer-x': `${px}%`, '--pointer-y': `${py}%`,
                '--background-x': `${adjust(px, 0, 100, 35, 65)}%`,
                '--background-y': `${adjust(py, 0, 100, 35, 65)}%`,
                '--pointer-from-center': `${clamp(Math.hypot(py - 50, px - 50) / 50, 0, 1)}`,
                '--pointer-from-top': `${py / 100}`,
                '--pointer-from-left': `${px / 100}`,
                '--rotate-x': `${round(-(cx / 10))}deg`,
                '--rotate-y': `${round(cy / 10)}deg`,
            };
            for (const [k, v] of Object.entries(props)) wrap.style.setProperty(k, v);
        };

        const step = ts => {
            if (!running) return;
            if (lastTs === 0) lastTs = ts;
            const dt = (ts - lastTs) / 1000; lastTs = ts;
            const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
            const k = 1 - Math.exp(-dt / tau);
            currentX += (targetX - currentX) * k;
            currentY += (targetY - currentY) * k;
            setVarsFromXY(currentX, currentY);
            const far = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;
            if (far || document.hasFocus()) { rafId = requestAnimationFrame(step); }
            else { running = false; lastTs = 0; if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
        };

        const start = () => { if (running) return; running = true; lastTs = 0; rafId = requestAnimationFrame(step); };

        return {
            setImmediate(x, y) { currentX = x; currentY = y; setVarsFromXY(x, y); },
            setTarget(x, y) { targetX = x; targetY = y; start(); },
            toCenter() { const s = shellRef.current; if (!s) return; this.setTarget(s.clientWidth / 2, s.clientHeight / 2); },
            beginInitial(ms) { initialUntil = performance.now() + ms; start(); },
            getCurrent() { return { x: currentX, y: currentY, tx: targetX, ty: targetY }; },
            cancel() { if (rafId) cancelAnimationFrame(rafId); rafId = null; running = false; lastTs = 0; }
        };
    }, [enableTilt]);

    const getOffsets = (evt, el) => { const r = el.getBoundingClientRect(); return { x: evt.clientX - r.left, y: evt.clientY - r.top }; };

    const handlePointerMove = useCallback(e => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const s = shellRef.current; if (!s || !tiltEngine) return;
        const { x, y } = getOffsets(e, s); tiltEngine.setTarget(x, y);
    }, [tiltEngine]);

    const handlePointerEnter = useCallback(e => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const s = shellRef.current; if (!s || !tiltEngine) return;
        s.classList.add('active', 'entering');
        if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
        enterTimerRef.current = setTimeout(() => s.classList.remove('entering'), ANIMATION_CONFIG.ENTER_TRANSITION_MS);
        const { x, y } = getOffsets(e, s); tiltEngine.setTarget(x, y);
    }, [tiltEngine]);

    const handlePointerLeave = useCallback(() => {
        const s = shellRef.current; if (!s || !tiltEngine) return;
        tiltEngine.toCenter();
        const check = () => {
            const { x, y, tx, ty } = tiltEngine.getCurrent();
            if (Math.hypot(tx - x, ty - y) < 0.6) { s.classList.remove('active'); leaveRafRef.current = null; }
            else leaveRafRef.current = requestAnimationFrame(check);
        };
        if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
        leaveRafRef.current = requestAnimationFrame(check);
    }, [tiltEngine]);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!enableTilt || !tiltEngine) return;
        const s = shellRef.current; if (!s) return;
        s.addEventListener('pointerenter', handlePointerEnter);
        s.addEventListener('pointermove', handlePointerMove);
        s.addEventListener('pointerleave', handlePointerLeave);
        tiltEngine.setImmediate((s.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET, ANIMATION_CONFIG.INITIAL_Y_OFFSET);
        tiltEngine.toCenter();
        tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);
        return () => {
            s.removeEventListener('pointerenter', handlePointerEnter);
            s.removeEventListener('pointermove', handlePointerMove);
            s.removeEventListener('pointerleave', handlePointerLeave);
            if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
            if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
            tiltEngine.cancel();
            s.classList.remove('entering');
        };
    }, [enableTilt, tiltEngine, handlePointerMove, handlePointerEnter, handlePointerLeave]);

    /* ── Elastic Drag ── */
    const { onPointerDown, onPointerMove: onDragMove, onPointerUp } = useElasticDrag(wrapRef);

    const cardStyle = useMemo(() => ({
        '--behind-glow-color': behindGlowColor ?? 'rgba(249, 115, 22, 0.5)',
        '--drag-x': '0px',
        '--drag-y': '0px',
        '--drag-scale': '1',
    }), [behindGlowColor]);

    return (
        <div
            ref={wrapRef}
            className={`pc-card-wrapper ${className}`.trim()}
            style={cardStyle}
            onPointerDown={onPointerDown}
            onPointerMove={onDragMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        >
            {behindGlowEnabled && <div className="pc-behind" />}

            <div ref={shellRef} className="pc-card-shell">
                <section className="pc-card">
                    {/* Orange top strip */}
                    <div className="pc-top-strip" />

                    {/* ── HUD Top Row ── */}
                    <div className="pc-hud pc-hud--top">
                        <div className="pc-hud-stat">
                            <span className="pc-hud-stat__icon">◈</span>
                            <div>
                                <div className="pc-hud-stat__value">SOFTWARE</div>
                                <div className="pc-hud-stat__label">ENGINEER</div>
                            </div>
                        </div>
                        <div className="pc-hud-center">B.TECH</div>
                        <div className="pc-hud-right">
                            <span className="pc-hud-dot" />
                            <span className="pc-hud-right__text">CSE 2029</span>
                        </div>
                    </div>

                    {/* ── HUD Badge Row ── */}
                    <div className="pc-hud pc-hud--badges">
                        <div className="pc-badge">⬡ REACT</div>
                        <div className="pc-badge pc-badge--right">◎ NODE.JS <span>@BACKEND</span></div>
                    </div>

                    {/* ── Photo Layer ── */}
                    <div className="pc-photo-layer">
                        <img
                            className="pc-photo"
                            src={avatarUrl}
                            alt={name || 'Profile'}
                            draggable={false}
                        />
                        {/* Orange cinematic overlay */}
                        <div className="pc-photo-overlay" />
                        {/* Shine on hover */}
                        <div className="pc-shine" />
                    </div>

                    {/* ── ID Footer ── */}
                    <div className="pc-footer">
                        <div className="pc-footer__info">
                            <div className="pc-footer__name">{name || 'SHAILENDRA SAHU'}</div>
                            <div className="pc-footer__role">SOFTWARE ENGINEER · AIT</div>
                        </div>
                        <button className="pc-footer__btn" aria-label="Info">⬡</button>
                    </div>

                    {/* Scan line */}
                    <div className="pc-scan-line" />
                </section>
            </div>

            {/* hint */}
            <div className="pc-drag-hint">⠿ DRAG · HOVER TO TILT</div>
        </div>
    );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
