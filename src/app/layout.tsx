import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "URPE Command Center",
  description:
    "Single pane of glass para operar el ecosistema URPE en tiempo real.",
  appleWebApp: {
    capable: true,
    title: "URPE",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: import("next").Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const DENSITY_BOOTSTRAP_SCRIPT = `(function(){try{var d=localStorage.getItem('urpe-density');if(d==='compact'||d==='comfortable')document.documentElement.dataset.density=d;}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: DENSITY_BOOTSTRAP_SCRIPT }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
