import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import './PortfolioIntro.css';

/* ─── Configuration ─── */
const ENABLE_INTRO = true;
const SESSION_KEY = 'portfolioIntroPlayed';
const AUTO_ENTER_DELAY = 3.5; // seconds after CTA appears before auto-entering

/* ─── Helpers ─── */
const prefersReducedMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function PortfolioIntro({ onComplete }) {
    const overlayRef = useRef(null);
    const tlRef = useRef(null);
    const [phase, setPhase] = useState('loading'); // loading | cta | exiting | done
    const autoTimerRef = useRef(null);

    /* Skip intro entirely if disabled or already played this session */
    const shouldSkip = !ENABLE_INTRO || sessionStorage.getItem(SESSION_KEY) === 'true' || prefersReducedMotion();

    const exitIntro = useCallback(() => {
        if (phase === 'exiting' || phase === 'done') return;
        setPhase('exiting');

        if (autoTimerRef.current) {
            clearTimeout(autoTimerRef.current);
            autoTimerRef.current = null;
        }

        // Kill in-progress timeline
        if (tlRef.current) {
            tlRef.current.kill();
            tlRef.current = null;
        }

        const overlay = overlayRef.current;
        if (!overlay) {
            sessionStorage.setItem(SESSION_KEY, 'true');
            onComplete?.();
            return;
        }

        overlay.classList.add('intro--exiting');

        const exitTl = gsap.timeline({
            onComplete: () => {
                sessionStorage.setItem(SESSION_KEY, 'true');
                setPhase('done');
                onComplete?.();
            },
        });

        // Cinematic exit: glitch flash → zoom → fade
        exitTl
            .to('.intro-glitch-flash', { opacity: 0.8, duration: 0.06 })
            .to('.intro-glitch-flash', { opacity: 0, duration: 0.06 })
            .to('.intro-glitch-flash', { opacity: 0.5, duration: 0.04 })
            .to('.intro-glitch-flash', { opacity: 0, duration: 0.08 })
            .to(overlay, {
                scale: 1.08,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.in',
            }, '-=0.1');
    }, [phase, onComplete]);

    useEffect(() => {
        if (shouldSkip) {
            sessionStorage.setItem(SESSION_KEY, 'true');
            onComplete?.();
            return;
        }

        // Lock body scroll during intro
        document.body.style.overflow = 'hidden';

        const tl = gsap.timeline({
            onComplete: () => setPhase('cta'),
        });
        tlRef.current = tl;

        /* ──── PHASE 1: INIT TEXT (0s – 0.5s) ──── */
        tl.fromTo(
            '.intro-phase--init',
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: 'power2.out' }
        )
        .fromTo(
            '.intro-init-text',
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.35 },
            0.1
        );

        /* ──── HUD corners fade in ──── */
        tl.to('.intro-hud', { opacity: 1, duration: 0.5, stagger: 0.08 }, 0.2);

        /* ──── PHASE 2: LOGO (0.5s – 1.2s) ──── */
        tl.to('.intro-phase--init', { opacity: 0, duration: 0.2 }, 0.5)
          .fromTo(
              '.intro-phase--logo',
              { opacity: 0 },
              { opacity: 1, duration: 0.15 },
              0.55
          )
          .fromTo(
              '.intro-logo__monogram',
              { scale: 0.8, opacity: 0, filter: 'blur(8px)' },
              { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' },
              0.6
          )
          // tiny glitch flicker
          .to('.intro-logo__monogram', { opacity: 0.3, x: -3, duration: 0.04 }, 0.85)
          .to('.intro-logo__monogram', { opacity: 1, x: 2, duration: 0.04 }, 0.89)
          .to('.intro-logo__monogram', { opacity: 1, x: 0, duration: 0.04 }, 0.93);

        /* ──── PHASE 3: SYSTEM STATUS (1.2s – 2.0s) ──── */
        tl.to('.intro-phase--logo', { opacity: 0, duration: 0.15 }, 1.2)
          .fromTo(
              '.intro-phase--system',
              { opacity: 0 },
              { opacity: 1, duration: 0.15 },
              1.25
          );

        // System lines staggered
        tl.to('.intro-system__line', {
            opacity: 1,
            duration: 0.15,
            stagger: 0.12,
            ease: 'none',
        }, 1.3);

        // Loading bar
        tl.fromTo(
            '.intro-loader',
            { opacity: 0 },
            { opacity: 1, duration: 0.2 },
            1.6
        );

        // Progress bar fill with counter
        const fillProxy = { pct: 0 };
        tl.to(fillProxy, {
            pct: 100,
            duration: 0.8,
            ease: 'power1.inOut',
            onUpdate: () => {
                const pct = Math.round(fillProxy.pct);
                const fill = document.querySelector('.intro-loader__fill');
                const num = document.querySelector('.intro-loader__percent');
                if (fill) fill.style.width = pct + '%';
                if (num) num.textContent = pct + '%';
            },
        }, 1.7);

        /* ──── GLITCH TRANSITION (2.0s – 2.3s) ──── */
        tl.to('.intro-phase--system', { opacity: 0, duration: 0.1 }, 2.5)
          // RGB split / flash
          .to('.intro-glitch-flash', { opacity: 0.7, duration: 0.04 }, 2.5)
          .to('.intro-glitch-flash', { opacity: 0, duration: 0.05 }, 2.54)
          .to('.intro-glitch-flash', { opacity: 0.4, duration: 0.03 }, 2.59)
          .to('.intro-glitch-flash', { opacity: 0, duration: 0.06 }, 2.62)
          .to(overlayRef.current, {
              skewX: 2,
              duration: 0.05,
          }, 2.5)
          .to(overlayRef.current, {
              skewX: -1,
              duration: 0.05,
          }, 2.55)
          .to(overlayRef.current, {
              skewX: 0,
              duration: 0.08,
          }, 2.6);

        /* ──── PHASE 4: NAME REVEAL (2.3s – 3.0s) ──── */
        tl.fromTo(
            '.intro-phase--name',
            { opacity: 0 },
            { opacity: 1, duration: 0.15 },
            2.7
        )
        .fromTo(
            '.intro-name__hello',
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3 },
            2.75
        )
        .fromTo(
            '.intro-name__char',
            { opacity: 0, y: 30, filter: 'blur(6px)' },
            {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.35,
                stagger: 0.035,
                ease: 'power3.out',
            },
            2.9
        )
        // subtle glitch on name
        .to('.intro-name__main', { x: -4, opacity: 0.6, duration: 0.03 }, 3.3)
        .to('.intro-name__main', { x: 3, opacity: 0.9, duration: 0.03 }, 3.33)
        .to('.intro-name__main', { x: 0, opacity: 1, duration: 0.04 }, 3.36);

        /* ──── PHASE 5: PROFESSION (3.0s – 3.5s) ──── */
        tl.fromTo(
            '.intro-profession__title',
            { opacity: 0, y: 8, letterSpacing: '12px' },
            { opacity: 1, y: 0, letterSpacing: '8px', duration: 0.4, ease: 'power2.out' },
            3.5
        )
        .fromTo(
            '.intro-profession__sub',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 },
            3.7
        );

        /* ──── PHASE 6: CTA (3.8s) ──── */
        tl.to('.intro-phase--name', { opacity: 0, duration: 0.2 }, 4.1)
          .fromTo(
              '.intro-phase--cta',
              { opacity: 0 },
              { opacity: 1, duration: 0.2 },
              4.2
          )
          .fromTo(
              '.intro-cta__btn',
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
              4.3
          )
          .fromTo(
              '.intro-cta__skip',
              { opacity: 0 },
              { opacity: 1, duration: 0.3 },
              4.5
          );

        return () => {
            tl.kill();
            document.body.style.overflow = '';
            if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
        };
    }, [shouldSkip, onComplete]);

    /* Auto-enter after CTA phase */
    useEffect(() => {
        if (phase === 'cta') {
            autoTimerRef.current = setTimeout(() => {
                exitIntro();
            }, AUTO_ENTER_DELAY * 1000);
        }
        return () => {
            if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
        };
    }, [phase, exitIntro]);

    /* Restore body scroll when done */
    useEffect(() => {
        if (phase === 'done') {
            document.body.style.overflow = '';
        }
    }, [phase]);

    if (shouldSkip || phase === 'done') return null;

    const nameChars = 'SHAILENDRA'.split('');

    return (
        <div
            ref={overlayRef}
            className={`intro-overlay ${phase === 'exiting' ? 'intro--exiting' : ''}`}
            aria-hidden="true"
        >
            {/* Atmospheric layers */}
            <div className="intro-scanlines" />
            <div className="intro-noise" />
            <div className="intro-glitch-flash" />

            {/* HUD corners */}
            <div className="intro-hud intro-hud--tl">SYS.PORTFOLIO // V2.0</div>
            <div className="intro-hud intro-hud--tr">BUILD 2026</div>
            <div className="intro-hud intro-hud--bl">STATUS: ONLINE</div>
            <div className="intro-hud intro-hud--br">SHAILENDRA.DEV</div>

            {/* Phase 1: Init */}
            <div className="intro-phase intro-phase--init">
                <span className="intro-init-text">Initializing Portfolio...</span>
            </div>

            {/* Phase 2: Logo */}
            <div className="intro-phase intro-phase--logo">
                <div className="intro-logo">
                    <div className="intro-logo__monogram">SS</div>
                </div>
            </div>

            {/* Phase 3: System Status */}
            <div className="intro-phase intro-phase--system">
                <div className="intro-system">
                    <span className="intro-system__line">System Initializing</span>
                    <span className="intro-system__line">Portfolio Core</span>
                    <span className="intro-system__line">Build 2026</span>
                </div>
                <div className="intro-loader">
                    <span className="intro-loader__label">Loading Portfolio</span>
                    <div className="intro-loader__track">
                        <div className="intro-loader__fill" />
                    </div>
                    <span className="intro-loader__percent">0%</span>
                </div>
            </div>

            {/* Phase 4 + 5: Name + Profession */}
            <div className="intro-phase intro-phase--name">
                <div className="intro-name">
                    <span className="intro-name__hello">Hello, I'm</span>
                    <div className="intro-name__main">
                        {nameChars.map((ch, i) => (
                            <span key={i} className="intro-name__char">{ch}</span>
                        ))}
                    </div>
                </div>
                <div className="intro-profession" style={{ marginTop: '24px' }}>
                    <span className="intro-profession__title">Software Engineer</span>
                    <span className="intro-profession__sub">Developer • Builder • Creator</span>
                </div>
            </div>

            {/* Phase 6: CTA */}
            <div className="intro-phase intro-phase--cta">
                <div className="intro-cta">
                    <button
                        className="intro-cta__btn"
                        onClick={exitIntro}
                        autoFocus
                        type="button"
                        aria-label="Enter Portfolio"
                    >
                        <span className="intro-cta__indicator">▸</span>
                        Enter Portfolio
                    </button>
                    <span className="intro-cta__skip">Auto-entering shortly...</span>
                </div>
            </div>
        </div>
    );
}
