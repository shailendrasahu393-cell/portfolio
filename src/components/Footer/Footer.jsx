import { Link } from 'react-router-dom';
import {
    FaWhatsapp,
    FaLinkedinIn,
    FaEnvelope,
    FaInstagram,
    FaGithub,
} from 'react-icons/fa';
import { socialLinks } from '../../data/socialLinks';
import './Footer.css';

const iconMap = {
    FaWhatsapp,
    FaLinkedinIn,
    FaEnvelope,
    FaInstagram,
    FaGithub,
};

const footerNav = [
    { label: 'Home', to: '/' },
    { label: 'Projects', to: '/#projects' },
    { label: 'Creative', to: '/creative' },
    { label: 'Contact', to: '/#contact' },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer" role="contentinfo">
            <div className="container">
                <div className="footer__content">
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            Shailendra<span className="footer__logo-dot">.</span>
                        </Link>
                        <p className="footer__role">Software Engineer</p>
                    </div>

                    <nav className="footer__nav" aria-label="Footer navigation">
                        {footerNav.map((item) => (
                            <Link key={item.label} to={item.to} className="footer__nav-link">
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="footer__socials">
                        {socialLinks.map((link) => {
                            const Icon = iconMap[link.icon];
                            return (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    className="footer__social-link"
                                    target={link.url.startsWith('mailto') ? undefined : '_blank'}
                                    rel={
                                        link.url.startsWith('mailto')
                                            ? undefined
                                            : 'noopener noreferrer'
                                    }
                                    aria-label={link.label}
                                >
                                    {Icon && <Icon size={16} />}
                                </a>
                            );
                        })}
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>© {year} Shailendra Sahu. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
