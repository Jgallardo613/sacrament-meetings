import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <Footer />
    </>
  );
}
