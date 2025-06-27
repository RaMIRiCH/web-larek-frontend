/* eslint-disable @typescript-eslint/no-non-null-assertion */
import './scss/styles.scss';
import { Api } from './components/base/api';
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
const basketModel = new BasketModel();
const orderModel = new OrderModel();

const catalogContainer = document.querySelector('.gallery')! as HTMLElement;
const modalContainer = document.getElementById('modal-container')!;
const modalContent = modalContainer.querySelector('.modal__content')!;

// Корзина
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketView = new BasketView(basketTemplate);
basketView.setCallbacks({
  onRemoveItem: (productId) => {
    basketModel.removeItem(productId);
    updateBasketView();
  },
  onSubmit: () => {
    const event = new CustomEvent('order:start');
    document.dispatchEvent(event);
  }
});

function updateBasketView() {
  const items = basketModel.getItems();
  const total = basketModel.getTotalPrice();
  basketView.render();
  basketView.updateTotal(total);
  basketView.renderCounter(items.length);

  if (items.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.textContent = 'Корзина пуста';
    emptyMessage.className = 'basket__item basket__empty-message';
    basketView.setItems([emptyMessage]);
    basketView.setSubmitEnabled(false);
  } else {
    const itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
    const views = items.map((product, index) => {
      const itemView = new BasketItemView(itemTemplate);
      itemView.setCallbacks({
        onRemove: (id) => {
          basketModel.removeItem(id);
          updateBasketView();
        }
      });
      return itemView.render(product, index);
    });
    basketView.setItems(views);
    basketView.setSubmitEnabled(true);
  }
}

// Каталог
const catalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const catalogView = new CatalogView(catalogContainer);

api.get('/product/').then((res) => {
  const products = (res as ApiListResponse<IProduct>).items.map(p => new Product(
    p.id,
    p.title,
    p.description ?? '',
    p.image,
    p.category,
    p.price ?? null
  ));

  const cardViews = products.map(product => {
    const cardView = new ProductCardView(catalogTemplate);
    cardView.setCallbacks({
      onClick: () => {
        const productModalTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
        const productModalView = new ProductModalView(productModalTemplate);

        productModalView.setCallbacks({
          onAddToBasket: () => {
            basketModel.addItem(product);
            updateBasketView();
            modalManager.close();
          }
        });

        modalManager.setContent(productModalView.render(product));
      }
    });

    return cardView.render(product);
  });

  catalogView.setItems(cardViews);
});

// Формы заказов
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const orderView = new OrderView(orderTemplate);
orderView.onInputChange = (data) => {
  orderModel.setAddress(data.address);
  orderModel.setPayment(data.payment);
  const errors = orderModel.validateStep1();
  orderView.showErrors(errors);
  orderView.updateButtonState(errors.length === 0);
};
orderView.onFormSubmit = (data) => {
  orderModel.setAddress(data.address);
  orderModel.setPayment(data.payment);
  const errors = orderModel.validateStep1();
  if (errors.length > 0) {
    orderView.showErrors(errors);
    return;
  }

  const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
  const contactsView = new ContactsView(contactsTemplate);
  contactsView.setCallbacks({
  onInputChange: () => {
    orderModel.setEmail(contactsView.formData.email);
    orderModel.setPhone(contactsView.formData.phone);
    const errors = orderModel.validateStep2();
    contactsView.showErrors(errors);
    contactsView.updateButtonState(errors.length === 0 && basketModel.canOrder());
  },
  onFormSubmit: async (formData) => {
    orderModel.setEmail(formData.email);
    orderModel.setPhone(formData.phone);
    const errors = orderModel.validateStep2();
    if (errors.length > 0) {
      contactsView.showErrors(errors);
      return;
    }

    const payload: IOrder = {
      ...orderModel.getData(),
      items: basketModel.getItemIds(),
      total: basketModel.getTotalPrice()
    };

    try {
      await api.post('/order', payload, 'POST');
      basketModel.clear();
      updateBasketView();

      const successTemplate = document.getElementById('success') as HTMLTemplateElement;
      const successView = new SuccessView(successTemplate);
      modalManager.setContent(successView.render(payload.total));
    } catch (err) {
      alert('Ошибка при оформлении заказа. Попробуйте позже.');
    }
  }
});

  modalManager.setContent(contactsView.render());
};

// Старт ордера
document.querySelector('.header__basket')?.addEventListener('click', () => {
  updateBasketView();
  modalManager.setContent(basketView.render());
});

document.addEventListener('order:start', () => {
  modalManager.setContent(orderView.render());
});

document.addEventListener('modal:close', () => {
  modalManager.close();
});
