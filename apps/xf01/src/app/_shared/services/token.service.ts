// Восстановлено 31.10.2026: файл отсутствовал в репозитории с самого начала
// (импорты libs/manage-page указывали сюда, а файлов не было). Минимальная
// реализация по фактическим использованиям (см. ManagerBarService, KatalogNService и пр.).
import { Injectable } from '@angular/core';
import { UserManagerService } from '@wsv2/account-service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private _userManager: UserManagerService) {}

  /** текущий JWT access-токен пользователя (или undefined, если не залогинен) */
  public get AccessToken(): string | undefined {
    return this._userManager.AccessToken();
  }
}
