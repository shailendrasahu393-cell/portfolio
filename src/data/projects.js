export const projects = [
    {
        id: 'developer-portfolio',
        title: 'Developer Portfolio',
        shortDescription: 'High-performance interactive developer portfolio.',
        description:
            'A professional developer portfolio website featuring a responsive dark-theme design, cinematic scroll-based reveal animations, a 3D glassmorphism tilt engine, and a natively integrated video processing workflow.',
        problem: 'Needed a premium online presence that effectively merges software engineering aesthetics with visual media capabilities without bloat.',
        solution:
            'Engineered a highly optimized React/Vite single-page application utilizing intersection observers for smooth UI transitions, custom CSS logic, and automated local FFmpeg integrations for content processing.',
        technologies: ['React', 'JavaScript', 'Vite', 'CSS', 'FFmpeg'],
        features: [
            'Cinematic scroll reveals',
            '3D Tilt Profile Interface',
            'Optimized Video Carousels',
            'Fully Responsive Architecture',
        ],
        github: 'https://github.com/shailendrasahu393-cell/portfolio',
        liveDemo: 'https://shailendrasahu.onrender.com/',
        image: '/assets/developer-portfolio-screenshot.png',
        featured: true,
    },
    {
        id: 'tct-lab-portal',
        title: 'TCT LAB Portal',
        shortDescription: 'Technical Computer Training Resource Directory.',
        description:
            'A centralized privacy-first resource directory that gives students one clear place to find shared lab links, coding exercises, contests, and practice resources from their faculty.',
        problem: 'Students struggled to find the right resource among scattered chat messages, and standard systems required heavy logins.',
        solution:
            'Engineered a fast, accessible web portal focused entirely on serving approved lab links efficiently, without needing WhatsApp login or chat accesses.',
        technologies: ['React', 'Vite', 'Lucide', 'Axios'],
        features: [
            'Centralized Resource Organization',
            'Privacy-First Model (No Logins required)',
            'Instant UI Search & Filters',
        ],
        github: 'https://github.com/shailendrasahu393-cell/tct',
        liveDemo: 'https://tct-404.onrender.com/',
        image: '/assets/tct-lab-portal-screenshot.png',
        featured: true,
    },
];
