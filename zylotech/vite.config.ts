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

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://zylotech.com',
      dynamicRoutes: [...publicRoutes, ...blogRoutes],
    }),
  ],
  server: {
    allowedHosts: true,
  },
})
