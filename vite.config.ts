import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import sharp from 'sharp';

/**
 * Gera cópias WebP de PNG/JPG na saída de build (originais mantidos como fallback).
 */
function webpGeneratorPlugin(): Plugin {
  return {
    name: 'webp-generator',
    apply: 'build',
    enforce: 'post',
    async closeBundle() {
      const assetsDir = path.resolve(__dirname, 'dist', 'assets');
      if (!fs.existsSync(assetsDir)) return;
      const imageFiles = fs.readdirSync(assetsDir).filter(f => /\.(png|jpe?g)$/i.test(f));
      for (const file of imageFiles) {
        const inputPath = path.resolve(assetsDir, file);
        const outputPath = path.resolve(assetsDir, file.replace(/\.(png|jpe?g)$/i, '.webp'));
        try {
          await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);
        } catch (err) {
          console.warn(`Falha ao converter ${file} para WebP:`, err);
        }
      }
    },
  };
}

export default defineConfig({
  server: { port: 3000, host: '0.0.0.0' },
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80, lossless: false },
    }),
    webpGeneratorPlugin(),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: { vendor: ['react', 'react-dom', 'framer-motion'] },
      },
    },
  },
});
