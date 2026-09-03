import { FiArrowDown, FiSend, FiDownload, FiGithub } from 'react-icons/fi';
import { profile } from '../../data/profile';
import ProfileCard from './ProfileCard';
import DigitalSurfaceBg from './DigitalSurfaceBg';
import ScrollReveal from '../utils/ScrollReveal';
import './Hero.css';

export default function Hero() {
    const scrollToProjects = () => {
        const el = document.querySelector('#projects');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToContact = () => {
        const el = document.querySelector('#contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="hero" aria-label="Introduction">
            <DigitalSurfaceBg />
            {/* Faded background silhouette */}
            <div
                className="hero__bg-silhouette"
                style={{ backgroundImage: `url(/assets/hero-silhouette.jpg)` }}
                aria-hidden="true"
            />
            <div className="hero__container container">
                <div className="hero__content">
                    <div className="hero__text">
                        <ScrollReveal delay={0.1}>
                            <div className="hero__tech-label">[ SYSTEM / ONLINE ]</div>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <span className="hero__greeting">{profile.introGreeting}</span>
                        </ScrollReveal>
                        <ScrollReveal delay={0.3}>
                            <h1 className="hero__title">
                                <span className="hero__title-accent">{profile.headline[0]}</span>
                                <span className="hero__title-main">{profile.headline[1]}</span>
                            </h1>
                        </ScrollReveal>
                        <ScrollReveal delay={0.4}>
                            <p className="hero__subtitle">{profile.secondaryTitle}</p>
                        </ScrollReveal>
                        <ScrollReveal delay={0.5}>
                            <p className="hero__tagline">{profile.tagline}</p>
                        </ScrollReveal>
                        <ScrollReveal delay={0.6}>
                            <p className="hero__description">{profile.aspirations}</p>
                        </ScrollReveal>

                        <ScrollReveal delay={0.7}>
                            <div className="hero__actions">
                                <button className="btn btn-primary" onClick={scrollToProjects}>
                                    <FiArrowDown size={16} />
                                    View My Work
                                </button>
                                <a
                                    href="/assets/resume.pdf"
                                    className="btn btn-secondary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download="Shailendra_Resume.pdf"
                                >
                                    <FiDownload size={16} />
                                    Download Resume
                                </a>
                                <a
                                    href="https://github.com/shailendrasahu393-cell/portfolio"
                                    className="btn btn-secondary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FiGithub size={16} />
                                    Source Code
                                </a>
                                <button className="btn btn-ghost" onClick={scrollToContact}>
                                    <FiSend size={16} />
                                    Let's Connect
                                </button>
                            </div>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal delay={0.5} className="hero__image">
                        <ProfileCard
                            name="Shailendra Sahu"
                            title="Software Engineer"
                            handle="shailendra"
                            status="Online"
                            contactText="Contact Me"
                            avatarUrl={profile.profileImage}
                            showUserInfo={true}
                            enableTilt={true}
                            enableMobileTilt={false}
                            onContactClick={scrollToContact}
                            behindGlowColor="rgba(249, 115, 22, 0.5)"
                            behindGlowEnabled
                            innerGradient="linear-gradient(145deg, rgba(20,10,3,0.7) 0%, rgba(249,115,22,0.15) 100%)"
                        />
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
