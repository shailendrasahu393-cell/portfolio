<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=28&duration=3000&pause=1000&color=F97316&center=true&vCenter=true&random=false&width=600&lines=Shailendra+Sahu;Software+Engineer+%7C+Video+Editor;Building+Code+%26+Creative+Experiences" alt="Typing SVG" />
</p>

<p align="center">
  <a href="https://shailendrasahu.onrender.com"><img src="https://img.shields.io/badge/🌐_Live_Demo-0b0b0b?style=for-the-badge&logo=render&logoColor=F97316" alt="Live Demo"/></a>
  <a href="https://github.com/shailendrasahu393-cell/portfolio"><img src="https://img.shields.io/badge/Source_Code-0b0b0b?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black" alt="GSAP"/>
  <img src="https://img.shields.io/badge/EmailJS-F97316?style=flat-square&logo=gmail&logoColor=white" alt="EmailJS"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3"/>
</p>

---

## ✨ Overview

A modern, interactive developer portfolio built with **React 19** and **Vite 8** — featuring a dark/orange design system, 3D interactive elements, smooth scroll animations, and cinematic visual effects. Designed to showcase both software engineering skills and creative capabilities.

---

## 🎨 Design Highlights

| Feature | Details |
|---|---|
| **Dark/Orange Theme** | Deep `#0b0b0b` background with vibrant `#f97316` orange accents throughout |
| **3D Holographic ID Card** | Interactive profile card with HUD overlay, elastic drag physics, and spring snap-back |
| **Animated Typography** | Split-color hero title with flowing gradient animation on "Engineer" |
| **Faded BG Silhouette** | Full-screen B&W photo faded into the hero background with radial masking |
| **Canvas Particle System** | Real-time orange particle network with mouse-reactive glow and repulsion |
| **Scroll Animations** | Reveal-on-scroll effects powered by custom intersection observer hooks |
| **Smooth Scrolling** | Lenis-powered buttery smooth scroll experience |
| **Certificate Marquee** | Infinite horizontal scroll slider with hover-pause and full-screen modal viewer |

---

## 🧱 Project Structure

```
portfolio/
├── public/
│   ├── assets/                    # Profile images, resume PDF
│   └── certificates/              # Certificate JPEGs (1–9)
├── src/
│   ├── components/
│   │   ├── Hero/                  # Hero section + 3D ProfileCard + DigitalSurfaceBg
│   │   ├── About/                 # About me section
│   │   ├── Skills/                # Tech stack showcase
│   │   ├── Projects/              # Project cards
│   │   ├── Experience/            # Work experience timeline
│   │   ├── Certificates/          # Marquee slider + modal viewer
│   │   ├── Contact/               # Contact form (EmailJS)
│   │   ├── Creative/              # Video editing showcase
│   │   ├── Navbar/                # Smart hide/show navbar
│   │   ├── Footer/                # Site footer
│   │   ├── Intro/                 # Loading intro animation
│   │   ├── VideoCarousel/         # Video carousel component
│   │   ├── DepthCarousel/         # 3D depth carousel
│   │   └── utils/                 # ScrollReveal utility
│   ├── data/
│   │   ├── profile.js             # Personal info & bio
│   │   ├── certificates.js        # Certificate metadata
│   │   └── socialLinks.js         # Social media links
│   ├── pages/
│   │   ├── Home.jsx               # Main landing page
│   │   ├── Creative.jsx           # Creative portfolio page
│   │   └── VideoDetails.jsx       # Individual video detail page
│   └── styles/
│       ├── variables.css           # Design tokens & theme system
│       └── globals.css             # Global styles & resets
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/shailendrasahu393-cell/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at **`http://localhost:5173`**

### Build for Production

```bash
npm run build
npm run preview    # Preview production build locally
```

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Routing** | React Router DOM v7 |
| **Animations** | GSAP 3, CSS Animations, Custom Spring Physics |
| **Smooth Scroll** | Lenis |
| **Email** | EmailJS |
| **Icons** | React Icons (Feather) |
| **Linting** | OxLint |
| **Styling** | Vanilla CSS with custom properties & design tokens |

---

## 📄 Key Sections

### 🏠 Hero
- Split-color animated typography ("Software" in white, "Engineer" in animated orange gradient)
- Faded B&W background silhouette with radial mask
- Interactive orange particle canvas (`DigitalSurfaceBg`)
- 3 CTA buttons: Projects, Resume, Source Code

### 🃏 3D Profile Card
- **HUD Layout**: SOFTWARE/ENGINEER stat, B.TECH badge, CSE 2029 status
- **Tech Badges**: React & Node.js tags
- **Cinematic Photo**: Orange-graded with sepia+hue-rotate filter and color-dodge overlay
- **Elastic Drag**: Rubber-band resistance with spring snap-back physics
- **3D Tilt**: Pointer-following tilt with parallax layers, shine, and glare
- **Holographic Scan Line**: Animated orange sweep across the card

### 🎓 Certificates
- Infinite marquee slider (auto-scroll, pauses on hover)
- Full-screen modal with zoom, pan, and download
- Data-driven via `src/data/certificates.js`

### 🎬 Creative
- Dedicated page for video editing portfolio
- Video carousel with depth effects
- Individual video detail pages

### 📬 Contact
- Functional contact form powered by EmailJS
- Direct email delivery without server-side setup

---

## 🎯 Performance

- **Lighthouse**: Optimized for Core Web Vitals
- **Code Splitting**: Vite's automatic chunking for fast initial load
- **Lazy Loading**: Images loaded on demand
- **Reduced Motion**: Respects `prefers-reduced-motion` accessibility preference
- **Canvas Optimization**: `requestAnimationFrame`-based particle system with efficient collision detection

---

## 📱 Responsive Design

Fully responsive across all breakpoints:

| Breakpoint | Behavior |
|---|---|
| `> 960px` | Full desktop layout with side-by-side hero |
| `480–960px` | Stacked layout, card above text, mobile nav |
| `< 480px` | Compact mobile, full-width buttons, collapsed nav |

---

## 🌐 Deployment

This portfolio is deployed on **[Render](https://render.com)** with automatic deploys from the `main` branch.

**Live URL**: [shailendrasahu.onrender.com](https://shailendrasahu.onrender.com)

### Deploy Your Own

1. Fork this repository
2. Connect to Render (or Vercel/Netlify)
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy 🚀

---

## 📝 Customization

To make this your own:

1. **Profile**: Edit `src/data/profile.js` — name, titles, bio, image paths
2. **Projects**: Update data in `src/components/Projects/`
3. **Certificates**: Add images to `public/certificates/` and update `src/data/certificates.js`
4. **Colors**: Modify the orange values (`#f97316`) in component CSS files
5. **Contact**: Configure EmailJS credentials in `src/components/Contact/`
6. **Resume**: Replace `public/assets/resume.pdf` with your own

---

## 📜 License

This project is open source and available for personal use and learning purposes.

---

<p align="center">
  <b>Built with ☕ and 🔥 by Shailendra Sahu</b>
</p>
