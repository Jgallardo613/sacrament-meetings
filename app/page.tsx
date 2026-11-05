import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center py-12 space-y-4">
        <h1 className="font-serif text-4xl font-bold text-blue-900">
          Sacrament Meeting Planner
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto text-lg">
          A tool for bishoprics and branch leaders to plan, review, and share
          sacrament meeting agendas with ward members.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/meetings/current" className="btn-primary">
            View This Week
          </Link>
          <Link
            href="/meetings"
            className="border border-blue-900 text-blue-900 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
          >
            All Meetings
          </Link>
        </div>
      </section>

      {/* Feature image */}
      <section className="flex justify-center">
        <Image
          src="/jesus-christ.jpg"
          alt="Jesus the Christ, painting by Del Parson"
          width={800}
          height={400}
          className="rounded-lg shadow object-contain w-full max-w-2xl aspect-[2/1] bg-[#4a6b8b]"
          priority
        />
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            title: 'Plan Meetings',
            desc: 'Track hymns, speakers, prayers, and announcements for each Sunday.',
          },
          {
            title: 'Print Programs',
            desc: 'Generate a clean print-ready program for any meeting in one click.',
          },
          {
            title: 'Review History',
            desc: 'Browse past meetings and their full agendas at any time.',
          },
        ].map((f) => (
          <div key={f.title} className="card text-center space-y-2">
            <h2 className="font-semibold text-blue-900">{f.title}</h2>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
