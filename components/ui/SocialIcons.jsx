"use client";

import { FacebookIcon, InstagramIcon, Linkedin01Icon, NewTwitterIcon, TwitterIcon, YoutubeIcon } from "@animateicons/react/huge";
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";

const SOCIAL_ICONS = [
  {id: 1, icon: InstagramIcon, link: "https://www.instagram.com/appacharitabletrust"},
  {id: 2, icon: FacebookIcon, link: "https://www.facebook.com/aravindsudharsanam"},
  {id: 3, icon: YoutubeIcon, link: "https://www.youtube.com/AppacharityTrust"},
  {id: 4, icon: Linkedin01Icon, link: "https://www.linkedin.com/"},
  {id: 5, icon: NewTwitterIcon, link: "https://www.twitter.com/"},
];

export default function SocialIcons() {
  return (
    <div className="mt-6 flex items-center gap-2" aria-hidden="true">
      {SOCIAL_ICONS.map(({id, icon: Icon, link}) => (
        <a key={id} href={link} className="rounded-md p-2 text-ink-soft">
          <Icon  duration={1} color="currentColor" className="h-6 w-6" />
        </a>
      ))}
    </div>
  );
}
