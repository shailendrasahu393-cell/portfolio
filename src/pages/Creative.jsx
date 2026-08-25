import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import VideoCarousel from '../components/VideoCarousel/VideoCarousel';
import {
    creativeProjects,
    creativeCategories,
    watchMoreUrl,
} from '../data/creativeProjects';
import './Creative.css';

export default function Creative() {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredProjects = useMemo(() => {
        if (activeCategory === 'All') return creativeProjects;
        return creativeProjects.filter((p) => p.category === activeCategory);
    }, [activeCategory]);

    return (
        <main className="creative-page">
            <div className="container">
                {/* Back nav */}
                <Link to="/" className="creative-page__back">
                    <FiArrowLeft size={16} />
                    Back to Portfolio
                </Link>

                {/* Header */}
                <header className="creative-page__header">
                    <h1 className="creative-page__title">Creative Portfolio</h1>
                    <p className="creative-page__subtitle">
                        Video Editing • Videography • Visual Storytelling
                    </p>
                </header>

                {/* Category Filter */}
                <div className="creative-page__filters">
                    {creativeCategories.map((cat) => (
                        <button
                            key={cat}
                            className={`creative-page__filter ${activeCategory === cat ? 'creative-page__filter--active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* 3D Carousel */}
                {filteredProjects.length > 0 && (
                    <section className="creative-page__carousel-section">
                        <VideoCarousel projects={filteredProjects} />
                    </section>
                )}

                {/* Grid view */}
                <section className="creative-page__grid-section">
                    <h2 className="creative-page__section-title">All Projects</h2>
                    <div className="creative-page__grid">
                        {filteredProjects.map((project) => (
                            <Link
                                to={`/creative/${project.id}`}
                                className="creative-page__card"
                                key={project.id}
                            >
                                <div className="creative-page__card-video">
                                    <video
                                        src={`${project.src}#t=0.001`}
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        onMouseEnter={(e) => e.target.play()}
                                        onMouseLeave={(e) => {
                                            e.target.pause();
                                            e.target.currentTime = 0;
                                        }}
                                    />
                                </div>
                                <div className="creative-page__card-info">
                                    <span className="creative-page__card-cat">
                                        {project.category}
                                    </span>
                                    <h3>{project.title}</h3>
                                    <p>{project.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Watch More */}
                <div className="creative-page__watch-more">
                    <a
                        href={watchMoreUrl}
                        className="btn btn-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FiExternalLink size={16} />
                        Watch More on Google Drive
                    </a>
                </div>
            </div>
        </main>
    );
}
