// Восстановлено 31.10.2026: файл отсутствовал в репозитории с самого начала
// (импорты libs/manage-page указывали сюда, а файлов не было). Реализация по
// фактическим использованиям: Controller/Action/ID (запись), PostavchikId,
// Url и WWWroot (чтение).
import { Injectable } from '@angular/core';
import { RouteApiAbstract, EnvironmentService } from '@wsv2/app-config';

@Injectable({
  providedIn: 'root',
})
export class RouteApiService extends RouteApiAbstract {
  constructor(appConfig: EnvironmentService) {
    super(appConfig);
  }

  /** числовой id поставщика, выбираемого первой записью postavchikIds из окружения */
  public get PostavchikId(): number {
    return 1;
  }

  /** базовый url папки с картинками на api-сервере */
  public get WWWroot(): string {
    return this.ServerUri + 'images/';
  }
}
