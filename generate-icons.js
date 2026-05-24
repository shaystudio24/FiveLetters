const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const s = size / 512; // scale factor
  const cx = size / 2;
  const cy = size / 2;

  // ── 1. Sage green rounded-square background ──────────────────────────────
  const bgRadius = 100 * s;
  ctx.fillStyle = '#7D9B76';
  ctx.beginPath();
  ctx.moveTo(bgRadius, 0);
  ctx.lineTo(size - bgRadius, 0);
  ctx.quadraticCurveTo(size, 0, size, bgRadius);
  ctx.lineTo(size, size - bgRadius);
  ctx.quadraticCurveTo(size, size, size - bgRadius, size);
  ctx.lineTo(bgRadius, size);
  ctx.quadraticCurveTo(0, size, 0, size - bgRadius);
  ctx.lineTo(0, bgRadius);
  ctx.quadraticCurveTo(0, 0, bgRadius, 0);
  ctx.closePath();
  ctx.fill();

  // ── 2. Tan scalloped shape — superellipse base + sinusoidal bumps ────────
  //  Superellipse gives a rounded-square silhouette;
  //  the cosine term adds evenly-spaced bumps all the way around.
  const halfSize    = 148 * s;   // controls overall shape size
  const squareness  = 5;         // n in superellipse: 4-6 = nicely rounded square
  const numScallops = 20;        // bumps around the perimeter
  const bumpAmp     = 14 * s;    // how tall each bump is
  const STEPS       = 1440;      // path resolution (smooth)

  ctx.fillStyle = '#F5F0E8';
  ctx.beginPath();

  for (let i = 0; i <= STEPS; i++) {
    const theta = (i / STEPS) * Math.PI * 2;

    // Superellipse radius at this angle — gives the rounded-square base
    const cosT = Math.abs(Math.cos(theta));
    const sinT = Math.abs(Math.sin(theta));
    const baseR = halfSize / Math.pow(
      Math.pow(cosT, squareness) + Math.pow(sinT, squareness),
      1 / squareness
    );

    // Add sinusoidal scallop bumps
    const r = baseR + bumpAmp * Math.cos(numScallops * theta);

    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.closePath();
  ctx.fill();

  // ── 3. Seedling emoji centered on the scallop ────────────────────────────
  const fontSize = Math.round(155 * s);
  ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🌱', cx, cy + 8 * s);

  return canvas;
}

const sizes = [192, 512];
sizes.forEach(size => {
  const canvas = drawIcon(size);
  const out = path.join(__dirname, `icon-${size}.png`);
  fs.writeFileSync(out, canvas.toBuffer('image/png'));
  console.log(`✓ icon-${size}.png (${size}×${size})`);
});
