# Веб-ларек

**Стек:** TypeScript, HTML, SCSS, Webpack  
**Архитектура:** MVP (Model–View–Presenter)

## 📁 Структура проекта

```
src/
├── components/         # Компоненты приложения
│   └── base/           # Базовые абстракции (например, Api, Form)
├── models/             # Логика бизнес-данных (корзина и т.д.)
├── presenters/         # Презентеры, связывающие модель и представление
├── views/              # Классы отображения и шаблоны
├── types/              # Общие типы данных
├── utils/              # Утилиты и константы
├── scss/               # SCSS-стили
├── pages/              # HTML-шаблоны
└── index.ts            # Точка входа
```

## ⚙️ Установка и запуск

Установите зависимости и запустите локальный сервер:

```bash
npm install
npm run start
```

Или с использованием Yarn:

```bash
yarn
yarn start
```

## 🚀 Сборка проекта

Для сборки в `dist/`:

```bash
npm run build
```

Или:

```bash
yarn build
```

## 🧠 Архитектура

Проект реализован по принципам архитектуры **MVP**:

- **Model** — хранит и управляет данными (например, корзина);
- **View** — отвечает за отображение UI (рендер, обновление DOM);
- **Presenter** — обрабатывает действия пользователя, связывает Model и View.

Каждая форма, список или модальное окно имеет свою View и Presenter.

## 📦 Основные модули

- `BasketModel` — хранит товары, подсчитывает итог.
- `BasketView` / `BasketPresenter` — интерфейс корзины.
- `CatalogView` / `CatalogPresenter` — отображение списка товаров.
- `ProductModalPresenter` — модалка с карточкой товара.
- `OrderView` / `ContactsView` — формы оформления заказа.
- `OrderPresenter` — обработка заказа, отправка данных на сервер.
- `SuccessView` — отображает сообщение об успешной покупке.

## 📡 Работа с API

Проект использует простой API через `Api` (расширяет базовый HTTP-клиент).

```ts
api.get('/products'); // загрузка каталога
api.post('/order', orderData); // оформление заказа
```

## 🧾 Типы данных

Типы описаны в `src/types/index.ts`. Основные:

```ts
export interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number;
}

export interface IOrderForm {
  address?: string;
  payment?: string;
  email?: string;
  phone?: string;
}
```

## 📌 Особенности

- Реализована двухшаговая форма заказа: сначала выбор оплаты и адреса, затем email и телефон.
- Сумма списанных синапсов отображается в финальной модалке.
- После оформления заказа счётчик корзины сбрасывается.
- Код разделён по ролям (View, Model, Presenter) для удобства расширения.