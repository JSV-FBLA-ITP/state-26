import type { Metadata, Viewport } from 'next';
import { Nunito, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ClientLayout } from '@/components/ClientLayout';

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', weight: ['400', '500', '600', '700', '800', '900'] });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'PetPal — Happy Pets. Smart Money.',
  description:
    'Raise your dream virtual pet while mastering real-world money skills. PetPal makes financial literacy fun, interactive, and rewarding for a new generation.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'PetPal — Happy Pets. Smart Money. One App.',
    description: 'Raise your dream pet while mastering real-world money skills. It\'s like a game — but the lessons stick.',
    siteName: 'PetPal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetPal — Happy Pets. Smart Money.',
    description: 'Raise your dream pet while mastering real-world money skills.',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF6B47',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${plusJakarta.variable} font-(--font-jakarta) antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
