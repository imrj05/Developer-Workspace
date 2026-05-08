#!/usr/bin/env node
/**
 * Generates PNG icon files for the extension at 16, 32, 48, 128, and 512 px.
 * The icon is a dark workspace tile with a terminal prompt and status dots — no external deps,
 * only Node built-ins (zlib, fs, path).
 */

import zlib from 'zlib'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'icons')

// ── PNG helpers ────────────────────────────────────────────────────────────
function crc32(buf) {
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
      let c = i
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
      t[i] = c
    }
    return t
  })())
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const crcInput = Buffer.concat([typeBytes, data])
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(crcInput), 0)
  return Buffer.concat([len, typeBytes, data, crcBuf])
}

function encodePNG(width, height, pixels /* Uint8Array RGBA flat */) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8   // bit depth
  ihdrData[9] = 2   // color type: RGB  (we'll use RGBA → type 6)
  ihdrData[9] = 6   // RGBA
  ihdrData[10] = 0  // compression
  ihdrData[11] = 0  // filter
  ihdrData[12] = 0  // interlace
  const ihdr = chunk('IHDR', ihdrData)

  // Raw image data: filter byte (0) + RGBA per row
  const rowSize = width * 4
  const raw = Buffer.alloc((1 + rowSize) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (rowSize + 1)] = 0 // filter type None
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 4
      const dst = y * (rowSize + 1) + 1 + x * 4
      raw[dst]     = pixels[src]
      raw[dst + 1] = pixels[src + 1]
      raw[dst + 2] = pixels[src + 2]
      raw[dst + 3] = pixels[src + 3]
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 })
  const idat = chunk('IDAT', compressed)
  const iend = chunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdr, idat, iend])
}

// ── Drawing primitives ─────────────────────────────────────────────────────
function createCanvas(w, h) {
  const pixels = new Uint8Array(w * h * 4) // all transparent
  const set = (x, y, r, g, b, a) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return
    const i = (y * w + x) * 4
    // simple alpha blending over existing
    const srcA = a / 255
    const dstA = pixels[i + 3] / 255
    const outA = srcA + dstA * (1 - srcA)
    if (outA === 0) return
    pixels[i]     = Math.round((r * srcA + pixels[i]     * dstA * (1 - srcA)) / outA)
    pixels[i + 1] = Math.round((g * srcA + pixels[i + 1] * dstA * (1 - srcA)) / outA)
    pixels[i + 2] = Math.round((b * srcA + pixels[i + 2] * dstA * (1 - srcA)) / outA)
    pixels[i + 3] = Math.round(outA * 255)
  }
  return { w, h, pixels, set }
}

/** Anti-aliased filled circle */
function fillCircleAA(ctx, cx, cy, r, R, G, B, A) {
  const { set } = ctx
  const r2 = r * r
  for (let y = Math.floor(cy - r) - 1; y <= Math.ceil(cy + r) + 1; y++) {
    for (let x = Math.floor(cx - r) - 1; x <= Math.ceil(cx + r) + 1; x++) {
      const dx = x - cx, dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const alpha = Math.max(0, Math.min(1, r - dist + 0.5))
      if (alpha > 0) set(x, y, R, G, B, Math.round(A * alpha))
    }
  }
}

/** Filled rectangle with AA at corners */
function fillRect(ctx, x, y, w, h, R, G, B, A) {
  for (let py = y; py < y + h; py++)
    for (let px = x; px < x + w; px++)
      ctx.set(px, py, R, G, B, A)
}

/** Rounded rectangle (filled, AA) */
function fillRoundRect(ctx, x, y, w, h, r, R, G, B, A) {
  // fill body minus corners
  fillRect(ctx, x + r, y, w - 2 * r, h, R, G, B, A)
  fillRect(ctx, x, y + r, r, h - 2 * r, R, G, B, A)
  fillRect(ctx, x + w - r, y + r, r, h - 2 * r, R, G, B, A)
  // four corner arcs
  const corners = [
    [x + r,     y + r],
    [x + w - r, y + r],
    [x + r,     y + h - r],
    [x + w - r, y + h - r],
  ]
  for (const [cx, cy] of corners) {
    // only paint the quadrant
    for (let py = cy - r - 1; py <= cy + r + 1; py++) {
      for (let px = cx - r - 1; px <= cx + r + 1; px++) {
        if (px < x || px >= x + w || py < y || py >= y + h) continue
        const dx = px - cx, dy = py - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const alpha = Math.max(0, Math.min(1, r - dist + 0.5))
        if (alpha > 0) ctx.set(px, py, R, G, B, Math.round(A * alpha))
      }
    }
  }
}

// ── Developer Workspace icon renderer ───────────────────────────────────────
function drawWorkspaceIcon(ctx, size) {
  const S = size
  const BG = [12, 17, 29, 255]
  const PANEL = [22, 31, 49, 255]
  const ACCENT = [56, 189, 248, 255]
  const ACCENT_2 = [168, 85, 247, 255]
  const FG = [248, 250, 252, 255]
  const MUTED = [148, 163, 184, 255]

  const radius = Math.round(S * 0.18)
  fillRoundRect(ctx, 0, 0, S, S, radius, ...BG)

  const pad = Math.round(S * 0.15)
  fillRoundRect(ctx, pad, pad, S - pad * 2, S - pad * 2, Math.round(S * 0.08), ...PANEL)

  const barH = Math.max(1, Math.round(S * 0.035))
  fillRect(ctx, pad, Math.round(S * 0.31), S - pad * 2, barH, ...MUTED)

  fillCircleAA(ctx, Math.round(S * 0.27), Math.round(S * 0.23), Math.max(1, S * 0.025), ...ACCENT)
  fillCircleAA(ctx, Math.round(S * 0.35), Math.round(S * 0.23), Math.max(1, S * 0.025), ...ACCENT_2)
  fillCircleAA(ctx, Math.round(S * 0.43), Math.round(S * 0.23), Math.max(1, S * 0.025), ...MUTED)

  const stroke = Math.max(2, Math.round(S * 0.07))
  const x1 = Math.round(S * 0.29)
  const y1 = Math.round(S * 0.48)
  const x2 = Math.round(S * 0.43)
  const y3 = Math.round(S * 0.68)

  fillRect(ctx, x1, y1, stroke, stroke, ...FG)
  fillRect(ctx, x1 + stroke, y1 + stroke, stroke, stroke, ...FG)
  fillRect(ctx, x1, y3, stroke, stroke, ...FG)
  fillRect(ctx, x1 + stroke, y3 - stroke, stroke, stroke, ...FG)

  fillRect(ctx, x2 + Math.round(S * 0.08), y3, Math.round(S * 0.22), stroke, ...ACCENT)
}

// ── Main ───────────────────────────────────────────────────────────────────
const SIZES = [16, 32, 48, 128, 512]

fs.mkdirSync(OUT_DIR, { recursive: true })

for (const size of SIZES) {
  const ctx = createCanvas(size, size)
  drawWorkspaceIcon(ctx, size)
  const png = encodePNG(size, size, ctx.pixels)
  const outPath = path.join(OUT_DIR, `icon${size}.png`)
  fs.writeFileSync(outPath, png)
  console.log(`✓ ${outPath}  (${png.length} bytes)`)
}

console.log('\nAll icons generated.')
