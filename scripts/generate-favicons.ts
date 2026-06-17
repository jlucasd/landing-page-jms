import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.resolve(__dirname, '../public/favicon.svg');
const publicDir = path.resolve(__dirname, '../public');

async function generateFavicons() {
  const svgBuffer = fs.readFileSync(svgPath);

  // favicon-32x32.png
  await sharp(svgBuffer, { density: 300 })
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('✅ favicon-32x32.png');

  // favicon-16x16.png
  await sharp(svgBuffer, { density: 300 })
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));
  console.log('✅ favicon-16x16.png');

  // apple-touch-icon (180x180)
  await sharp(svgBuffer, { density: 300 })
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✅ apple-touch-icon.png');

  // android-chrome-192x192
  await sharp(svgBuffer, { density: 300 })
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-192x192.png'));
  console.log('✅ android-chrome-192x192.png');

  // android-chrome-512x512
  await sharp(svgBuffer, { density: 300 })
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-512x512.png'));
  console.log('✅ android-chrome-512x512.png');

  console.log('\n🎉 All favicons generated!');
}

generateFavicons().catch(console.error);
