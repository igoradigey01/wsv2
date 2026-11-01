import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// Тесты выполняются вне APP_INITIALIZER приложения, поэтому у root-севиса
// EnvironmentService остаются пустые значения окружения (clientId/vkId и пр.),
// на которых ApiService (RouteApiAbstract) бросает исключения (ClientId/VkId).
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
