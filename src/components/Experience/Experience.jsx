import { journeyItems } from '../../data/experience';
import ScrollReveal from '../utils/ScrollReveal';
import './Experience.css';

export default function Experience() {
    return (
        <section id="experience" className="experience-section section section-alt" aria-label="Experience">
            <div className="container">
                <ScrollReveal delay={0.1}>
                    <div className="section-heading">
                        <span className="section-heading__label">Journey</span>
                        <h2 className="section-heading__title">Development Journey</h2>
                        <p className="section-heading__subtitle">
                            My path in software development and creative technology
                        </p>
                    </div>
                </ScrollReveal>

                <div className="timeline">
                    {journeyItems.map((item, index) => (
                        <div
                            className={`timeline__item ${index % 2 === 0 ? 'timeline__item--left' : 'timeline__item--right'}`}
                            key={item.id}
                        >
                            <div className="timeline__dot"></div>
                            <ScrollReveal delay={0.2} className="timeline__card-wrapper">
                                <div className="timeline__card">
                                    {item.subtitle && (
                                        <span className="timeline__label">{item.subtitle}</span>
                                    )}
                                    <h3 className="timeline__title">{item.title}</h3>
                                    {item.company && (
                                        <p className="timeline__company">
                                            {item.company} {item.duration && `• ${item.duration}`}
                                        </p>
                                    )}
                                    <p className="timeline__desc">{item.description}</p>
                                    {item.technologies && (
                                        <div className="timeline__tech">
                                            {item.technologies.map((t) => (
                                                <span key={t} className="timeline__tech-tag">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </ScrollReveal>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
