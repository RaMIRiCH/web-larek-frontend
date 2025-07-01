# Проектная работа "Веб-ларек"

## Стек технологий
- HTML
- SCSS
- TypeScript
- Webpack

## 📁 Структура проекта

```
src/
├── components/         # Компоненты приложения
│   └── base/           # Базовые абстракции (например, Api, EventEmitter)
├── models/             # Логика бизнес-данных (корзина, заказ и т.д.)
├── views/              # Классы отображения и шаблоны
├── types/              # Общие типы данных
├── utils/              # Утилиты и константы
├── scss/               # SCSS-стили
├── pages/              # HTML-шаблоны
└── index.ts            # Точка входа (главный связывающий слой MVP)
```

- `src/models/` — модели данных (BasketModel, Product, OrderModel)
- `src/views/` — представления (формы, карточки, корзина и т.д.)
- `src/components/` — утилиты и вспомогательные механизмы (например, ModalManager, Api)

## ⚙️ Установка и запуск

```bash
npm install
npm run start
```

## 🚀 Сборка проекта

```bash
npm run build
```

---

## 🧠 Архитектура (паттерн MVP)

Проект реализован по архитектурному паттерну **Model-View-Presenter (MVP)**. Презентеры не выделены в отдельные сущности — вместо этого логика связывания `Model` и `View` реализована в `index.ts`.

### Основные принципы:
- **Model** — управляет данными и бизнес-логикой, не зависит от интерфейса.
- **View** — отображает интерфейс, уведомляет презентера (index.ts) о действиях пользователя через `callback`-методы.
- **index.ts** — выступает в роли презентера: реагирует на события от View, обновляет Model, производит валидацию, принимает решение, что и когда отображать.

📛 Важно: в слое Presenter (index.ts) не используются прямые операции с DOM:
- не используется `querySelector`, `addEventListener`, `innerText`, `disabled` и т.д.;
- весь DOM-код находится внутри классов View.

---

## 🧱 Классы

### Модели (Model)

#### `Product`
- Представляет товар: `id`, `title`, `description`, `price`, `image`, `category`, `categoryModifier`

#### `BasketModel`
- Управляет товарами в корзине
- Методы: `addItem`, `removeItem`, `clear`, `getItems`, `getItemIds`, `getTotalPrice`, `canOrder`

#### `OrderModel`
- Хранит данные формы заказа: `address`, `payment`, `email`, `phone`
- Методы: `setAddress`, `setPayment`, `setEmail`, `setPhone`, `getData`
- Методы валидации: `validateStep1()`, `validateStep2()`

---

### Представления (View)

#### `CatalogView`
- Метод `setItems(nodes: HTMLElement[])` — вставляет карточки товаров

#### `ProductCardView`
- Рендерит карточку товара в каталоге
- Устанавливает событие по клику для открытия модального окна

#### `ProductModalView`
- Метод `render(product)` — возвращает DOM-элемент карточки товара для модального окна
- Метод `updateContent(product)` — обновляет содержимое
- Метод `setCallbacks({ onAddToBasket })`

#### `BasketView`
- Метод `render()` — возвращает DOM корзины
- Методы: `setItems(items: HTMLElement[])`, `updateTotal(sum: number)`, `renderCounter(count: number)`, `setSubmitEnabled(isEnabled: boolean)`
- Обработка событий: удаление товаров, оформление заказа

#### `BasketItemView`
- Представление одной позиции в корзине
- Метод `updateContent(product, index)` — обновляет данные
- Метод `render()` — возвращает DOM-элемент

#### `OrderView`
- Отображает форму с адресом и выбором способа оплаты
- Методы: `render()`, `showErrors(errors)`, `updateButtonState(enabled)`
- Колбэки: `onInputChange(data)`, `onFormSubmit(data)`
- Вся валидация и обновление модели происходят **до** сабмита, что гарантирует корректность данных

#### `ContactsView`
- Отображает форму с email и телефоном
- Методы: `render()`, `formData`, `showErrors(errors)`, `updateButtonState(enabled)`
- Колбэки: `onInputChange()`, `onFormSubmit()`
- Данные сохраняются и валидируются **только при вводе**, не при отправке

#### `SuccessView`
- Показывает сообщение об успешном заказе
- Метод `render(total)` — вставляет сумму и возвращает DOM-элемент
- Обработчик на кнопку "За новыми покупками!" вызывает `modal:close`

---

## 📦 ModalManager

Компонент, управляющий отображением модальных окон:
- `setContent(node: HTMLElement)` — вставляет содержимое в `.modal__content`
- `close()` — закрывает модалку, очищает содержимое

---

## 📢 Пользовательские события

- Клик по карточке товара → `ProductModalView`
- Клик "в корзину" → добавление в `BasketModel`, обновление `BasketView`
- Клик по иконке корзины → открытие модального окна с `BasketView`
- Удаление товара из корзины → `BasketModel` и перерендер
- Оформление заказа:
  - `BasketView` вызывает `onSubmit` → отображается `OrderView`
  - `OrderView.onFormSubmit` → отображается `ContactsView`
  - `ContactsView.onFormSubmit` → данные уже валидны, создаётся заказ
  - `SuccessView.render(total)` показывает успешную модалку

---

## 🔌 API

Класс `Api` — обёртка над `fetch`
- `get<T>(url: string): Promise<T>` — GET-запрос
- `post<T>(url: string, body: unknown, method = 'POST')` — POST-запрос с телом

---

## 📝 Примечания

- Все формы и карточки рендерятся вручную через `cloneNode` из HTML `<template>`
- Используется только один модальный контейнер (`.modal__content`) для всех окон
- Вся бизнес-логика полностью сосредоточена в `Model`
- Все DOM-события делегированы `View`
- Все связи и валидация происходят централизованно в `index.ts` (в духе MVP)
