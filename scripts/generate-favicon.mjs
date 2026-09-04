import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const YT = [255, 0, 0];
const SP = [29, 185, 84];
const WHITE = [255, 255, 255];

function crc32(buf) {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (~crc) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function pngFromRgba(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    rgba.copy(raw, row + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function roundedBoxCoverage(px, py, size, radius) {
  const cx = size / 2;
  const cy = size / 2;
  const hx = size / 2 - radius;
  const hy = size / 2 - radius;
  const dx = Math.abs(px - cx) - hx;
  const dy = Math.abs(py - cy) - hy;
  const ox = Math.max(dx, 0);
  const oy = Math.max(dy, 0);
  const dist = Math.min(Math.max(dx, dy), 0) + Math.hypot(ox, oy) - radius;
  return clamp01(0.5 - dist);
}

function triangleCoverage(px, py, ax, ay, bx, by, cx, cy) {
  const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
  const w0 = ((bx - px) * (cy - py) - (by - py) * (cx - px)) / area;
  const w1 = ((cx - px) * (ay - py) - (cy - py) * (ax - px)) / area;
  const w2 = ((ax - px) * (by - py) - (ay - py) * (bx - px)) / area;
  const min = Math.min(w0, w1, w2);
  const edgeDist = min * Math.hypot(bx - ax, by - ay);
  return clamp01(0.5 + edgeDist);
}

function render(size, { rounded, squareFill }) {
  const rgba = Buffer.alloc(size * size * 4);
  const radius = size * 0.25;
  const ax = size * 0.38;
  const ay = size * 0.28;
  const by = size * 0.72;
  const cx = size * 0.76;
  const cy = size * 0.5;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let cover = 1;
      if (rounded) {
        cover = roundedBoxCoverage(x + 0.5, y + 0.5, size, radius);
      } else if (!squareFill) {
        const r = size / 2 - 0.5;
        cover = clamp01(r - Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) + 0.5);
      }

      const leftCover = clamp01(size / 2 - (x + 0.5) + 0.5);
      const r = YT[0] * leftCover + SP[0] * (1 - leftCover);
      const g = YT[1] * leftCover + SP[1] * (1 - leftCover);
      const b = YT[2] * leftCover + SP[2] * (1 - leftCover);

      const tri = triangleCoverage(x + 0.5, y + 0.5, ax, ay, ax, by, cx, cy);
      const fr = r * (1 - tri) + WHITE[0] * tri;
      const fg = g * (1 - tri) + WHITE[1] * tri;
      const fb = b * (1 - tri) + WHITE[2] * tri;

      const i = (y * size + x) * 4;
      rgba[i] = Math.round(fr);
      rgba[i + 1] = Math.round(fg);
      rgba[i + 2] = Math.round(fb);
      rgba[i + 3] = Math.round(cover * 255);
    }
  }

  return pngFromRgba(size, size, rgba);
}

function icoFromPngs(pngs) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = [];
  let offset = 6 + 16 * count;
  for (const { size, png } of pngs) {
    const entry = Buffer.alloc(16);
    entry[0] = size === 256 ? 0 : size;
    entry[1] = size === 256 ? 0 : size;
    entry[2] = 0;
    entry[3] = 0;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += png.length;
  }

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.png)]);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const png16 = render(16, { rounded: true, squareFill: false });
const png32 = render(32, { rounded: true, squareFill: false });
const png180 = render(180, { rounded: false, squareFill: true });

writeFileSync(join(root, "src/app/favicon.ico"), icoFromPngs([
  { size: 16, png: png16 },
  { size: 32, png: png32 },
]));
writeFileSync(join(root, "src/app/apple-icon.png"), png180);

console.log("Wrote favicon.ico and apple-icon.png");
