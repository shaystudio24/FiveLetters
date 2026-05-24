const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const s = size / 512; // scale factor

  // Background: sage green rounded square
  const r = 100 * s;
  ctx.fillStyle = '#7D9B76';
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();

  // Scalloped circle as approximation (tan fill)
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 155 * s;
  const innerR = 130 * s;
  const petals = 14;

  ctx.fillStyle = '#F5F0E8';
  ctx.beginPath();
  for (let i = 0; i <= 360; i += 1) {
    const angle = (i * Math.PI) / 180;
    const scallop = Math.cos(petals * angle);
    const rad = outerR - (outerR - innerR) * 0.5 * (1 - scallop);
    const x = cx + rad * Math.cos(angle);
    const y = cy + rad * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Seedling emoji
  ctx.font = `${Math.round(160 * s)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🌱', cx, cy + 10 * s);

  return canvas;
}

const sizes = [192, 512];
sizes.forEach(size => {
  const canvas = drawIcon(size);
  const out = path.join(__dirname, `icon-${size}.png`);
  fs.writeFileSync(out, canvas.toBuffer('image/png'));
  console.log(`✓ icon-${size}.png`);
});
