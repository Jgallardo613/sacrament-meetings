import NavLinks from './NavLinks';

export default function Header() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4 max-w-4xl py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="font-serif text-xl font-bold">Rexburg 4th Ward</span>
          <p className="text-blue-200 text-sm">{today}</p>
        </div>
        <NavLinks />
      </div>
    </header>
  );
}
