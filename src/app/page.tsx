import About from "@/components/About";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export const dynamic = "force-dynamic";

export default function Home() {
    return (
        <main>
            <Hero />
            <About />
            <Services />
            <Skills />
            <Projects />
            <Contact />
        </main>
    );
}
