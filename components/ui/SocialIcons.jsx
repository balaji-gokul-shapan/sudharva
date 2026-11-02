"use client";

import { FacebookIcon, InstagramIcon, Linkedin01Icon, NewTwitterIcon, YoutubeIcon } from "@animateicons/react/huge";


const SOCIAL_ICONS = [
  {id: 1, icon: InstagramIcon, link: "https://www.instagram.com/sudharvarun"},
  {id: 2, icon: FacebookIcon, link: "https://www.facebook.com/profile.php?id=61596001076569"},
  {id: 3, icon: YoutubeIcon, link: "https://www.youtube.com/"},
  {id: 4, icon: Linkedin01Icon, link: "https://www.linkedin.com/in/sudharva-run-0b2451446"},
  {id: 5, icon: NewTwitterIcon, link: "https://www.twitter.com/appaatrust"},
];

export default function SocialIcons() {
  return (
    <div className="mt-6 flex items-center gap-2" aria-hidden="true">
      {SOCIAL_ICONS.map(({id, icon: Icon, link}) => (
        <a key={id} href={link} target="_blank" rel="noopener noreferrer" className="rounded-md p-2 text-ink-soft">
          <Icon  duration={1} color="currentColor" className="h-6 w-6" />
        </a>
      ))}
    </div>
  );
}
