import { Playfair_Display, EB_Garamond, Uncial_Antiqua } from "next/font/google";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Script from "next/script";

const uncial = Uncial_Antiqua({ weight: '400', subsets: ["latin"], variable: '--font-scripture' });
const garamond = EB_Garamond({ subsets: ["latin"], variable: '--font-body' });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${uncial.variable} ${garamond.variable}`}>
      <head>
        <Script src="https://unpkg.com/@tailwindcss/browser@4" strategy="afterInteractive" />
      </head>
      {/* Background is a clean, creamy white (Bone) with no heavy borders */}
      <body className="bg-[#FAF9F6] text-[#2C241A] antialiased font-body selection:bg-[#C2A66D]/30">
        
        {/* Subtle texture only, no vignette or creases */}
        <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10 pointer-events-none z-[9999]" />
        
        <Navbar />
        
        {/* Clean, wide main container */}
        <main className="relative max-w-7xl mx-auto px-8 sm:px-12 pt-40 pb-32 z-10 min-h-screen">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}