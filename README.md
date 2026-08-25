<div align="center">
  <img src="public/assets/shailendraimage.jpg" width="120" height="120" style="border-radius: 50%" alt="Logo" />
  <h1>Shailendra's Developer Portfolio</h1>
  <p>A high-performance, dark-themed digital portfolio built with React & Vite. Features cinematic scroll animations, 3D interactive elements, and heavily optimized video asset delivery.</p>

  <p>
    <a href="https://portfolio-uck1.onrender.com/"><strong>View Live Demo »</strong></a>
    <br />
  </p>
</div>

## 🚀 Features

- **Cinematic Reveal Animations:** Implemented a custom `ScrollReveal` component mapping `IntersectionObserver` to graceful CSS translate-fade states.
- **3D Hero Interface:** Replaced a static avatar block with a dual-pane, tilt-enabled glassmorphism `ProfileCard`.
- **Intelligent Navigation:** Scroll-contextual header that vanishes on downscroll and drops natively on reverse.
- **Hardware-Accelerated BG:** A `<DigitalSurfaceBg />` node rendering a high-FPS perspective mesh.
- **Optimized Video Pipeline:** Automated processing ensuring massive raw HD assets are crunched locally and smoothly presented through GitHub LFS parameters.

## 🛠 Tech Stack

- **Framework:** React 18 / Vite
- **Styling:** Pure Modular CSS (Vanilla)
- **Icons:** React Icons (`react-icons/fi`)
- **Animation Framework:** CSS Transitions + Intersection Observers
- **Media Optimization:** FFmpeg (Node child_process)

## 📦 Deployment (Render Native)

Deploying this portfolio on Render is completely free.
1. Form a free account at [Render.com](https://render.com/).
2. On your Render dashboard, click **"New"** and select **"Static Site"**.
3. Point to this repository via GitHub auth.
4. Apply these configuration values:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Root Directory:** *(Left completely blank)*
5. Click **Create Static Site**.

## 💻 Local Construction

Clone the repository and run locally:

```bash
git clone https://github.com/shailendrasahu393-cell/portfolio.git
cd portfolio
npm install
npm run dev
```

Your system will boot instantly at `localhost:5173`. Any modified `.css` or `.jsx` module will Hot-Module-Reload recursively.
