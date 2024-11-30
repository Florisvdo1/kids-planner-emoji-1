import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIcons() {
  const sizes = [192, 512];
  const inputSvg = path.join(__dirname, '../client/public/base-icon.svg');
  const outputDir = path.join(__dirname, '../client/public/icons');

  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    // Generate icons for each size
    for (const size of sizes) {
      await sharp(inputSvg)
        .resize(size, size)
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
    }

    console.log('PWA icons generated successfully!');
  } catch (error) {
    console.error('Error generating PWA icons:', error);
  }
}

generateIcons();
