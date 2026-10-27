import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MotionProvider from "@/components/motion/MotionProvider";
import SmoothScroll from "@/components/motion/SmoothScroll";
import type { Metadata, Viewport } from "next";
import type { RootLayoutProps } from "@/types";
import { headers } from "next/headers";
import Script from "next/script";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { site, siteUrl } from "@/lib/site";

const bricolage = Bricolage_Grotesque({
    variable: "--font-bricolage",
    subsets: ["latin", "latin-ext"],
    axes: ["opsz", "wdth"],
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: site.title,
        template: `%s | ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    authors: [{ name: site.fullName, url: site.links.linkedin }],
    creator: site.fullName,
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        siteName: site.name,
        locale: site.locale,
        alternateLocale: [site.alternateLocale],
        title: site.title,
        description: site.description,
        url: "/",
    },
    twitter: {
        card: "summary_large_image",
        title: site.title,
        description: site.description,
    },
};

export const viewport: Viewport = {
    themeColor: "#0e191c",
};

export default async function RootLayout({ children }: RootLayoutProps) {
    // Definido pelo middleware nas rotas do blog; nas demais o idioma vem da escolha do visitante.
    const siteLocale = (await headers()).get("x-site-locale");
    const forcedLocale = siteLocale === "en" ? "en" : siteLocale === "pt" ? "pt" : undefined;

    return (
        <html lang={forcedLocale === "en" ? "en" : "pt-BR"} className={bricolage.variable} data-theme="dark" suppressHydrationWarning>
            <head>
                {/* Aplica o tema salvo antes da primeira pintura, para não piscar o escuro. */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
                    }}
                />
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
                <LocaleProvider forcedLocale={forcedLocale}>
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
