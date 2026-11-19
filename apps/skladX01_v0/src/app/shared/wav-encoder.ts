/** Целевой формат: Whisper.net на сервере принимает только WAV 16 кГц, моно, 16 бит. */
export const TARGET_SAMPLE_RATE = 16000;

/** Склеивает буферы, полученные из аудиопотока. */
export function mergeChunks(chunks: Float32Array[]): Float32Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Float32Array(total);
  let offset = 0;

  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }

  return merged;
}

/** Понижает частоту дискретизации линейной интерполяцией (48 кГц → 16 кГц и т. п.). */
export function downsample(
  samples: Float32Array,
  inputRate: number,
  targetRate = TARGET_SAMPLE_RATE,
): Float32Array {
  if (inputRate <= targetRate || samples.length === 0) {
    return samples;
  }

  const ratio = inputRate / targetRate;
  const length = Math.floor(samples.length / ratio);
  const result = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    const position = i * ratio;
    const left = Math.floor(position);
    const right = Math.min(left + 1, samples.length - 1);
    const weight = position - left;

    result[i] = samples[left] * (1 - weight) + samples[right] * weight;
  }

  return result;
}

/** Собирает WAV-контейнер: RIFF/WAVE, PCM, моно, 16 бит. */
export function encodeWav(
  samples: Float32Array,
  sampleRate = TARGET_SAMPLE_RATE,
  type = 'audio/wav',
): Blob {
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeAscii(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(view, 8, 'WAVE');
  writeAscii(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // размер блока fmt
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // моно
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true); // байт в секунду
  view.setUint16(32, bytesPerSample, true); // выравнивание блока
  view.setUint16(34, 16, true); // бит на сэмпл
  writeAscii(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;

  for (const sample of samples) {
    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(offset, Math.round(clamped * 32767), true);
    offset += bytesPerSample;
  }

  return new Blob([buffer], { type });
}

/** Готовит записанные буферы к отправке: склейка + даунсэмплинг + WAV. */
export function chunksToWav(
  chunks: Float32Array[],
  inputRate: number,
  targetRate = TARGET_SAMPLE_RATE,
): Blob {
  return encodeWav(downsample(mergeChunks(chunks), inputRate, targetRate), targetRate);
}

function writeAscii(view: DataView, offset: number, text: string): void {
  for (let i = 0; i < text.length; i++) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
}
