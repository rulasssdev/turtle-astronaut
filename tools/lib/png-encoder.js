import { deflateSync } from 'node:zlib';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const BIT_DEPTH = 8;
const COLOR_TYPE_RGBA = 6;
const FILTER_NONE = 0;

const CRC_TABLE = Array.from({ length: 256 }, (_, byteValue) => {
  let crc = byteValue;
  for (let bit = 0; bit < 8; bit += 1) {
    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  return crc >>> 0;
});

function calculateCrc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const length = Buffer.alloc(4);
  const checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE(calculateCrc32(typeAndData));
  return Buffer.concat([length, typeAndData, checksum]);
}

export function encodePng(width, height, rgbaPixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = BIT_DEPTH;
  header[9] = COLOR_TYPE_RGBA;

  // Each scanline starts with a filter byte.
  const rowLength = width * 4;
  const scanlines = Buffer.alloc((rowLength + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const scanlineStart = y * (rowLength + 1);
    scanlines[scanlineStart] = FILTER_NONE;
    rgbaPixels.copy(scanlines, scanlineStart + 1, y * rowLength, (y + 1) * rowLength);
  }

  return Buffer.concat([
    PNG_SIGNATURE,
    createChunk('IHDR', header),
    createChunk('IDAT', deflateSync(scanlines)),
    createChunk('IEND', Buffer.alloc(0)),
  ]);
}
