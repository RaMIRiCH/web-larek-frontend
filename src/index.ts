/* eslint-disable @typescript-eslint/no-non-null-assertion */
import './scss/styles.scss';
import { Api } from './components/base/api';
import { CatalogView } from './views/CatalogView';
import { BasketView } from './views/BasketView';
import { OrderView } from './views/OrderView';
import { ContactsView } from './views/ContactsView';
import { BasketModel } from './models/Basket';
import { CatalogPresenter } from './presenters/catalogPresenter';
import { BasketPresenter } from './presenters/basketPresenter';
import { OrderPresenter } from './presenters/orderPresenter';
import { ContactsPresenter } from './presenters/contactsPresenter';
import { ProductModalView } from './views/ProductModalView';
import { ProductModalPresenter } from './presenters/ProductModalPresenter';
import { API_URL } from './utils/constants';
import { initModalCloseHandlers } from './views/Modal';

document.addEventListener('DOMContentLoaded', () => {
  initModalCloseHandlers();

  const api = new Api(API_URL);

  const catalogContainer = document.querySelector('.gallery')! as HTMLElement;
  const modalContainer = document.getElementById('modal-container')!;

  // 🛒 Корзина
  const basketModel = new BasketModel();
  const basketTemplate = document.querySelector('#basket')! as HTMLTemplateElement;
  const basketView = new BasketView(basketTemplate);
  const basketPresenter = new BasketPresenter(basketModel, basketView);

  // 📦 Каталог и карточки
  const catalogView = new CatalogView(catalogContainer);
  const cardPreviewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
  const productModalView = new ProductModalView(modalContainer, cardPreviewTemplate);
  const productModalPresenter = new ProductModalPresenter(productModalView, api, modalContainer, basketModel, basketPresenter);
  const catalogPresenter = new CatalogPresenter(catalogView, api, productModalPresenter);
  catalogPresenter.init();

  // 🧾 Оформление заказа
  const orderTemplate = document.getElementById('order')! as HTMLTemplateElement;
  const orderView = new OrderView(orderTemplate);

  // 📧 Шаг с контактами
  const contactsTemplate = document.getElementById('contacts')! as HTMLTemplateElement;
  const contactsView = new ContactsView(contactsTemplate);
  const contactsPresenter = new ContactsPresenter(contactsView);

  // 🎯 OrderPresenter получает обе вьюхи
  const orderPresenter = new OrderPresenter(orderView, contactsPresenter, basketModel, api);

  // 📦 Клик по иконке корзины
  document.querySelector('.header__basket')?.addEventListener('click', () => {
    basketPresenter.open();
  });

  // 🟢 Запуск оформления заказа
  document.addEventListener('order:start', () => {
    console.log('[DEBUG] order:start received');
    orderPresenter.startOrderProcess();
  });
});
