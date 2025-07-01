/* eslint-disable @typescript-eslint/no-non-null-assertion */
import './scss/styles.scss';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { PageView } from './views/PageView';
import { CatalogModel } from './models/CatalogModel';
import { CatalogView } from './views/CatalogView';
import { ProductCardView } from './views/ProductCardView';
import { BasketView } from './views/BasketView';
import { BasketItemView } from './views/BasketItemView';
import { OrderView } from './views/OrderView';
import { ContactsView } from './views/ContactsView';
import { BasketModel } from './models/Basket';
import { OrderModel } from './models/OrderModel';
import { Product } from './models/Product';
import { ProductModalView } from './views/ProductModalView';
import { SuccessView } from './views/SuccessView';
import { API_URL } from './utils/constants';
import { modalManager } from './components/ModalManager';
import { IProduct, ApiListResponse, IOrder } from './types';

const api = new Api(API_URL);
const eventEmitter = new EventEmitter();
const basketModel = new BasketModel();
const orderModel = new OrderModel();

const catalogContainer = document.querySelector('.gallery') as HTMLElement;
const productModalTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const catalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;

const catalogView = new CatalogView(catalogContainer);
const catalogModel = new CatalogModel(eventEmitter);
const basketView = new BasketView(basketTemplate, eventEmitter);
const successView = new SuccessView(successTemplate, eventEmitter);
const orderView = new OrderView(orderTemplate, eventEmitter);

new PageView(eventEmitter);

function updateBasketView(): void {
  const items = basketModel.getItems();
  const total = basketModel.getTotalPrice();

  basketView.updateTotal(total);
  basketView.renderCounter(items.length);
  basketView.setSubmitEnabled(basketModel.canOrder());

  if (items.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.textContent = 'Корзина пуста';
    emptyMessage.className = 'basket__item basket__empty-message';
    basketView.setItems([emptyMessage]);
    basketView.setSubmitEnabled(false);
    return;
  }

  const template = document.getElementById('card-basket') as HTMLTemplateElement;
  const views = items.map((item, index) => {
    const view = new BasketItemView(template, eventEmitter);
    view.updateContent(item, index);
    return view.render();
  });
  basketView.setItems(views);
}

api.get('/product/').then((res) => {
  const items = (res as ApiListResponse<IProduct>).items;
  catalogModel.setProducts(items);
});

eventEmitter.on('catalog:changed', (products: Product[]) => {
  const views = products.map(product => {
    const cardView = new ProductCardView(catalogTemplate, eventEmitter);
    cardView.updateContent(product);
    return cardView.render();
  });

  catalogView.setItems(views);
});

eventEmitter.on('product:open', (product: Product) => {
    const modalView = new ProductModalView(productModalTemplate, eventEmitter);
    modalView.updateContent(product);
    modalManager.setContent(modalView.render());
  });

eventEmitter.on('basket:add', (product: Product) => {
    basketModel.addItem(product);
    updateBasketView();
  });

eventEmitter.on('basket:open', () => {
  updateBasketView();
  modalManager.setContent(basketView.render());
});

eventEmitter.on('basket:remove', (event: { productId: string }) => {
  basketModel.removeItem(event.productId);
  updateBasketView();
});

eventEmitter.on('order:start', () => {
  modalManager.setContent(orderView.render());
});

eventEmitter.on('order:step1:validate', ({ errors }: { errors: string[] }) => {
  orderView.showErrors(errors);
  orderView.updateButtonState(errors.length === 0);
});

eventEmitter.on('order:step1:update', (data: { address: string; payment: string }) => {
  orderModel.setAddress(data.address);
  orderModel.setPayment(data.payment);

  const errors = orderModel.validateStep1();
  eventEmitter.emit('order:step1:validate', { errors });
});

eventEmitter.on('order:step1:submit', () => {
  const errors = orderModel.validateStep1();
  if (errors.length > 0) {
    eventEmitter.emit('order:step1:validate', { errors });
    return;
  }

  const contactsView = new ContactsView(contactsTemplate, eventEmitter);
  modalManager.setContent(contactsView.render());

  eventEmitter.on('order:step2:update', (data: { email: string; phone: string }) => {
    orderModel.setEmail(data.email);
    orderModel.setPhone(data.phone);

    const errors = orderModel.validateStep2();
    const canSubmit = errors.length === 0 && basketModel.canOrder();

    contactsView.showErrors(errors);
    contactsView.updateButtonState(canSubmit);
  });

  eventEmitter.on('order:step2:validate', ({ errors, canSubmit }: { errors: string[]; canSubmit: boolean }) => {
    contactsView.showErrors(errors);
    contactsView.updateButtonState(canSubmit);
  });
});

eventEmitter.on('order:submit', async () => {

  const payload: IOrder = {
    ...orderModel.getData(),
    items: basketModel.getItemIds(),
    total: basketModel.getTotalPrice()
  };

  try {
    await api.post('/order', payload, 'POST');
    basketModel.clear();
    updateBasketView();
    modalManager.setContent(successView.render(payload.total));
  } catch {
    alert('Ошибка при оформлении заказа');
  }
});

eventEmitter.on('modal:close', () => {
  modalManager.close();
});
