import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// trigger deploy
export default defineConfig({
  plugins: [react()],
});
