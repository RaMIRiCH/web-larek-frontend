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

document.addEventListener('DOMContentLoaded', () => {
  const api = new Api(API_URL);

  const catalogContainer = document.querySelector('.gallery') as HTMLElement;
  const modalContainer = document.getElementById('modal-container')!;

  const catalogView = new CatalogView(catalogContainer);
  const productModalView = new ProductModalView(modalContainer);
  const productModalPresenter = new ProductModalPresenter(productModalView, api, modalContainer);

  const basketModel = new BasketModel();
  const basketRoot = document.createElement('div');
  const orderRoot = document.createElement('div');
  const orderTemplate = document.getElementById('order') as HTMLTemplateElement;

  const orderContent = orderTemplate.content.cloneNode(true) as DocumentFragment;
  orderRoot.appendChild(orderContent);
  const orderView = new OrderView(orderRoot);
  const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
  const basketView = new BasketView(basketTemplate);

  const basketPresenter = new BasketPresenter(basketModel, basketView, modalContainer);
  const orderPresenter = new OrderPresenter(orderView, basketModel);

  const catalogPresenter = new CatalogPresenter(catalogView, api, productModalPresenter);

  catalogPresenter.init();

  document.querySelector('.header__basket')?.addEventListener('click', () => {
    basketRoot.innerHTML = '';
    basketPresenter.open();
    modalContainer.innerHTML = '';
    modalContainer.appendChild(basketRoot);
    modalContainer.classList.add('modal_active');
  });

  document.addEventListener('order:start', () => {
    orderRoot.innerHTML = '';
    modalContainer.innerHTML = '';
    modalContainer.appendChild(orderRoot);
    modalContainer.classList.add('modal_active');
  });
});
