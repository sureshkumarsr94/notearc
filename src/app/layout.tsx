import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.notearc.info'),
  title: {
    default: 'NoteArc - Discover Stories that Ignite Your Creativity',
    template: '%s | NoteArc',
  },
  description: 'Explore insightful articles on personal development, communication, productivity, and finance. Join NoteArc to discover stories that inspire and transform.',
  keywords: ['blog', 'personal development', 'self improvement', 'productivity', 'finance', 'communication skills', 'habits', 'lifestyle'],
  authors: [{ name: 'NoteArc Team' }],
  creator: 'NoteArc',
  publisher: 'NoteArc',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.notearc.info',
    siteName: 'NoteArc',
    title: 'NoteArc - Discover Stories that Ignite Your Creativity',
    description: 'Explore insightful articles on personal development, communication, productivity, and finance.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoteArc - Discover Stories that Ignite Your Creativity',
    description: 'Explore insightful articles on personal development, communication, productivity, and finance.',
    creator: '@notearc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your actual verification code
  },
  other: {
    'google-adsense-account': 'ca-pub-3921845751221806',
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
