# Задача: Создать Angular-компонент для формы «Клиент» (Frontend)

## ⚠️ ВАЖНЫЙ КОНТЕКСТ: Проект в процессе миграции
Монорепозиторий `wsv3` находится в стадии активной миграции с Angular (старая архитектура) на NX (новая архитектура). 
- В проекте уже есть **старые** приложения и библиотеки (например, `presentation01`, `shop-opt`). 
- Есть **незакрытые задачи по линту** в старых проектах (ошибки `wsv2`, пустые функции).
- **ЗАПРЕЩЕНО** исправлять ошибки линта в старых проектах в рамках этой задачи. 
- **ЗАПРЕЩЕНО** переименовывать старые селекторы или менять конфиги ESLint для старых проектов.
- Мы создаем **новое, изолированное приложение** `skladx01`, которое не должно зависеть от старого кода.

## Контекст задачи
- Монорепозиторий: `wsv3`.
- Новое приложение: `skladx01` (создано внутри `apps/skladx01`).
- Стек: Angular 17+, Signals (или RxJS), `HttpClient`.
- Бэкенд: API доступно по адресу `http://localhost:5000/api/clients` (эндпоинты из задачи 09).

## Цель
Создать страницу для просмотра клиентов и связанных с ними данных внутри **нового** приложения `skladx01`.

## Требования

### 1. Интерфейсы (Models)
Создай интерфейсы в папке `apps/skladx01/src/app/models/`:
- `Client`: id, alias, fullName, phone, city.
- `Mark`: id, number, debt.
- `Product`: id, number, date, sum, markId.
- `Payment`: id, date, sum.

### 2. Сервисы (Data Access)
Создай `ClientService` в `apps/skladx01/src/app/services/`:
- `getClients(filters?: {phone?: string, alias?: string, city?: string}): Observable<Client[]>`
- `getClient(id: number): Observable<Client>`
- `getMarks(clientId: number): Observable<Mark[]>`
- `getProducts(markId: number): Observable<Product[]>`
- `getPayments(markId: number): Observable<Payment[]>`

### 3. Компонент (UI)
Создай компонент `ClientPageComponent` в `apps/skladx01/src/app/pages/client/`.
- **Секция «Клиенты»**: Поля фильтров (Телефон, Псевдоним, Город) и таблица.
- **Секция «Метка Расчет»**: Таблица, которая загружается при выборе клиента.
- **Секции «Отпущенный Товар» и «Принятые Деньги»**: Таблицы, которые загружаются при выборе метки.

### 4. Маршрутизация
Добавь маршрут `'/clients'` в `apps/skladx01/src/app/app.routes.ts`, ведущий на `ClientPageComponent`.

## Ограничения
- ❌ **Не трогать старые проекты** (исправление линта, рефакторинг).
- ❌ Не менять глобальные конфиги NX, если это не требуется для `skladx01`.
- ✅ Использовать современные практики Angular (standalone components).
- ✅ Обрабатывать состояния загрузки (loading) и ошибок (error).
- ✅ Весь новый код должен быть изолирован в `apps/skladx01`.

## Проверка
- Запустить `npx nx serve skladx01`.
- Открыть браузер, перейти на `/clients`.