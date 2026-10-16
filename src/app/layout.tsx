import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MotionProvider from "@/components/motion/MotionProvider";
import SmoothScroll from "@/components/motion/SmoothScroll";
import type { Metadata, Viewport } from "next";
import type { RootLayoutProps } from "@/types";
import Script from "next/script";
import { LocaleProvider } from "@/i18n/LocaleProvider";

const bricolage = Bricolage_Grotesque({
    variable: "--font-bricolage",
    subsets: ["latin", "latin-ext"],
    axes: ["opsz", "wdth"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Lucas Santos, desenvolvedor full-stack",
    description:
        "Sites, sistemas web e agentes de IA com n8n, LangChain, LangGraph e Mastra. Portfólio de Lucas Santos de Oliveira.",
};

export const viewport: Viewport = {
    themeColor: "#0e191c",
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="pt-BR" className={bricolage.variable}>
            <head>
                <Script
                    id="google-tag-manager"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PBF5N76D');`,
                    }}
                />
            </head>
            <body className="antialiased" suppressHydrationWarning>
                <noscript dangerouslySetInnerHTML={{
                    __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PBF5N76D" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                }} />
                <LocaleProvider>
                    <MotionProvider>
                        <SmoothScroll />
                        <Header />
                        {children}
                        <Footer />
                    </MotionProvider>
                </LocaleProvider>
            </body>
        </html>
    );
}
