import { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal wrapper component
 * Uses IntersectionObserver to trigger a fade-up/slide-up animation 
 * when the element scrolls into view.
 */
export default function ScrollReveal({
    children,
    delay = 0,
    className = "",
    distance = "40px",
    duration = "0.8s"
}) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const currentRef = domRef.current;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (currentRef) observer.unobserve(currentRef);
                }
            });
        }, {
            // Trigger slightly earlier before completely visible
            rootMargin: "0px 0px -50px 0px",
            threshold: 0.1
        });

        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    return (
        <div
            ref={domRef}
            className={`sr-container ${isVisible ? 'sr-visible' : ''} ${className}`}
            style={{
                '--sr-delay': `${delay}s`,
                '--sr-distance': distance,
                '--sr-duration': duration
            }}
        >
            {children}
        </div>
    );
}
