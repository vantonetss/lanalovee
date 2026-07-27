import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// ─────────────────────────────────────────────────────────────
// Montserrat — square, geometric sans-serif for the whole site
// ─────────────────────────────────────────────────────────────
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://from-vadik-for-lana.local"),
  title: "From Vadik for Lana 💕",
  description:
    "A little place for our memories — a romantic page made with love by Vadik for Lana.",
  keywords: ["love", "romantic", "Vadik", "Lana", "memories", "ДаДа"],
  authors: [{ name: "Vadik" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "From Vadik for Lana 💕",
    description:
      "A little place for our memories — made with love by Vadik. Tap the photos, press the ДаДа button, and find the secret. 💝",
    siteName: "From Vadik for Lana",
    type: "website",
    images: [
      {
        url: "/images/lana/main-portrait.jpg",
        width: 959,
        height: 1280,
        alt: "From Vadik for Lana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "From Vadik for Lana 💕",
    description: "A little place for our memories — made with love by Vadik.",
    images: ["/images/lana/main-portrait.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
