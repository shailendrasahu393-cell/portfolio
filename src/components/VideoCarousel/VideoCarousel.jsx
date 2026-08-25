import { useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiPause } from 'react-icons/fi';
import { useVideoCarousel } from '../../hooks/useVideoCarousel';
import './VideoCarousel.css';

function VideoCard({ project, position, isActive, onClick }) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!videoRef.current) return;
        if (!isActive) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isActive]);

    const handleClick = () => {
        if (isActive && videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        } else {
            onClick();
        }
    };

    return (
        <div
            className={`vc-card vc-card--${position}`}
            onClick={handleClick}
            role="button"
            tabIndex={isActive ? 0 : -1}
            aria-label={`${project.title} — ${isActive ? 'active' : 'click to view'}`}
        >
            <div className="vc-card__video-wrap">
                <video
                    ref={videoRef}
                    src={`${project.src}#t=0.001`}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                />
                {isActive && (
                    <div className="vc-card__play-indicator">
                        <FiPlay size={20} />
                    </div>
                )}
            </div>
            <div className="vc-card__info">
                <span className="vc-card__category">{project.category}</span>
                <h4 className="vc-card__title">{project.title}</h4>
                {isActive && (
                    <Link
                        to={`/creative/${project.id}`}
                        className="vc-card__detail-link"
                        onClick={(e) => e.stopPropagation()}
                    >
                        View Details →
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function VideoCarousel({ projects }) {
    const {
        activeIndex,
        goTo,
        goNext,
        goPrev,
        onTouchStart,
        onTouchEnd,
        getPosition,
    } = useVideoCarousel(projects.length);

    return (
        <div
            className="video-carousel"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            role="region"
            aria-label="Video carousel"
        >
            <div className="video-carousel__track">
                {projects.map((project, index) => (
                    <VideoCard
                        key={project.id}
                        project={project}
                        position={getPosition(index)}
                        isActive={index === activeIndex}
                        onClick={() => goTo(index)}
                    />
                ))}
            </div>

            <div className="video-carousel__controls">
                <button
                    className="video-carousel__btn"
                    onClick={goPrev}
                    aria-label="Previous video"
                >
                    ‹
                </button>
                <div className="video-carousel__dots">
                    {projects.map((_, i) => (
                        <button
                            key={i}
                            className={`video-carousel__dot ${i === activeIndex ? 'video-carousel__dot--active' : ''}`}
                            onClick={() => goTo(i)}
                            aria-label={`Go to video ${i + 1}`}
                        />
                    ))}
                </div>
                <button
                    className="video-carousel__btn"
                    onClick={goNext}
                    aria-label="Next video"
                >
                    ›
                </button>
            </div>
        </div>
    );
}
