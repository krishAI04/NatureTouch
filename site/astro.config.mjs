// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://naturetouch.co.in',
  server: { port: 4321 },
  vite: {
    server: { watch: { ignored: ['**/.taste-skill/**', '**/shots/**'] } },
  },
});
