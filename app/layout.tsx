import type { Metadata } from 'next';
import { Lora, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sacrament Meeting Planner',
  description: 'Plan and review sacrament meeting agendas for bishoprics and ward members.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${sourceSans.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-[var(--color-bg)]">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
