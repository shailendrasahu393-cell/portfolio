import { useState, useCallback, useRef, useEffect } from 'react';

export function useVideoCarousel(totalItems) {
    const [activeIndex, setActiveIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const goTo = useCallback(
        (index) => {
            if (index < 0) index = totalItems - 1;
            if (index >= totalItems) index = 0;
            setActiveIndex(index);
        },
        [totalItems]
    );

    const goNext = useCallback(() => {
        goTo(activeIndex + 1);
    }, [activeIndex, goTo]);

    const goPrev = useCallback(() => {
        goTo(activeIndex - 1);
    }, [activeIndex, goTo]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goNext, goPrev]);

    // Touch handlers
    const onTouchStart = useCallback((e) => {
        touchStartX.current = e.changedTouches[0].clientX;
    }, []);

    const onTouchEnd = useCallback(
        (e) => {
            touchEndX.current = e.changedTouches[0].clientX;
            const diff = touchStartX.current - touchEndX.current;
            if (Math.abs(diff) > 50) {
                if (diff > 0) goNext();
                else goPrev();
            }
        },
        [goNext, goPrev]
    );

    const getPosition = useCallback(
        (index) => {
            const diff = index - activeIndex;
            if (diff === 0) return 'center';
            if (diff === 1 || diff === -(totalItems - 1)) return 'right';
            if (diff === -1 || diff === totalItems - 1) return 'left';
            if (diff === 2 || diff === -(totalItems - 2)) return 'far-right';
            if (diff === -2 || diff === totalItems - 2) return 'far-left';
            return 'hidden';
        },
        [activeIndex, totalItems]
    );

    return {
        activeIndex,
        goTo,
        goNext,
        goPrev,
        onTouchStart,
        onTouchEnd,
        getPosition,
    };
}
