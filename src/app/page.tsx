import About from "@/components/About";
import Hero from "@/components/Hero";
import Porjects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export default function Home() {
    return (
        <main>
            <Hero />
            <About />
            <Skills />
            <Porjects />
            <Contact />
        </main>
    );
}
