import {
  TARGET_SAMPLE_RATE,
  chunksToWav,
  downsample,
  encodeWav,
  mergeChunks,
} from './wav-encoder';

/** jsdom-овский Blob не умеет arrayBuffer() — читаем через FileReader. */
function readBlob(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

function ascii(view: DataView, offset: number, length: number): string {
  let text = '';

  for (let i = 0; i < length; i++) {
    text += String.fromCharCode(view.getUint8(offset + i));
  }

  return text;
}

describe('wav-encoder', () => {
  it('собирает RIFF/WAVE, PCM, моно, 16 кГц, 16 бит', async () => {
    const samples = new Float32Array([0, 0.5, -0.5]);
    const blob = encodeWav(samples);
    const buffer = await readBlob(blob);
    const view = new DataView(buffer);

    expect(blob.type).toBe('audio/wav');
    expect(buffer.byteLength).toBe(44 + samples.length * 2);

    expect(ascii(view, 0, 4)).toBe('RIFF');
    expect(ascii(view, 8, 4)).toBe('WAVE');
    expect(ascii(view, 12, 4)).toBe('fmt ');
    expect(view.getUint16(20, true)).toBe(1); // PCM
    expect(view.getUint16(22, true)).toBe(1); // моно
    expect(view.getUint32(24, true)).toBe(TARGET_SAMPLE_RATE);
    expect(view.getUint16(34, true)).toBe(16);

    expect(ascii(view, 36, 4)).toBe('data');
    expect(view.getUint32(40, true)).toBe(samples.length * 2);
    expect(view.getInt16(44, true)).toBe(0);
    expect(view.getInt16(46, true)).toBe(Math.round(0.5 * 32767));
  });

  it('понижает 48 кГц до 16 кГц', () => {
    const input = new Float32Array(4800);
    const result = downsample(input, 48000);

    expect(result.length).toBe(1600);
  });

  it('не трогает поток с частотой ниже целевой', () => {
    const input = new Float32Array([0.1, 0.2]);

    expect(downsample(input, 8000)).toBe(input);
  });

  it('склеивает буферы записи по порядку', () => {
    const merged = mergeChunks([
      new Float32Array([1, 2]),
      new Float32Array([3]),
      new Float32Array([4, 5]),
    ]);

    expect(Array.from(merged)).toEqual([1, 2, 3, 4, 5]);
  });

  it('chunksToWav отдаёт WAV с частотой 16 кГц', async () => {
    const chunks = [new Float32Array(48000).fill(0.1)];
    const blob = chunksToWav(chunks, 48000);
    const view = new DataView(await readBlob(blob));

    expect(view.getUint32(24, true)).toBe(TARGET_SAMPLE_RATE);
    expect(view.getUint16(22, true)).toBe(1);
    // 1 секунда при 48 кГц после даунсэмплинга — 16 000 сэмплов по 2 байта.
    expect(view.getUint32(40, true)).toBe(32000);
  });
});
