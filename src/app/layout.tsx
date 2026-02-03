import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";
import type { RootLayoutProps } from "@/types";



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
        <html lang="pt-Br">
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
