import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Creative from './pages/Creative';
import VideoDetails from './pages/VideoDetails';
import PortfolioIntro from './components/Intro/PortfolioIntro';
import MatrixBg from './components/MatrixBg/MatrixBg';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ScrollToHash() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [hash]);
  return null;
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const location = useLocation();

  // Force dark theme as the exclusive portfolio theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  /* Only show intro on the home page */
  const isHome = location.pathname === '/';

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <>
      <MatrixBg />
      {isHome && !introComplete && (
        <PortfolioIntro onComplete={handleIntroComplete} />
      )}
      <div
        style={{
          opacity: !isHome || introComplete ? 1 : 0,
          transition: 'opacity 0.6s ease',
          visibility: !isHome || introComplete ? 'visible' : 'hidden',
        }}
      >
        <ScrollToTop />
        <ScrollToHash />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/creative" element={<Creative />} />
          <Route path="/creative/:id" element={<VideoDetails />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}
