import fs from "fs";
import path from "path";
import sharp from "sharp";

// Helper to construct a multi-resolution ICO file from PNG buffers
function createIco(pngBuffers, dimensions) {
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const directorySize = 16 * numImages;
  let currentOffset = headerSize + directorySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO type
  header.writeUInt16LE(numImages, 4); // Number of images

  const directories = [];
  for (let i = 0; i < numImages; i++) {
    const dim = dimensions[i];
    const buf = pngBuffers[i];
    const dir = Buffer.alloc(16);
    dir.writeUInt8(dim >= 256 ? 0 : dim, 0); // Width
    dir.writeUInt8(dim >= 256 ? 0 : dim, 1); // Height
    dir.writeUInt8(0, 2); // Color count (0 if >=8bpp)
    dir.writeUInt8(0, 3); // Reserved
    dir.writeUInt16LE(1, 4); // Color planes
    dir.writeUInt16LE(32, 6); // Bits per pixel
    dir.writeUInt32LE(buf.length, 8); // Size of image data
    dir.writeUInt32LE(currentOffset, 12); // Offset of image data
    currentOffset += buf.length;
    directories.push(dir);
  }

  return Buffer.concat([header, ...directories, ...pngBuffers]);
}

async function generateFavicons() {
  const sourceImage = path.resolve("public/brand/logo-icon.png");
  if (!fs.existsSync(sourceImage)) {
    throw new Error(`Source image not found: ${sourceImage}`);
  }

  console.log("Generating full favicon suite from:", sourceImage);

  // 1. Generate individual PNG sizes
  const sizes = [
    { name: "public/favicon-16x16.png", size: 16 },
    { name: "public/favicon-32x32.png", size: 32 },
    { name: "public/favicon-48x48.png", size: 48 },
    { name: "public/apple-touch-icon.png", size: 180 },
    { name: "public/android-chrome-192x192.png", size: 192 },
    { name: "public/android-chrome-512x512.png", size: 512 },
    { name: "public/icon.png", size: 512 },
    { name: "src/app/icon.png", size: 512 },
  ];

  for (const s of sizes) {
    const outBuf = await sharp(sourceImage)
      .resize(s.size, s.size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    fs.writeFileSync(path.resolve(s.name), outBuf);
    console.log(`✓ Generated ${s.name} (${s.size}x${s.size}, ${outBuf.length} bytes)`);
  }

  // 2. Generate multi-resolution favicon.ico (16, 32, 48)
  const ico16 = await sharp(sourceImage).resize(16, 16).png().toBuffer();
  const ico32 = await sharp(sourceImage).resize(32, 32).png().toBuffer();
  const ico48 = await sharp(sourceImage).resize(48, 48).png().toBuffer();

  const icoBuffer = createIco([ico16, ico32, ico48], [16, 32, 48]);
  fs.writeFileSync(path.resolve("public/favicon.ico"), icoBuffer);
  fs.writeFileSync(path.resolve("src/app/favicon.ico"), icoBuffer);
  console.log(`✓ Generated public/favicon.ico and src/app/favicon.ico (${icoBuffer.length} bytes)`);

  // 3. Generate site.webmanifest
  const manifest = {
    name: "SuchnaSetu",
    short_name: "SuchnaSetu",
    description: "Verified Indian Government Jobs, Exams, Notifications, and Public Gazettes",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#1e3a8a",
    background_color: "#ffffff",
    display: "standalone",
    start_url: "/",
  };
  fs.writeFileSync(path.resolve("public/site.webmanifest"), JSON.stringify(manifest, null, 2));
  console.log("✓ Generated public/site.webmanifest");
}

generateFavicons().catch(console.error);
