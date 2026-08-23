import { Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";
import type { RootLayoutProps } from "@/types";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { LocaleProvider } from "@/i18n/LocaleProvider";

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
        <html lang="pt-BR" className={cn("font-sans", geist.variable)}>
            <Script
                id="google-tag-manager"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PBF5N76D');`,
                }}
            />
            <body
                className={`${spaceGrotesk.variable} antialiased`}
            >
                <noscript dangerouslySetInnerHTML={{
                    __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PBF5N76D" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                }} />
                <LocaleProvider>
                    <Header />
                    {children}
                    <Footer />
                </LocaleProvider>
            </body>
        </html>
    );
}
