import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// jsdom не реализует CSS API и URL.createObjectURL/revokeObjectURL,
// используемые кодом компонентов (Angular CDK-стилизация, blob-объекты).
if (typeof window.CSS === 'undefined') {
  const cssEscape = (s: string) => s;
  (window as unknown as { CSS: Record<string, unknown> }).CSS = {
    escape: cssEscape,
    supports: () => true,
  };
}

if (typeof URL.createObjectURL !== 'function') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (URL as any).createObjectURL = () => 'blob:jest-mock';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (URL as any).revokeObjectURL = () => undefined;
}
