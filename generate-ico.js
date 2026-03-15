const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const src = path.join(__dirname, 'images', 'logo.png');

async function generateIco() {
    // Generate a 32x32 PNG buffer
    const png32 = await sharp(src)
        .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();

    // Generate a 16x16 PNG buffer
    const png16 = await sharp(src)
        .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();

    // Build ICO file manually (ICO format with PNG entries)
    const images = [png16, png32];
    const headerSize = 6;
    const entrySize = 16;
    const numImages = images.length;

    // Calculate offsets
    let offset = headerSize + (entrySize * numImages);
    const entries = [];

    for (const img of images) {
        const size = img === png16 ? 16 : 32;
        entries.push({ size, data: img, offset });
        offset += img.length;
    }

    // ICO header: reserved(2) + type(2) + count(2)
    const header = Buffer.alloc(headerSize);
    header.writeUInt16LE(0, 0);        // Reserved
    header.writeUInt16LE(1, 2);        // Type: 1 = ICO
    header.writeUInt16LE(numImages, 4); // Number of images

    // ICO directory entries
    const directory = Buffer.alloc(entrySize * numImages);
    entries.forEach((entry, i) => {
        const off = i * entrySize;
        directory.writeUInt8(entry.size === 256 ? 0 : entry.size, off);      // Width
        directory.writeUInt8(entry.size === 256 ? 0 : entry.size, off + 1);  // Height
        directory.writeUInt8(0, off + 2);           // Color palette
        directory.writeUInt8(0, off + 3);           // Reserved
        directory.writeUInt16LE(1, off + 4);        // Color planes
        directory.writeUInt16LE(32, off + 6);       // Bits per pixel
        directory.writeUInt32LE(entry.data.length, off + 8);  // Image size
        directory.writeUInt32LE(entry.offset, off + 12);      // Image offset
    });

    // Combine everything
    const ico = Buffer.concat([header, directory, ...entries.map(e => e.data)]);
    fs.writeFileSync(path.join(__dirname, 'favicon.ico'), ico);
    console.log('favicon.ico generated!');
}

generateIco().catch(console.error);
