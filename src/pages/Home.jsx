import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Projects from '../components/Projects/Projects';
import Experience from '../components/Experience/Experience';
import CreativePreview from '../components/Creative/CreativePreview';
import Contact from '../components/Contact/Contact';

export default function Home() {
    return (
        <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <CreativePreview />
            <Contact />
        </main>
    );
}
