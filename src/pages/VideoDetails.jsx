import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { creativeProjects } from '../data/creativeProjects';
import './VideoDetails.css';

export default function VideoDetails() {
    const { id } = useParams();
    const project = creativeProjects.find((p) => p.id === id);

    if (!project) {
        return (
            <main className="video-details">
                <div className="container">
                    <Link to="/creative" className="video-details__back">
                        <FiArrowLeft size={16} />
                        Back to Creative
                    </Link>
                    <div className="video-details__not-found">
                        <h2>Project not found</h2>
                        <p>The creative project you're looking for doesn't exist.</p>
                    </div>
                </div>
            </main>
        );
    }

    const related = creativeProjects
        .filter((p) => p.id !== project.id && p.category === project.category)
        .slice(0, 3);

    return (
        <main className="video-details">
            <div className="container">
                <Link to="/creative" className="video-details__back">
                    <FiArrowLeft size={16} />
                    Back to Creative
                </Link>

                <div className="video-details__content">
                    {/* Video Player */}
                    <div className="video-details__player">
                        <video
                            src={`${project.src}#t=0.001`}
                            controls
                            playsInline
                            preload="metadata"
                            className="video-details__video"
                        />
                    </div>

                    {/* Info */}
                    <div className="video-details__info">
                        <span className="video-details__category">{project.category}</span>
                        <h1 className="video-details__title">{project.title}</h1>
                        <p className="video-details__desc">{project.description}</p>

                        <div className="video-details__meta">
                            {project.role && (
                                <div className="video-details__meta-item">
                                    <strong>Role</strong>
                                    <span>{project.role}</span>
                                </div>
                            )}
                            {project.context && (
                                <div className="video-details__meta-item">
                                    <strong>Context</strong>
                                    <span>{project.context}</span>
                                </div>
                            )}
                            {project.tools && project.tools.length > 0 && (
                                <div className="video-details__meta-item">
                                    <strong>Tools</strong>
                                    <div className="video-details__tools">
                                        {project.tools.map((t) => (
                                            <span key={t} className="video-details__tool-tag">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related */}
                {related.length > 0 && (
                    <section className="video-details__related">
                        <h2>Related Work</h2>
                        <div className="video-details__related-grid">
                            {related.map((r) => (
                                <Link
                                    to={`/creative/${r.id}`}
                                    className="video-details__related-card"
                                    key={r.id}
                                >
                                    <div className="video-details__related-video">
                                        <video
                                            src={`${r.src}#t=0.001`}
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
                                    <div className="video-details__related-info">
                                        <span>{r.category}</span>
                                        <h4>{r.title}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
