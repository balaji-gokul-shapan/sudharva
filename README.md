This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API proxy

Set `API_BASE_URL` in `.env.local` to the backend base URL. Browser requests to `/api/...` are forwarded to that server, so the backend does not need to allow browser CORS requests. The default upstream prefix is `/api`, unless the base URL already ends in `/api`. Set `NEXT_APP_API_PREFIX` to override the prefix, or set it to an empty value to use the base URL as-is. For example, `/api/pincode/600012` is forwarded to `https://your-backend/api/pincode/600012`. Restart the dev server after changing environment variables.

If your local backend uses a private or self-signed TLS certificate and OTP requests fail with certificate verification errors, you can set `ALLOW_INSECURE_DEV_SSL=true` in `.env.local` during local development. Never enable this in production.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
