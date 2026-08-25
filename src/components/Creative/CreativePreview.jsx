import { Link } from 'react-router-dom';
import { FiArrowRight, FiFilm, FiCamera, FiShare2 } from 'react-icons/fi';
import { creativeProjects } from '../../data/creativeProjects';
import ScrollReveal from '../utils/ScrollReveal';
import './CreativePreview.css';

export default function CreativePreview() {
    const featured = creativeProjects.filter((p) => p.featured).slice(0, 3);
    const fallback = featured.length ? featured : creativeProjects.slice(0, 3);

    return (
        <section className="creative-preview section" aria-label="Creative Work">
            <div className="container">
                <ScrollReveal delay={0.1}>
                    <div className="section-heading">
                        <span className="section-heading__label">Creative</span>
                        <h2 className="section-heading__title">Creative Work</h2>
                        <p className="section-heading__subtitle">
                            Video Editing • Videography • Social Media
                        </p>
                    </div>
                </ScrollReveal>

                <div className="creative-preview__categories">
                    <ScrollReveal delay={0.2}>
                        <div className="creative-preview__cat">
                            <FiFilm size={28} />
                            <h4>Video Editing</h4>
                            <p>Professional edits with dynamic transitions and cinematic pacing</p>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal delay={0.3}>
                        <div className="creative-preview__cat">
                            <FiCamera size={28} />
                            <h4>Videography</h4>
                            <p>Capturing footage with compelling composition and storytelling</p>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal delay={0.4}>
                        <div className="creative-preview__cat">
                            <FiShare2 size={28} />
                            <h4>Social Media</h4>
                            <p>Content creation and digital media management</p>
                        </div>
                    </ScrollReveal>
                </div>

                <div className="creative-preview__grid">
                    {fallback.map((project, idx) => (
                        <ScrollReveal key={project.id} delay={0.2 + (idx % 3) * 0.1}>
                            <Link
                                to={`/creative/${project.id}`}
                                className="creative-preview__card"
                            >
                                <div className="creative-preview__video-wrap">
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
                                <div className="creative-preview__card-info">
                                    <span className="creative-preview__card-cat">
                                        {project.category}
                                    </span>
                                    <h4>{project.title}</h4>
                                </div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>

                <div className="creative-preview__cta">
                    <Link to="/creative" className="btn btn-primary">
                        View Full Creative Portfolio
                        <FiArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
