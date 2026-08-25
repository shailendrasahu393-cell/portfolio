import {
    FaWhatsapp,
    FaLinkedinIn,
    FaEnvelope,
    FaInstagram,
    FaGithub,
} from 'react-icons/fa';
import { socialLinks, contactEmail } from '../../data/socialLinks';
import ContactForm from './ContactForm';
import ScrollReveal from '../utils/ScrollReveal';
import './Contact.css';

const iconMap = {
    FaWhatsapp,
    FaLinkedinIn,
    FaEnvelope,
    FaInstagram,
    FaGithub,
};

export default function Contact() {
    return (
        <section id="contact" className="contact section section-alt" aria-label="Contact">
            <div className="container">
                <ScrollReveal delay={0.1}>
                    <div className="section-heading">
                        <span className="section-heading__label" style={{ fontFamily: 'var(--font-code)', letterSpacing: '2px' }}>[ CONTACT ]</span>
                        <h2 className="section-heading__title">Secure Connection.</h2>
                        <p className="section-heading__subtitle">
                            Initiate a transmission. Ensure all credentials are correct.
                        </p>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                    <ContactForm />
                </ScrollReveal>

                <div className="contact__socials" style={{ marginTop: '40px' }}>
                    {socialLinks.map((link, index) => {
                        const Icon = iconMap[link.icon];
                        return (
                            <ScrollReveal delay={0.3 + index * 0.1} key={index}>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact__social-btn"
                                    aria-label={link.name}
                                    style={{ '--hover-color': link.color }}
                                >
                                    {Icon && <Icon size={20} />}
                                </a>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
