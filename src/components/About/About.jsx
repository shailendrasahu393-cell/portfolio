import {
    FiCode,
    FiLayers,
    FiCloud,
    FiFilm,
    FiCamera,
    FiShare2,
} from 'react-icons/fi';
import { profile } from '../../data/profile';
import ScrollReveal from '../utils/ScrollReveal';
import './About.css';

const iconMap = {
    code: FiCode,
    layers: FiLayers,
    cloud: FiCloud,
    film: FiFilm,
    camera: FiCamera,
    share: FiShare2,
};

export default function About() {
    return (
        <section id="about" className="about section" aria-label="About">
            <div className="container">
                <ScrollReveal delay={0.1}>
                    <div className="section-heading">
                        <span className="section-heading__label">About</span>
                        <h2 className="section-heading__title">Who I Am</h2>
                        <p className="section-heading__subtitle">
                            Software Developer with a creative edge
                        </p>
                    </div>
                </ScrollReveal>

                <div className="about__content">
                    <div className="about__text">
                        {profile.about.paragraphs.map((p, i) => (
                            <ScrollReveal key={i} delay={0.2 + i * 0.1}>
                                <p className="about__paragraph">
                                    {p}
                                </p>
                            </ScrollReveal>
                        ))}
                    </div>

                    <div className="about__highlights">
                        {profile.about.highlights.map((item, i) => {
                            const Icon = iconMap[item.icon] || FiCode;
                            return (
                                <ScrollReveal key={i} delay={0.3 + i * 0.15}>
                                    <div className="about__highlight-card">
                                        <div className="about__highlight-icon">
                                            <Icon size={22} />
                                        </div>
                                        <div>
                                            <h4 className="about__highlight-label">{item.label}</h4>
                                            <p className="about__highlight-desc">{item.description}</p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
