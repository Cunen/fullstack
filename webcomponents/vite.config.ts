import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'CustomComponents',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'lit', '@lit/react']
    }
  }
});