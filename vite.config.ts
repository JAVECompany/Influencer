import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const headers = {
  'Permissions-Policy': 'display-capture=()',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { headers },
  preview: { headers },
})
