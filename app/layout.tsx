import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sacrament Meeting Planner',
  description: 'Plan and review sacrament meeting agendas for bishoprics and ward members.',
};

// Root layout: just the document shell. Each route group — (public) and
// (admin) — supplies its own header, navigation, and container.
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
