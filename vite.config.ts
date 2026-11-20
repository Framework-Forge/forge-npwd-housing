import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'forge-npwd-housing',
      filename: 'remoteEntry.js',
      exposes: { './config': './forge-npwd.config.ts' },
      shared: ['react', 'react-dom', '@emotion/react', 'react-router-dom'],
    }),
    topLevelAwait({
      promiseExportName: '__tla',
      promiseImportName: (index) => `__tla_${index}`,
    }),
  ],
  build: {
    outDir: 'web/dist',
    emptyOutDir: true,
    modulePreload: false,
    assetsDir: '',
    assetsInlineLimit: 1000000,
  },
});
