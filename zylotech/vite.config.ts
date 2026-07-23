import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

const publicRoutes = [
  '/products',
  '/about',
  '/blog',
  '/contact',
  '/lottery-tracker',
]

const blogRoutes = [
  'how-to-start-trading-cryptocurrency-safely-from-ghana',
  'three-things-every-new-pastor-needs-in-their-first-year',
  'how-to-analyse-lottery-numbers-with-data-instead-of-luck',
  'build-a-telegram-price-alert-bot-in-python-in-30-minutes',
  'how-to-receive-crypto-payments-in-your-ghana-business',
  'why-your-church-needs-a-discipleship-system-not-more-programs',
].map((slug) => `/blog/${slug}`)

const routeLastmod = {
  '/': new Date(),
  '/products': new Date(),
  '/about': new Date(),
  '/blog': new Date(),
  '/contact': new Date(),
  '/lottery-tracker': new Date(),
  '/blog/how-to-start-trading-cryptocurrency-safely-from-ghana': new Date('2024-01-15'),
  '/blog/three-things-every-new-pastor-needs-in-their-first-year': new Date('2024-02-03'),
  '/blog/how-to-analyse-lottery-numbers-with-data-instead-of-luck': new Date('2024-02-20'),
  '/blog/build-a-telegram-price-alert-bot-in-python-in-30-minutes': new Date('2024-03-10'),
  '/blog/how-to-receive-crypto-payments-in-your-ghana-business': new Date('2024-03-28'),
  '/blog/why-your-church-needs-a-discipleship-system-not-more-programs': new Date('2024-04-12'),
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://zylotechhub.com',
      dynamicRoutes: [...publicRoutes, ...blogRoutes],
      lastmod: routeLastmod,
    }),
  ],
  server: {
    allowedHosts: true,
  },
})
