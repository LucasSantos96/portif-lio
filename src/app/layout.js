import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";



const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"], 
});

export const metadata = {
  title: "Portifólio",
  description: "Lucas Santos de Oliveira",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-Br">
      <body
        className={`${spaceGrotesk.variable} antialiased`}
      >
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
