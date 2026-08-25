import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './ProfileCard.css';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(135deg, rgba(30, 40, 56, 0.4) 0%, rgba(139, 92, 246, 0.1) 100%)';

const ANIMATION_CONFIG = {
    INITIAL_DURATION: 1200,
    INITIAL_X_OFFSET: 70,
    INITIAL_Y_OFFSET: 60,
    DEVICE_BETA_OFFSET: 20,
    ENTER_TRANSITION_MS: 180
};

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

const ProfileCardComponent = ({
    avatarUrl,
    iconUrl,
    grainUrl,
    innerGradient,
    behindGlowEnabled = true,
    behindGlowColor,
    behindGlowSize,
    className = '',
    enableTilt = true,
    enableMobileTilt = false,
    mobileTiltSensitivity = 5,
    name,
    title,
    handle,
    status,
    contactText,
    showUserInfo = true,
    onContactClick
}) => {
    const wrapRef = useRef(null);
    const shellRef = useRef(null);

    const enterTimerRef = useRef(null);
    const leaveRafRef = useRef(null);

    const tiltEngine = useMemo(() => {
        if (!enableTilt) return null;

        let rafId = null;
        let running = false;
        let lastTs = 0;

        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const DEFAULT_TAU = 0.2; // Made slightly slower for "premium, heavy" feel
        const INITIAL_TAU = 0.8;
        let initialUntil = 0;

        const setVarsFromXY = (x, y) => {
            const shell = shellRef.current;
            const wrap = wrapRef.current;
            if (!shell || !wrap) return;

            const width = shell.clientWidth || 1;
            const height = shell.clientHeight || 1;

            const percentX = clamp((100 / width) * x);
            const percentY = clamp((100 / height) * y);

            const centerX = percentX - 50;
            const centerY = percentY - 50;

            const properties = {
                '--pointer-x': `${percentX}%`,
                '--pointer-y': `${percentY}%`,
                '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
                '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
                '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
                '--pointer-from-top': `${percentY / 100}`,
                '--pointer-from-left': `${percentX / 100}`,
                // Extremely subtle rotation max ±5deg
                '--rotate-x': `${round(-(centerX / 10))}deg`,
                '--rotate-y': `${round(centerY / 10)}deg`
            };

            for (const [k, v] of Object.entries(properties)) wrap.style.setProperty(k, v);
        };

        const step = ts => {
            if (!running) return;
            if (lastTs === 0) lastTs = ts;
            const dt = (ts - lastTs) / 1000;
            lastTs = ts;

            const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
            const k = 1 - Math.exp(-dt / tau);

            currentX += (targetX - currentX) * k;
            currentY += (targetY - currentY) * k;

            setVarsFromXY(currentX, currentY);

            const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

            if (stillFar || document.hasFocus()) {
                rafId = requestAnimationFrame(step);
            } else {
                running = false;
                lastTs = 0;
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            }
        };

        const start = () => {
            if (running) return;
            running = true;
            lastTs = 0;
            rafId = requestAnimationFrame(step);
        };

        return {
            setImmediate(x, y) {
                currentX = x;
                currentY = y;
                setVarsFromXY(currentX, currentY);
            },
            setTarget(x, y) {
                targetX = x;
                targetY = y;
                start();
            },
            toCenter() {
                const shell = shellRef.current;
                if (!shell) return;
                this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
            },
            beginInitial(durationMs) {
                initialUntil = performance.now() + durationMs;
                start();
            },
            getCurrent() {
                return { x: currentX, y: currentY, tx: targetX, ty: targetY };
            },
            cancel() {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
                running = false;
                lastTs = 0;
            }
        };
    }, [enableTilt]);

    const getOffsets = (evt, el) => {
        const rect = el.getBoundingClientRect();
        return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    };

    const handlePointerMove = useCallback(
        event => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const shell = shellRef.current;
            if (!shell || !tiltEngine) return;
            const { x, y } = getOffsets(event, shell);
            tiltEngine.setTarget(x, y);
        },
        [tiltEngine]
    );

    const handlePointerEnter = useCallback(
        event => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const shell = shellRef.current;
            if (!shell || !tiltEngine) return;

            shell.classList.add('active');
            shell.classList.add('entering');
            if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
            enterTimerRef.current = window.setTimeout(() => {
                shell.classList.remove('entering');
            }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

            const { x, y } = getOffsets(event, shell);
            tiltEngine.setTarget(x, y);
        },
        [tiltEngine]
    );

    const handlePointerLeave = useCallback(() => {
        const shell = shellRef.current;
        if (!shell || !tiltEngine) return;

        tiltEngine.toCenter();

        const checkSettle = () => {
            const { x, y, tx, ty } = tiltEngine.getCurrent();
            const settled = Math.hypot(tx - x, ty - y) < 0.6;
            if (settled) {
                shell.classList.remove('active');
                leaveRafRef.current = null;
            } else {
                leaveRafRef.current = requestAnimationFrame(checkSettle);
            }
        };
        if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
        leaveRafRef.current = requestAnimationFrame(checkSettle);
    }, [tiltEngine]);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!enableTilt || !tiltEngine) return;

        const shell = shellRef.current;
        if (!shell) return;

        shell.addEventListener('pointerenter', handlePointerEnter);
        shell.addEventListener('pointermove', handlePointerMove);
        shell.addEventListener('pointerleave', handlePointerLeave);

        const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
        const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
        tiltEngine.setImmediate(initialX, initialY);
        tiltEngine.toCenter();
        tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

        return () => {
            shell.removeEventListener('pointerenter', handlePointerEnter);
            shell.removeEventListener('pointermove', handlePointerMove);
            shell.removeEventListener('pointerleave', handlePointerLeave);
            if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
            if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
            tiltEngine.cancel();
            shell.classList.remove('entering');
        };
    }, [
        enableTilt,
        tiltEngine,
        handlePointerMove,
        handlePointerEnter,
        handlePointerLeave
    ]);

    const cardStyle = useMemo(
        () => ({
            '--icon': iconUrl ? `url(${iconUrl})` : 'none',
            '--grain': grainUrl ? `url(${grainUrl})` : 'none',
            '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT,
            '--behind-glow-color': behindGlowColor ?? 'rgba(139, 92, 246, 0.4)',
            '--behind-glow-size': behindGlowSize ?? '60%'
        }),
        [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize]
    );

    return (
        <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()} style={cardStyle}>
            {behindGlowEnabled && <div className="pc-behind" />}

            {/* Ambient Floating Tech Elements - Outer Layer */}
            <div className="pc-ambient pc-ambient--top-left">[01:00]</div>
            <div className="pc-ambient pc-ambient--bottom-right">&lt;/&gt;</div>

            <div ref={shellRef} className="pc-card-shell">
                <section className="pc-card">

                    {/* BACK LAYER - Tech Grid */}
                    <div className="pc-layer pc-layer--back">
                        <div className="pc-tech-grid" />
                    </div>

                    {/* MIDDLE LAYER - Glass Panel */}
                    <div className="pc-layer pc-layer--middle pc-inside">
                        <div className="pc-shine" />
                        <div className="pc-glare" />
                    </div>

                    {/* FRONT LAYER - Avatar & Info  */}
                    <div className="pc-layer pc-layer--front pc-content">
                        <div className="pc-avatar-wrap">
                            <img
                                className="avatar"
                                src={avatarUrl}
                                alt="User Avatar"
                                loading="lazy"
                            />
                        </div>

                        {/* Subtly Floating Tech Data inside card */}
                        <div className="pc-inner-tech pc-inner-tech--sys">SYS.ACTIVE</div>
                    </div>

                </section>
            </div>
        </div>
    );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
