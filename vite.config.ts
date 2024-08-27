import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server : {
    port: 6060,
    host: '192.168.10.202'  // Change this to your server IP or domain name
  }
})
