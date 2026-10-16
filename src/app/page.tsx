import About from "@/components/About";
import Hero from "@/components/Hero";
import LatestArticles from "@/components/LatestArticles";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";
import { homeJsonLd } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

export default function Home() {
    return (
        <main>
            <JsonLd data={homeJsonLd()} />
            <Hero />
            <About />
            <Services />
            <Skills />
            <Projects />
            <LatestArticles />
            <Contact />
        </main>
    );
}
