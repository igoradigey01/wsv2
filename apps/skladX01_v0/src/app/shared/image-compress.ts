/**
 * Уменьшает фото накладной на клиенте перед отправкой: длинная сторона ≤ maxSide,
 * перекодирование в JPEG. Всё best-effort: при ошибке или отсутствии API (SSR, jsdom)
 * возвращается исходный файл.
 */
export async function compressImage(
  file: File,
  maxSide = 1500,
  quality = 0.85,
): Promise<File> {
  if (!file.type.startsWith('image/') || typeof document === 'undefined') {
    return file;
  }

  if (typeof createImageBitmap !== 'function') {
    return file;
  }

  let bitmap: ImageBitmap;

  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    const longest = Math.max(bitmap.width, bitmap.height);

    if (longest <= maxSide) {
      return file;
    }

    const scale = maxSide / longest;
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    if (!context) {
      return file;
    }

    context.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });

    if (!blob) {
      return file;
    }

    return new File([blob], jpegName(file.name), {
      type: 'image/jpeg',
      lastModified: file.lastModified,
    });
  } finally {
    bitmap.close();
  }
}

function jpegName(name: string): string {
  const base = name.replace(/\.[^.]+$/, '');

  return `${base || 'invoice'}.jpg`;
}
