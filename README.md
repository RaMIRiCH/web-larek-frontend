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
│   └── base/           # Базовые абстракции (например, Api, Form)
├── models/             # Логика бизнес-данных (корзина, заказ и т.д.)
├── views/              # Классы отображения и шаблоны
├── types/              # Общие типы данных
├── utils/              # Утилиты и константы
├── scss/               # SCSS-стили
├── pages/              # HTML-шаблоны
└── index.ts            # Точка входа
```

- `src/models/` — модели данных (Basket, Product, OrderModel)
- `src/views/` — представления (отображение форм, карточек, корзины)
- `src/components/` — переиспользуемые утилиты (например, ModalManager)

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

Проект реализован по паттерну **Model-View-Presenter (MVP)**. На финальном этапе презентеры были удалены как отдельные сущности, а их логика перенесена в `index.ts` (в качестве точек связывания моделей и представлений).

### Основные принципы:
- **Model** — управляет данными и бизнес-логикой.
- **View** — отображает интерфейс и уведомляет о действиях через callbacks.
- **index.ts** — координирует работу приложения (раньше — обязанности презентеров).

---

## 🧱 Классы

### Модели (Model)

#### `Product`
- Описывает товар: `id`, `title`, `description`, `price`, `image`, `category`, `categoryModifier`

#### `BasketModel`
- Управляет товарами в корзине
- Методы: `addItem`, `removeItem`, `clear`, `getItems`, `getTotalPrice`, `canOrder`, `getItemIds`

#### `OrderModel`
- Содержит поля `address`, `payment`, `email`, `phone`
- Методы: `setAddress`, `setPayment`, `setEmail`, `setPhone`, `getData`, `validateStep1`, `validateStep2`

---

### Представления (View)

#### `CatalogView`
- Метод `renderItems(products, onClick)` — отрисовывает карточки товаров и добавляет обработчик клика

#### `ProductModalView`
- Метод `render(product)` — возвращает DOM-элемент карточки товара для модального окна
- Метод `setCallbacks({ onAddToBasket })`

#### `BasketView`
- Метод `render()` — возвращает DOM корзины
- `renderItems(items, canOrder)` — список товаров
- `updateTotal(sum)` — итоговая сумма
- `renderCounter(count)` — счётчик товаров в header
- `setCallbacks({ onRemoveItem, onSubmit })`

#### `OrderView`
- Отображает форму с адресом и выбором способа оплаты
- Методы: `render()`, `showErrors()`, `updateButtonState()`, события `onInputChange`, `onFormSubmit`

#### `ContactsView`
- Отображает форму с email и телефоном
- Методы: `render()`, `formData`, `showErrors()`, `updateButtonState()`
- События: `onInputChange`, `onFormSubmit`

#### `SuccessView`
- Показывает сообщение об успешном заказе
- Метод `render(total)` — возвращает DOM-элемент
- Автоматически добавляет обработчик на кнопку "За новыми покупками", которая закрывает модалку

---

## 📦 ModalManager

Компонент, управляющий отображением модалок. Метод `setContent(domNode)` вставляет содержимое в `.modal__content`, а `close()` скрывает модалку.

---

## 📢 Пользовательские события

- Клик по карточке товара → `CatalogView` вызывает callback → создаётся `ProductModalView`, отображается модалка.
- Клик "в корзину" → `ProductModalView` вызывает `onAddToBasket` → товар добавляется в `BasketModel` и обновляется `BasketView`
- Клик по иконке корзины → модалка с `BasketView`
- Удаление товара → `BasketView` вызывает `onRemoveItem`
- Оформление заказа:
  - `BasketView.onSubmit` → показ `OrderView`
  - `OrderView.onFormSubmit` → показ `ContactsView`
  - `ContactsView.onFormSubmit` → валидация, отправка заказа и отображение `SuccessView`

---

## 🔌 API

Класс `Api` (обёртка над fetch)
- `get<T>(url: string)` — GET-запрос
- `post<T>(url: string, body: unknown, method = 'POST')` — POST-запрос

---

## 📝 Примечания

- Представления используют шаблоны `<template>` в HTML
- Генерация DOM осуществляется вручную через `cloneNode` и наполнение полей
- Модальное окно одно (с одним `.modal__content`), в него вставляются все формы и карточки по очереди
