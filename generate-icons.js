const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx    = canvas.getContext('2d');
  const s  = size / 512;   // scale factor
  const cx = size / 2;
  const cy = size / 2;

  // ── 1. Sage green rounded-square background ──────────────────────────────
  const bgR = 100 * s;
  ctx.fillStyle = '#7D9B76';
  ctx.beginPath();
  ctx.moveTo(bgR, 0);
  ctx.lineTo(size - bgR, 0);
  ctx.quadraticCurveTo(size, 0,    size, bgR);
  ctx.lineTo(size, size - bgR);
  ctx.quadraticCurveTo(size, size, size - bgR, size);
  ctx.lineTo(bgR, size);
  ctx.quadraticCurveTo(0,    size, 0, size - bgR);
  ctx.lineTo(0, bgR);
  ctx.quadraticCurveTo(0,    0,    bgR, 0);
  ctx.closePath();
  ctx.fill();

  // ── 2. Tan scalloped shape (superellipse + sinusoidal bumps) ─────────────
  const halfSize   = 148 * s;
  const squareness = 5;
  const numScallops = 20;
  const bumpAmp    = 14 * s;
  const STEPS      = 1440;

  ctx.fillStyle = '#F5F0E8';
  ctx.beginPath();
  for (let i = 0; i <= STEPS; i++) {
    const theta = (i / STEPS) * Math.PI * 2;
    const cosT  = Math.abs(Math.cos(theta));
    const sinT  = Math.abs(Math.sin(theta));
    const baseR = halfSize / Math.pow(
      Math.pow(cosT, squareness) + Math.pow(sinT, squareness),
      1 / squareness
    );
    const r = baseR + bumpAmp * Math.cos(numScallops * theta);
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y);
    else         ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // ── 3. Drawn seedling illustration ───────────────────────────────────────
  const STEM_COLOR = '#2a5c28';
  const LEAF_COLOR = '#5a7a54';
  const VEIN_COLOR = '#2a5c28';

  // Stem — thin rounded rectangle from bottom up to leaf join
  const stemW      = 7   * s;
  const stemTop    = cy  - 58 * s;   // where leaves branch off
  const stemBottom = cy  + 70 * s;   // soil line

  ctx.fillStyle = STEM_COLOR;
  ctx.beginPath();
  ctx.moveTo(cx - stemW / 2, stemBottom);
  ctx.lineTo(cx - stemW / 2, stemTop + stemW);
  ctx.quadraticCurveTo(cx - stemW / 2, stemTop, cx, stemTop);
  ctx.quadraticCurveTo(cx + stemW / 2, stemTop, cx + stemW / 2, stemTop + stemW);
  ctx.lineTo(cx + stemW / 2, stemBottom);
  ctx.closePath();
  ctx.fill();

  // Helper: draw one leaf + mid-vein
  function drawLeaf(attachX, attachY, tipX, tipY, cp1ux, cp1uy, cp2ux, cp2uy, cp1lx, cp1ly, cp2lx, cp2ly) {
    // Leaf body
    ctx.fillStyle = LEAF_COLOR;
    ctx.beginPath();
    ctx.moveTo(attachX, attachY);
    ctx.bezierCurveTo(cp1ux, cp1uy, cp2ux, cp2uy, tipX, tipY);   // upper edge
    ctx.bezierCurveTo(cp1lx, cp1ly, cp2lx, cp2ly, attachX, attachY); // lower edge
    ctx.closePath();
    ctx.fill();

    // Mid-vein
    ctx.strokeStyle = VEIN_COLOR;
    ctx.lineWidth   = 1.8 * s;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(attachX, attachY);
    ctx.quadraticCurveTo(
      (attachX + tipX) / 2 + (tipY - attachY) * 0.15,
      (attachY + tipY) / 2 - (tipX - attachX) * 0.15,
      tipX, tipY
    );
    ctx.stroke();
  }

  // All coordinates at 512 px, scaled by s
  // Left leaf — attaches on left of stem, curves upper-left
  drawLeaf(
    cx - stemW / 2, cy - 18 * s,         // attach on stem
    cx - 82 * s,    cy - 68 * s,          // leaf tip
    cx - 38 * s,    cy - 52 * s,          // upper CP1
    cx - 78 * s,    cy - 88 * s,          // upper CP2
    cx - 72 * s,    cy - 42 * s,          // lower CP1
    cx - 20 * s,    cy -  2 * s           // lower CP2
  );

  // Right leaf — mirror of left leaf
  drawLeaf(
    cx + stemW / 2, cy - 18 * s,
    cx + 82 * s,    cy - 68 * s,
    cx + 38 * s,    cy - 52 * s,
    cx + 78 * s,    cy - 88 * s,
    cx + 72 * s,    cy - 42 * s,
    cx + 20 * s,    cy -  2 * s
  );

  return canvas;
}

const sizes = [192, 512];
sizes.forEach(size => {
  const canvas = drawIcon(size);
  const out = path.join(__dirname, `icon-${size}.png`);
  fs.writeFileSync(out, canvas.toBuffer('image/png'));
  console.log(`✓ icon-${size}.png (${size}×${size})`);
});
