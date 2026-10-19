import CurrentYear from "@/components/utilities/CurrentYear";
import SocialIcons from "@/components/ui/SocialIcons";
import Image from "next/image";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Event Overview", href: "#overview" },
  { label: "Join Us", href: "#join" },
];

const PILLARS = [
  { label: "Health", dot: "bg-health" },
  { label: "Environment", dot: "bg-environment" },
  { label: "Education", dot: "bg-education" },
];

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="container-page px-4 py-12 sm:px-6 lg:px-8">
        {/* Columns: 1 (mobile) → 2 (sm) → 4 (lg) */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#home" className="group inline-flex items-center gap-2">
              {/* <span className="h-6 w-2.5 -skew-x-12 rounded-xs bg-linear-to-b from-primary to-accent transition-transform group-hover:scale-y-110" />
              <span className="font-serif text-2xl font-bold tracking-tight text-ink">
                Sudharva
              </span> */}
              <Image
                src="/image/cta/logo.png"
                alt="Sudharva Logo"
                width={250}
                height={64}
              />
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
              Empowering communities through health, environment and education -
              one step at a time.
            </p>
            <SocialIcons />
          </div>

          {/* Quick links */}
          <div>
            <h3 className="footer-heading">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="mt-4 space-y-2.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="footer-link text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Pillars */}
          <div>
            <h3 className="footer-heading">Our Pillars</h3>
            <ul className="mt-4 space-y-2.5">
              {PILLARS.map((pillar) => (
                <li key={pillar.label}>
                  <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${pillar.dot}`}
                      aria-hidden="true"
                    />
                    {pillar.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-heading">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              <li>Sri Sudharsanam Medical Services Pvt Ltd</li>
              <li>
                <a href="mailto:hello@sudharva.org" className="footer-link">
                  hello@sudharva.org
                </a>
              </li>
              <li>
                <a href="tel:+910000000000" className="footer-link">
                  +91 00000 00000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar: stacked on mobile, row from sm up */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-ink-soft sm:flex-row">
          <p>
            © <CurrentYear /> Sudharva. All rights reserved.
          </p>
          <p>For runners, communities and the planet.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
