import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // otomatis update service worker
      manifest: {
        name: 'READTalk Messenger',
        short_name: 'READTalk',
        description: 'Talk to Trust',
        theme_color: '#000000',
        icons: [
          {
            src: '/assets/vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/assets/vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ]
})
