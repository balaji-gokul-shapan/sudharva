import RulesHero from './pages/RulesHero'
import { createPageMetadata } from "../../seo";

export const metadata = createPageMetadata({
  title: "Rules & Regulations | Sudharva Marathon 2027",
  description:
    "Everything you need to know to run safely, stay prepared, and make the most of race day at Sudharva Marathon 2027.",
  path: "/event/rules",
});

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <RulesHero />
    </main>
  )
}
