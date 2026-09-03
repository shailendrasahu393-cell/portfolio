import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiDownload } from 'react-icons/fi';
import './Navbar.css';

const navItems = [
    { label: 'Home', path: '/', hash: '' },
    { label: 'About', path: '/', hash: '#about' },
    { label: 'Skills', path: '/', hash: '#skills' },
    { label: 'Projects', path: '/', hash: '#projects' },
    { label: 'Creative', path: '/creative', hash: '' },
    { label: 'Experience', path: '/', hash: '#experience' },
    { label: 'Certificates', path: '/', hash: '#certificates' },
    { label: 'Contact', path: '/', hash: '#contact' },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const menuRef = useRef(null);
    const lastScrollY = useRef(0);
    const location = useLocation();
    const navigate = useNavigate();

    // Scroll detection and Smart Navbar Hide
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Check if passed the threshold to turn solid
            setIsScrolled(currentScrollY > 20);

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY.current && currentScrollY > 100 && !isMenuOpen) {
                // Scrolling down
                setIsHidden(true);
            } else if (currentScrollY < lastScrollY.current) {
                // Scrolling up
                setIsHidden(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMenuOpen]);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMenuOpen]);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const handleNavClick = (e, item) => {
        setIsMenuOpen(false);
        if (item.hash) {
            e.preventDefault();
            if (location.pathname === item.path) {
                const el = document.querySelector(item.hash);
                if (el) {
                    const top = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                    window.history.pushState(null, '', item.path + item.hash);
                }
            } else {
                navigate(item.path + item.hash);
            }
        } else if (item.label === 'Home' && location.pathname === '/') {
            // Already on home, just scroll to top
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''} ${isHidden ? 'navbar--hidden' : ''}`} style={{ zIndex: 9999 }}>
            <div className="navbar__container">
                <Link to="/" className="navbar__logo" aria-label="Home" onClick={(e) => {
                    if (location.pathname === '/') {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }}>
                    <span className="navbar__logo-text">Shailendra</span>
                    <span className="navbar__logo-dot">.</span>
                </Link>

                <nav className="navbar__nav" ref={menuRef}>
                    <ul className={`navbar__links ${isMenuOpen ? 'navbar__links--open' : ''}`}>
                        {navItems.map((item) => (
                            <li key={item.label}>
                                {item.hash ? (
                                    <a
                                        href={item.path + item.hash}
                                        className={`navbar__link ${location.pathname === item.path && location.hash === item.hash ? 'navbar__link--active' : ''}`}
                                        onClick={(e) => handleNavClick(e, item)}
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `navbar__link ${isActive && item.path !== '/' || (item.label === 'Home' && location.pathname === '/') ? 'navbar__link--active' : ''}`
                                        }
                                        onClick={(e) => handleNavClick(e, item)}
                                        end={item.path === '/'}
                                    >
                                        {item.label}
                                    </NavLink>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="navbar__actions">
                        <a
                            href="/assets/resume.pdf"
                            className="navbar__resume-btn"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Download Resume"
                            download="Shailendra_Resume.pdf"
                        >
                            <FiDownload size={14} />
                            <span>Resume</span>
                        </a>

                        <button
                            className="navbar__menu-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            aria-label="Toggle navigation menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}
