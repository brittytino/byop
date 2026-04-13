import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pngToIco from "png-to-ico";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const sourcePngPath = path.join(rootDir, "src", "public", "logo.png");
const publicDir = path.join(rootDir, "public");
const iconsDir = path.join(publicDir, "icons");

const sizes = [16, 32, 48, 64, 96, 128, 180, 192, 256, 384, 512];

async function ensureDirs() {
  await fs.mkdir(iconsDir, { recursive: true });
}

async function generatePngs() {
  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    await sharp(sourcePngPath)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath);
  }
}

async function generateAppleTouchIcon() {
  await sharp(sourcePngPath)
    .resize(180, 180, { fit: "cover" })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(iconsDir, "apple-touch-icon.png"));
}

async function generateFaviconIco() {
  const icoBuffer = await pngToIco([
    path.join(iconsDir, "icon-16x16.png"),
    path.join(iconsDir, "icon-32x32.png"),
    path.join(iconsDir, "icon-48x48.png")
  ]);

  await fs.writeFile(path.join(publicDir, "favicon.ico"), icoBuffer);
}

async function generateSafariPinnedTab() {
  const safariSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="240" fill="#0b0b0b"/>
  <circle cx="256" cy="256" r="212" fill="none" stroke="#f5a300" stroke-width="18"/>
  <text x="256" y="294" fill="#f5a300" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" font-weight="700">B</text>
</svg>`;

  await fs.writeFile(path.join(iconsDir, "safari-pinned-tab.svg"), safariSvg, "utf8");
}

async function generateManifest() {
  const manifest = {
    name: "BYOP - Build Your Own Portfolio",
    short_name: "BYOP",
    description: "Generate and publish your portfolio for free.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0b",
    theme_color: "#f5a300",
    icons: [
      { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any"
      }
    ]
  };

  await fs.writeFile(
    path.join(publicDir, "site.webmanifest"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );
}

async function copyShortcutFavicons() {
  await fs.copyFile(
    path.join(iconsDir, "icon-32x32.png"),
    path.join(publicDir, "favicon-32x32.png")
  );
  await fs.copyFile(
    path.join(iconsDir, "icon-16x16.png"),
    path.join(publicDir, "favicon-16x16.png")
  );
}

async function main() {
  try {
    await fs.access(sourcePngPath);
  } catch {
    console.error(`Source logo not found at: ${sourcePngPath}`);
    process.exit(1);
  }

  await ensureDirs();
  await generatePngs();
  await generateAppleTouchIcon();
  await generateFaviconIco();
  await generateSafariPinnedTab();
  await generateManifest();
  await copyShortcutFavicons();

  console.log("Favicons generated successfully from src/public/logo.png");
}

main().catch((error) => {
  console.error("Failed to generate favicons:", error);
  process.exit(1);
});
