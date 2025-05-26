/* eslint-disable @typescript-eslint/no-non-null-assertion */
import './scss/styles.scss';
import { Api } from './components/base/api';
import { CatalogView } from './views/CatalogView';
import { BasketView } from './views/BasketView';
import { OrderView } from './views/OrderView';
import { BasketModel } from './models/Basket';
import { CatalogPresenter } from './presenters/catalogPresenter';
import { BasketPresenter } from './presenters/basketPresenter';
import { OrderPresenter } from './presenters/orderPresenter';
import { ProductModalView } from './views/ProductModalView';
import { ProductModalPresenter } from './presenters/ProductModalPresenter';
import { API_URL } from './utils/constants';
import { initModalCloseHandlers } from './views/Modal';

document.addEventListener('DOMContentLoaded', () => {
  initModalCloseHandlers();

  const api = new Api(API_URL);

  const catalogContainer = document.querySelector('.gallery')! as HTMLElement;
  const modalContainer = document.getElementById('modal-container')!;

  const basketModel = new BasketModel();
   const basketTemplate = document.querySelector('#basket')! as HTMLTemplateElement;
  const basketView = new BasketView(basketTemplate);
  const basketPresenter = new BasketPresenter(basketModel, basketView);
  const catalogView = new CatalogView(catalogContainer);
  const productModalView = new ProductModalView(modalContainer);
  const productModalPresenter = new ProductModalPresenter(productModalView, api, modalContainer, basketModel, basketPresenter);
  const orderTemplate = document.getElementById('order')! as HTMLTemplateElement;
  const orderView = new OrderView(orderTemplate);
  const orderPresenter = new OrderPresenter(orderView, basketModel, api);

  const catalogPresenter = new CatalogPresenter(catalogView, api, productModalPresenter);
  catalogPresenter.init();

  document.querySelector('.header__basket')?.addEventListener('click', () => {
    basketPresenter.open();
  });

  document.addEventListener('order:start', () => {
    console.log('[DEBUG] order:start received');
    orderPresenter.startOrderProcess();
  });
});