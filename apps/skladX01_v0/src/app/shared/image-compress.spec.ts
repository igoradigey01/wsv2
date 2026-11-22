import { compressImage } from './image-compress';

describe('compressImage', () => {
  it('возвращает исходный файл, если canvas/createImageBitmap недоступны', async () => {
    const file = new File([new Uint8Array([0xff, 0xd8, 0xff])], 'invoice.jpg', {
      type: 'image/jpeg',
    });

    const result = await compressImage(file);

    expect(result).toBe(file);
  });

  it('не трогает файлы, которые не являются изображениями', async () => {
    const file = new File(['abc'], 'doc.pdf', { type: 'application/pdf' });

    const result = await compressImage(file);

    expect(result).toBe(file);
  });
});
