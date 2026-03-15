const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const src = path.join(__dirname, 'images', 'logo.png');
const outDir = path.join(__dirname, 'images');

async function generate() {
    // Favicon 32x32
    await sharp(src).resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(outDir, 'favicon-32x32.png'));

    // Favicon 16x16
    await sharp(src).resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(outDir, 'favicon-16x16.png'));

    // Apple touch icon 180x180
    await sharp(src).resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(outDir, 'apple-touch-icon.png'));

    // Android / PWA 192x192
    await sharp(src).resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(outDir, 'icon-192.png'));

    // Android / PWA 512x512
    await sharp(src).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(outDir, 'icon-512.png'));

    // OG image for social sharing — logo centered on navy background (1200x630)
    const logoBuffer = await sharp(src).resize(300, 300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

    await sharp({
        create: {
            width: 1200,
            height: 630,
            channels: 4,
            background: { r: 26, g: 35, b: 50, alpha: 255 }
        }
    })
    .composite([{ input: logoBuffer, gravity: 'centre' }])
    .png()
    .toFile(path.join(outDir, 'og-image.png'));

    console.log('All favicons and OG image generated!');
}

generate().catch(console.error);
