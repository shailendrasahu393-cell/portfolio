export const projects = [
    {
        id: 'developer-portfolio',
        title: 'Developer Portfolio',
        shortDescription: 'Responsive portfolio with smooth animations.',
        description:
            'A professional developer portfolio website featuring responsive design, smooth scroll-based animations, dark/light theme switching, and a custom video showcase system.',
        problem: 'Needed a professional online presence that showcases both software development and creative work.',
        solution:
            'Built a responsive single-page application with a custom video slider, theme system, and mobile-optimized navigation.',
        technologies: ['HTML', 'CSS', 'JavaScript'],
        features: [
            'Responsive design across all devices',
            'Dark/Light theme with persistence',
            'Custom video slider with hover-play logic',
            'Mobile hamburger navigation',
        ],
        github: null,
        liveDemo: null,
        image: null,
        featured: true,
    },
    {
        id: 'video-slider-system',
        title: 'Video Slider System',
        shortDescription: 'Custom hover-play slider with single-video logic.',
        description:
            'A custom-built horizontal video carousel system with hover-to-play functionality and single-video logic that ensures only one video plays at a time.',
        problem: 'Standard video galleries play all videos simultaneously and lack interactive browsing.',
        solution:
            'Engineered a scroll-snap carousel with mouseenter/click-based playback, automatic pause of other videos, and visual active-state feedback.',
        technologies: ['JavaScript', 'CSS', 'HTML'],
        features: [
            'Hover-to-play interaction',
            'Single-video playback logic',
            'Scroll-snap navigation',
            'Active card visual feedback',
        ],
        github: null,
        liveDemo: null,
        image: null,
        featured: false,
    },
    {
        id: 'ui-animation-engine',
        title: 'UI Animation Engine',
        shortDescription: 'Scroll-based reveal and performance-optimized UI.',
        description:
            'A performance-optimized UI animation system featuring scroll-triggered reveals, smooth transitions, and carefully tuned timing for professional visual feedback.',
        problem: 'Static websites lack engagement; animations often hurt performance.',
        solution:
            'Created a lightweight animation engine using CSS transitions and JavaScript observers to trigger reveal effects on scroll without compromising performance.',
        technologies: ['JavaScript', 'CSS'],
        features: [
            'Scroll-based reveal animations',
            'Performance-optimized transitions',
            'Configurable animation timing',
            'Intersection Observer based',
        ],
        github: null,
        liveDemo: null,
        image: null,
        featured: false,
    },
];
