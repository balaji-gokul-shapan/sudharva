import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eventCategoryRecords } from "@/app/datas/eventCategories";
import { Particles } from "@/components/animation/particles";

export function generateStaticParams() {
  return eventCategoryRecords.map(({ anchorId }) => ({
    category: anchorId,
  }));
}

export async function generateMetadata({ params }) {
  const { category: categoryId } = await params;
  const category = eventCategoryRecords.find(
    ({ anchorId }) => anchorId === categoryId,
  );

  return {
    title: category
      ? `${category.label} — Sudharva Marathon`
      : "Event Category — Sudharva Marathon",
    description: category?.description ?? "Explore Sudharva Marathon events.",
  };
}

export default async function CategoryPage({ params }) {
  const { category: categoryId } = await params;
  const category = eventCategoryRecords.find(
    ({ anchorId }) => anchorId === categoryId,
  );

  if (!category) {
    notFound();
  }

  const categoryColor = `var(--brand-${category.key})`;
  const categoryTint = `var(--brand-${category.key}-tint)`;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background text-foreground">
      <Particles
        className="absolute inset-0 z-0"
        quantity={70}
        size={1.5}
        staticity={60}
        ease={60}
        backgroundColor={`var(--brand-${category.key})`}
        color={`var(--brand-${category.key})`}
      />
      <section className="container-page relative z-10 py-10 sm:py-16">
        <Link
          href="/event"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition hover:text-accent"
        >
          <span aria-hidden="true">←</span>
          All events
        </Link>

        <div
          className="grid overflow-hidden rounded-3xl border bg-surface shadow-xl lg:grid-cols-2"
          style={{
            borderColor: `color-mix(in srgb, ${categoryColor} 30%, var(--border))`,
          }}
        >
          <div className="relative min-h-72 bg-muted sm:min-h-96 lg:min-h-[560px]">
            <Image
              src={category.detailImg}
              alt={category.label}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
            <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/35 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: categoryColor }}
                aria-hidden="true"
              />
              {category.tag}
            </span>
          </div>

          <div className="flex flex-col p-6 sm:p-10 lg:p-12">
            <p
              className="text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: categoryColor }}
            >
              Event category {category.number}
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {category.label}
            </h1>
            <p className="mt-4 text-lg font-medium text-ink-soft">
              {category.message}
            </p>
            <p className="mt-3 leading-7 text-ink-soft">
              {category.description}
            </p>

            <div
              className="mt-8 rounded-2xl border p-5"
              style={{
                backgroundColor: categoryTint,
                borderColor: `color-mix(in srgb, ${categoryColor} 35%, var(--border))`,
              }}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Entry fee per runner
              </p>
              <p
                className="mt-1 text-4xl font-bold"
                style={{ color: categoryColor }}
              >
                {category.Amount}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Included with your registration
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {category.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2 text-sm text-ink-soft"
                  >
                    <span
                      className="mt-0.5 shrink-0 font-bold"
                      style={{ color: categoryColor }}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border px-8 py-3 text-sm font-bold uppercase tracking-wider shadow-md transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                color: categoryColor,
                backgroundColor: categoryTint,
                borderColor: `color-mix(in srgb, ${categoryColor} 45%, transparent)`,
              }}
            >
              {category.ButtonText}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
