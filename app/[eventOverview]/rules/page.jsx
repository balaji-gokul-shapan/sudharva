import RulesHero from './pages/RulesHero'

export const metadata = {
  title: "Rules & Regulations | Sudharva Marathon 2025",
  description: "Everything you need to know to run safely, stay prepared, and make the most of race day at Sudharva Marathon 2025.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <RulesHero />
    </main>
  )
}
