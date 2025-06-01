/* eslint-disable @typescript-eslint/no-inferrable-types */
import { OrderView } from '../views/OrderView';
import { ContactsPresenter } from './contactsPresenter';
import { BasketModel } from '../models/Basket';
import { Api } from '../components/base/api';
import { IOrderForm } from '../types';
import type { BasketPresenter } from './basketPresenter';
import { SuccessView } from '../views/SuccessView';

export class OrderPresenter {
  private address: string = '';
  private payment: string = '';

  constructor(
    private orderView: OrderView,
    private contactsPresenter: ContactsPresenter,
    private basketModel: BasketModel,
    private api: Api,
    private basketPresenter: BasketPresenter,
    private successView: SuccessView,
    private modalContent: HTMLElement
  ) {
    this.orderView.onFormSubmit = this.handleOrderFormSubmit;
  }

  public startOrderProcess(): void {
    this.orderView.render();
    this.orderView.open();
  }

  private handleOrderFormSubmit = (formData: IOrderForm): void => {
    this.address = formData.address;
    this.payment = formData.payment;

    this.contactsPresenter.start(this.modalContent, this.handleContactsFormSubmit);
  };

  private handleContactsFormSubmit = async (contactsData: IOrderForm): Promise<void> => {
    const orderData = {
      address: this.address,
      payment: this.payment,
      email: contactsData.email,
      phone: contactsData.phone,
      items: this.basketModel.getItems().map((item) => item.id),
      total: this.basketModel.getTotalPrice(),
    };

    try {
      await this.api.post('/order', orderData, 'POST');

      this.basketModel.clear();

      this.successView.render(this.modalContent, orderData.total);
      this.successView.open();
    } catch (error) {
      console.error('Ошибка отправки заказа:', error);
      alert('Не удалось отправить заказ. Попробуйте позже.');
    }
  };
}
