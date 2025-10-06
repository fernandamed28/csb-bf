// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CentreProvider } from "@/context/CentreContext"; // <-- ajout

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://www.csb-bf.com/"), // 🔹 ton domaine officiel
  title: "CSB-bf",
  description: "Confédération Syndicale Burkinabè",
  openGraph: {
    title: "CSB-bf | Confédération Syndicale Burkinabè",
    description: "Confédération Syndicale Burkinabè",
    url: "https://www.csb-bf.com/",
    siteName: "CSB-bf",
    images: [
      {
        url: "/images/csb_logo.png", // image 1200x630 px recommandée
        width: 1200,
        height: 630,
        alt: "Logo CSB-bf- Votre E-Carnet de Santé",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  icons: {
    icon: "/images/csb_logo.png",
    shortcut: "/images/csb_logo.png",
    apple: "/images/csb_logo.png",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CentreProvider> {/* 🔹 Le contexte est dispo partout */}
          {children}
        </CentreProvider>
      </body>
    </html>
  );
}
