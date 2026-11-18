import RulesHero from './pages/RulesHero'

export function generateStaticParams() {
  return [{ eventOverview: "event" }];
}

export function generateStaticParams() {
  return [{ eventOverview: "event" }];
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <RulesHero />
    </main>
  )
}
