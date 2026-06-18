import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JP Photography | Luxury Wedding Filmmakers & Photographers",
    template: "%s | JP Photography",
  },
  description: "Award-winning premium wedding filmmakers and luxury storytellers based in Rajasthan. Crafting editorial, cinematic memories of pre-weddings, traditional and destination ceremonies globally.",
  keywords: ["wedding photography", "cinematic wedding films", "luxury wedding photographers", "JP Photography", "Rajasthan wedding photography", "destination weddings"],
  authors: [{ name: "Jay Prakash" }],
  creator: "JP Photography",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://jpphotography.in",
    title: "JP Photography | Luxury Wedding Filmmakers & Photographers",
    description: "Multi-award-winning premium wedding filmmakers based in Rajasthan. Documenting fleeting sparks of human emotion eternally.",
    siteName: "JP Photography",
    images: [
      {
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "JP Photography Luxury Wedding Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JP Photography | Luxury Wedding Storytellers",
    description: "We capture the fleeting sparks of human emotion. Luxury wedding photography and cinematography.",
    images: ["https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-luxury-bg text-white">
        <Providers>
          <Navbar />
          <div className="flex-grow">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
