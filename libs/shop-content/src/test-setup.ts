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

// Тесты выполняются вне APP_INITIALIZER приложения, поэтому у root-севиса
// EnvironmentService остаются пустые значения окружения (clientId и пр.),
// на которых ApiService (RouteApiAbstract) бросает исключение при чтении ClientId.
import { EnvironmentService } from '@wsv2/app-config';

const testEnvDefaults: Record<string, unknown> = {
  clientId: 'xf-01',
  clientUri: 'https://xl-01.ru/',
  serverUri: 'https://sb.x-01.ru/',
  serverAuthUri: 'https://sb.x-01.ru/',
  postavchikIds: ['xf-01'],
  vkId: '51431968',
};

for (const key of Object.keys(testEnvDefaults)) {
  Object.defineProperty(EnvironmentService.prototype, key, {
    get() {
      return testEnvDefaults[key];
    },
    // присвоения конструктора/initializer'а в тестах игнорируем
    set(value: unknown) {
      void value;
    },
    configurable: true,
  });
}
