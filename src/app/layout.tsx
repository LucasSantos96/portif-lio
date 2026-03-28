import { Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";
import type { RootLayoutProps } from "@/types";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
    title: "Portifólio",
    description: "Lucas Santos de Oliveira",
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="pt-Br" className={cn("font-sans", geist.variable)}>
            <body
                className={`${spaceGrotesk.variable} antialiased`}
            >
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}
