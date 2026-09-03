import { useState, useEffect, useRef, useCallback } from 'react';
import certificates from '../../data/certificates';
import ScrollReveal from '../utils/ScrollReveal';
import './Certificates.css';

/* ─── Constants ─────────────────────────────────────────── */
const ZOOM_STEP = 0.3;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ─── Cert Card ──────────────────────────────────────────── */
function CertCard({ cert, onClick }) {
    const [imgError, setImgError] = useState(false);

    return (
        <article
            className="cert-card"
            onClick={() => onClick(cert)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(cert)}
            tabIndex={0}
            role="button"
            aria-label={`View certificate: ${cert.title} by ${cert.issuer}`}
        >
            <span className="cert-card__badge">View</span>
            <div className="cert-card__img-wrap">
                {imgError ? (
                    <div className="cert-card__img-placeholder" aria-hidden="true">
                        🏆
                    </div>
                ) : (
                    <img
                        src={cert.image}
                        alt={`${cert.title} — ${cert.issuer}`}
                        className="cert-card__img"
                        loading="lazy"
                        onError={() => setImgError(true)}
                        draggable={false}
                    />
                )}
            </div>
            <div className="cert-card__info">
                <h3 className="cert-card__title">{cert.title}</h3>
                <div className="cert-card__meta">
                    <span className="cert-card__issuer">{cert.issuer}</span>
                    <span className="cert-card__date">{cert.date}</span>
                </div>
            </div>
        </article>
    );
}

/* ─── Cert Modal ─────────────────────────────────────────── */
function CertModal({ cert, onClose }) {
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [imgError, setImgError] = useState(false);

    const panStart = useRef(null);
    const offsetRef = useRef(offset);
    const pinchRef = useRef(null);
    const closeBtnRef = useRef(null);

    // Keep ref in sync for pan handlers
    useEffect(() => { offsetRef.current = offset; }, [offset]);

    // Focus close button and lock body scroll on open
    useEffect(() => {
        closeBtnRef.current?.focus();
        document.body.classList.add('cert-modal-open');
        return () => document.body.classList.remove('cert-modal-open');
    }, []);

    // ESC key to close
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    /* ── Zoom helpers ── */
    const doZoom = useCallback((delta) => {
        setZoom((z) => clamp(z + delta, ZOOM_MIN, ZOOM_MAX));
        if (delta === 0) setOffset({ x: 0, y: 0 }); // reset
    }, []);

    /* ── Mouse wheel zoom ── */
    const onWheel = useCallback((e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        setZoom((z) => clamp(z + delta, ZOOM_MIN, ZOOM_MAX));
    }, []);

    /* ── Mouse pan ── */
    const onMouseDown = useCallback((e) => {
        if (zoom <= 1) return;
        e.preventDefault();
        setIsPanning(true);
        panStart.current = { x: e.clientX - offsetRef.current.x, y: e.clientY - offsetRef.current.y };
    }, [zoom]);

    const onMouseMove = useCallback((e) => {
        if (!isPanning || !panStart.current) return;
        setOffset({
            x: e.clientX - panStart.current.x,
            y: e.clientY - panStart.current.y,
        });
    }, [isPanning]);

    const onMouseUp = useCallback(() => {
        setIsPanning(false);
        panStart.current = null;
    }, []);

    /* ── Touch pinch-to-zoom ── */
    const onTouchStart = useCallback((e) => {
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            pinchRef.current = Math.hypot(dx, dy);
        }
    }, []);

    const onTouchMove = useCallback((e) => {
        if (e.touches.length === 2 && pinchRef.current !== null) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.hypot(dx, dy);
            const ratio = dist / pinchRef.current;
            pinchRef.current = dist;
            setZoom((z) => clamp(z * ratio, ZOOM_MIN, ZOOM_MAX));
        }
    }, []);

    const onTouchEnd = useCallback(() => { pinchRef.current = null; }, []);

    /* ── Download (links need href, not JS fetch, for best compat) ── */
    const downloadHref = cert.file;
    const downloadName = cert.file.split('/').pop();

    const imgStyle = {
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
        cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
        transition: isPanning ? 'none' : 'transform 0.15s ease',
    };

    return (
        <div
            className="cert-modal-overlay"
            onClick={onClose}
            role="presentation"
            aria-hidden="false"
        >
            <div
                className="cert-modal"
                role="dialog"
                aria-modal="true"
                aria-label={`Certificate preview: ${cert.title}`}
                onClick={(e) => e.stopPropagation()}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
            >
                {/* ── Header ── */}
                <div className="cert-modal__header">
                    <div className="cert-modal__title-group">
                        <span className="cert-modal__title">{cert.title}</span>
                        <span className="cert-modal__subtitle">
                            {cert.issuer} &middot; {cert.date}
                        </span>
                    </div>
                    <button
                        ref={closeBtnRef}
                        className="cert-modal__close"
                        onClick={onClose}
                        aria-label="Close certificate preview"
                        title="Close (Esc)"
                    >
                        ✕
                    </button>
                </div>

                {/* ── Image viewport ── */}
                <div
                    className="cert-modal__viewport"
                    onWheel={onWheel}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    style={{ minHeight: '300px' }}
                >
                    <div
                        className="cert-modal__img-container"
                        onMouseDown={onMouseDown}
                    >
                        {imgError ? (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 12,
                                    color: 'var(--text-tertiary)',
                                    padding: 32,
                                }}
                            >
                                <span style={{ fontSize: '4rem' }}>🏆</span>
                                <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)' }}>
                                    Image preview not available.<br />
                                    You can still download the file below.
                                </p>
                            </div>
                        ) : (
                            <img
                                src={cert.image}
                                alt={`${cert.title} — ${cert.issuer} certificate`}
                                className="cert-modal__img"
                                style={imgStyle}
                                onError={() => setImgError(true)}
                                draggable={false}
                            />
                        )}
                    </div>
                </div>

                {/* ── Footer / Controls ── */}
                <div className="cert-modal__footer">
                    {/* Zoom controls */}
                    <div className="cert-modal__zoom-controls" role="group" aria-label="Zoom controls">
                        <button
                            className="cert-modal__zoom-btn"
                            onClick={() => doZoom(ZOOM_STEP)}
                            aria-label="Zoom in"
                            title="Zoom In"
                            disabled={zoom >= ZOOM_MAX}
                        >
                            +
                        </button>
                        <span className="cert-modal__zoom-level" aria-live="polite" aria-atomic="true">
                            {Math.round(zoom * 100)}%
                        </span>
                        <button
                            className="cert-modal__zoom-btn"
                            onClick={() => doZoom(-ZOOM_STEP)}
                            aria-label="Zoom out"
                            title="Zoom Out"
                            disabled={zoom <= ZOOM_MIN}
                        >
                            −
                        </button>
                        <button
                            className="cert-modal__zoom-btn"
                            onClick={() => { doZoom(0); setOffset({ x: 0, y: 0 }); }}
                            aria-label="Reset zoom"
                            title="Reset Zoom"
                            style={{ fontSize: '11px', width: 'auto', padding: '0 10px', letterSpacing: '0.5px' }}
                        >
                            Reset
                        </button>
                    </div>

                    {/* Download */}
                    <a
                        href={downloadHref}
                        download={downloadName}
                        className="cert-modal__download-btn"
                        aria-label={`Download ${cert.title} certificate`}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download Certificate
                    </a>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Section ───────────────────────────────────────── */
export default function Certificates() {
    const [selectedCert, setSelectedCert] = useState(null);

    const openModal = useCallback((cert) => setSelectedCert(cert), []);
    const closeModal = useCallback(() => setSelectedCert(null), []);

    // Duplicate items for seamless infinite loop
    const trackItems = [...certificates, ...certificates];

    if (certificates.length === 0) return null;

    return (
        <section
            id="certificates"
            className="certificates-section section"
            aria-label="Certificates and achievements"
        >
            <div className="container">
                <ScrollReveal delay={0.1}>
                    <div className="section-heading">
                        <span className="section-heading__label">Achievements</span>
                        <h2 className="section-heading__title">🏆 Certificates</h2>
                        <p className="section-heading__subtitle">
                            A collection of certifications and achievements from my learning journey.
                        </p>
                    </div>
                </ScrollReveal>
            </div>

            {/* Slider — outside container so it spans full width */}
            <ScrollReveal delay={0.2}>
                <div className="cert-slider" aria-label="Certificate slider">
                    <div className="cert-slider__track">
                        {trackItems.map((cert, idx) => (
                            <CertCard
                                key={`${cert.id}-${idx}`}
                                cert={cert}
                                onClick={openModal}
                            />
                        ))}
                    </div>
                </div>
            </ScrollReveal>

            {/* Modal */}
            {selectedCert && (
                <CertModal cert={selectedCert} onClose={closeModal} />
            )}
        </section>
    );
}
