import Link from "next/link";
import { CityTimelapse } from "@/components/CityTimelapse";
import { PhaseTicker } from "@/components/PhaseTicker";

const highlights = [
  {
    title: "Signature Residences",
    description:
      "Curated homes that capture skyline views, refined amenities, and architecture tailored to discerning owners.",
  },
  {
    title: "Integrated Urban Living",
    description:
      "Walkable promenades, boutique retail, dining, and green corridors connect every address within the master plan.",
  },
  {
    title: "Sustainable Operations",
    description:
      "Geo-thermal systems, smart glass, and water-conscious landscaping reduce consumption without compromising luxury.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <CityTimelapse />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#020617,transparent_68%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90" />

      <main className="relative z-10 flex min-h-screen flex-col px-6 py-6 md:px-12 lg:px-20">
        <header className="flex items-center justify-between">
          <div className="flex flex-col leading-tight">
            <span className="text-xs uppercase tracking-[0.5em] text-sky-200/80">
              Skyline Estates
            </span>
            <span className="text-2xl font-semibold text-white md:text-3xl">
              Development Group
            </span>
          </div>
          <Link
            href="mailto:hello@skylineestates.com"
            className="group rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium uppercase tracking-[0.2em] text-white backdrop-blur transition-colors hover:border-white/60 hover:bg-white/20"
          >
            Request A Brief
          </Link>
        </header>

        <section className="mt-16 flex flex-1 flex-col gap-16 lg:flex-row">
          <div className="flex max-w-xl flex-col gap-8">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.6em] text-sky-200/70">
                Website Under Development
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl md:leading-tight">
                A new city landmark is emerging. Experience the journey from
                untouched earth to illuminated skyline.
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-slate-200/80 md:text-lg">
                Our digital flagship launches alongside the completion of
                Skyline Residences — a 14-acre community of curated homes,
                hospitality, and culture. Preview the transformation below and
                secure your place on the reservation list.
              </p>
            </div>
            <PhaseTicker />
          </div>

          <div className="flex flex-1 flex-col justify-end gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:border-white/30 hover:bg-white/10"
                >
                  <h2 className="text-lg font-semibold text-white">
                    {highlight.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-200/80">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.4em] text-slate-200/60">
              <span className="rounded-full border border-white/10 px-4 py-2">
                Launching Q1 · 2025
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2">
                Partnered with Atelier Nova
              </span>
            </div>
          </div>
        </section>

        <footer className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-slate-200/70 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Skyline Estates Development Group</span>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://maps.google.com/?q=Skyline%20Estates%20Show%20Gallery"
              target="_blank"
              className="transition hover:text-white"
              rel="noreferrer"
            >
              2150 Meridian Avenue, Suite 280 · Boston, MA
            </a>
            <a
              href="tel:+16175550123"
              className="transition hover:text-white"
            >
              +1 (617) 555-0123
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
