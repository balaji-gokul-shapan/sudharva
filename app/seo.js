export const SITE_URL = "https://sudharva.com";

const socialImage = `${SITE_URL}/image/cta/hero-banner.png`;

export function createPageMetadata({ title, description, path }) {
  const canonicalUrl = new URL(path, SITE_URL).toString();

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Sudharva Marathon",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: socialImage,
          width: 1280,
          height: 720,
          alt: "Runners taking part in Sudharva Marathon",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}
