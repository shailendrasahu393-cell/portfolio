import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { projects } from '../../data/projects';
import ScrollReveal from '../utils/ScrollReveal';
import './Projects.css';

function ProjectCard({ project, index = 0 }) {
    return (
        <ScrollReveal delay={0.2 + (index % 3) * 0.1}>
            <div className="project-card">
                <div className="project-card__header">
                    <h3 className="project-card__title">{project.title}</h3>
                </div>
                <p className="project-card__desc">{project.shortDescription}</p>
                {project.technologies && (
                    <div className="project-card__tech">
                        {project.technologies.map((tech) => (
                            <span key={tech} className="project-card__tech-tag">
                                {tech}
                            </span>
                        ))}
                    </div>
                )}
                {project.features && (
                    <ul className="project-card__features">
                        {project.features.map((f, i) => (
                            <li key={i}>{f}</li>
                        ))}
                    </ul>
                )}
                <div className="project-card__links">
                    {project.github ? (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-card__link"
                            aria-label={`View ${project.title} on GitHub`}
                        >
                            <FiGithub size={16} /> Code
                        </a>
                    ) : (
                        <span className="project-card__link project-card__link--disabled">
                            <FiGithub size={16} /> Code
                        </span>
                    )}
                    {project.liveDemo ? (
                        <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-card__link"
                            aria-label={`View ${project.title} live demo`}
                        >
                            <FiExternalLink size={16} /> Demo
                        </a>
                    ) : (
                        <span className="project-card__link project-card__link--disabled">
                            <FiExternalLink size={16} /> Demo
                        </span>
                    )}
                </div>
            </div>
        </ScrollReveal>
    );
}

function FeaturedProject({ project }) {
    return (
        <ScrollReveal delay={0.2}>
            <div className="featured-project">
                <div className="featured-project__visual">
                    <div className="featured-project__placeholder">
                        <span>Featured Project</span>
                    </div>
                </div>
                <div className="featured-project__info">
                    <span className="featured-project__label">Featured Project</span>
                    <h3 className="featured-project__title">{project.title}</h3>
                    <p className="featured-project__desc">{project.description}</p>
                    {project.problem && (
                        <div className="featured-project__detail">
                            <strong>Problem:</strong> {project.problem}
                        </div>
                    )}
                    {project.solution && (
                        <div className="featured-project__detail">
                            <strong>Solution:</strong> {project.solution}
                        </div>
                    )}
                    <div className="featured-project__tech">
                        {project.technologies.map((t) => (
                            <span key={t} className="project-card__tech-tag">
                                {t}
                            </span>
                        ))}
                    </div>
                    <div className="featured-project__actions">
                        {project.github ? (
                            <a href={project.github} className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
                                <FiGithub size={15} /> View Code
                            </a>
                        ) : (
                            <span className="btn btn-primary btn-sm" style={{ opacity: 0.5, cursor: 'default' }}>
                                <FiGithub size={15} /> View Code
                            </span>
                        )}
                        {project.liveDemo ? (
                            <a href={project.liveDemo} className="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer">
                                <FiExternalLink size={15} /> Live Demo
                            </a>
                        ) : (
                            <span className="btn btn-secondary btn-sm" style={{ opacity: 0.5, cursor: 'default' }}>
                                <FiExternalLink size={15} /> Live Demo
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </ScrollReveal>
    );
}

export default function Projects() {
    const featured = projects.find((p) => p.featured);
    const others = projects.filter((p) => !p.featured);

    return (
        <section id="projects" className="projects-section section" aria-label="Projects">
            <div className="container">
                <ScrollReveal delay={0.1}>
                    <div className="section-heading">
                        <span className="section-heading__label">Projects</span>
                        <h2 className="section-heading__title">What I've Built</h2>
                        <p className="section-heading__subtitle">
                            Software projects showcasing problem-solving and engineering
                        </p>
                    </div>
                </ScrollReveal>

                {featured && <FeaturedProject project={featured} />}

                <div className="projects-grid">
                    {others.map((project, idx) => (
                        <ProjectCard key={project.id} project={project} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}
