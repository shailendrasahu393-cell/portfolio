import {
    SiC,
    SiCplusplus,
    SiPython,
    SiJavascript,
    SiHtml5,
    SiCss,
    SiReact,
    SiGit,
    SiGithub,
    SiNetlify,
    SiRender,
    SiFirebase,
} from 'react-icons/si';
import { FiFilm, FiCamera, FiShare2, FiCpu, FiZap } from 'react-icons/fi';
import { skillCategories } from '../../data/skills';
import ScrollReveal from '../utils/ScrollReveal';
import './Skills.css';

function CapCutIcon({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z" />
        </svg>
    );
}

const techIconMap = {
    SiC: SiC,
    SiCplusplus: SiCplusplus,
    SiPython: SiPython,
    SiJavascript: SiJavascript,
    SiHtml5: SiHtml5,
    SiCss3: SiCss,
    SiReact: SiReact,
    SiGit: SiGit,
    SiGithub: SiGithub,
    SiNetlify: SiNetlify,
    SiRender: SiRender,
    SiFirebase: SiFirebase,
    film: FiFilm,
    capcut: CapCutIcon,
    camera: FiCamera,
    share: FiShare2,
    logic: FiCpu,
    brain: FiZap,
};

function SkillBadge({ name, icon }) {
    const Icon = techIconMap[icon];
    return (
        <span className="skill-badge">
            {Icon && <Icon className="skill-badge__icon" size={16} />}
            {name}
        </span>
    );
}

export default function Skills() {
    return (
        <section id="skills" className="skills-section section section-alt" aria-label="Skills">
            <div className="container">
                <ScrollReveal delay={0.1}>
                    <div className="section-heading">
                        <span className="section-heading__label">Skills</span>
                        <h2 className="section-heading__title">Technical Toolkit</h2>
                        <p className="section-heading__subtitle">
                            Technologies and tools I work with
                        </p>
                    </div>
                </ScrollReveal>

                <div className="skills-grid">
                    {skillCategories.map((cat, i) => (
                        <ScrollReveal key={cat.id} delay={0.2 + i * 0.1}>
                            <div className="skills-category">
                                <h3 className="skills-category__title">{cat.title}</h3>
                                <div className="skills-category__badges">
                                    {cat.skills.map((skill) => (
                                        <SkillBadge
                                            key={skill.name}
                                            name={skill.name}
                                            icon={skill.icon}
                                        />
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
