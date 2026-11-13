import RulesHero from '../../[eventOverview]/rules/pages/RulesHero'
import { createPageMetadata } from "../../seo";

export const metadata = createPageMetadata({
  title: 'Rules & Regulations | Sudharva Marathon 2027',
  description:
    'Everything you need to know to run safely, stay prepared, and make the most of race day at Sudharva Marathon 2027.',
  path: "/event/rules",
});

export default function EventRulesPage() {
  return (
    <main className="min-h-screen">
      <RulesHero />
    </main>
  )
}
