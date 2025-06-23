/* eslint-disable @typescript-eslint/no-inferrable-types */
import { OrderView } from '../views/OrderView';
import { OrderModel } from '../models/OrderModel';
import { ContactsPresenter } from './contactsPresenter';
import { BasketModel } from '../models/Basket';
import { Api } from '../components/base/api';
import { IOrderForm } from '../types';
import type { BasketPresenter } from './basketPresenter';
import { SuccessView } from '../views/SuccessView';

export class OrderPresenter {
  constructor(
    private orderView: OrderView,
    private contactsPresenter: ContactsPresenter,
    private basketModel: BasketModel,
    private api: Api,
    private basketPresenter: BasketPresenter,
    private successView: SuccessView,
    private modalContent: HTMLElement,
    private orderModel: OrderModel,
  ) {
    this.orderView.onInputChange = this.handleOrderFormInput;
    this.orderView.onFormSubmit = this.handleOrderFormSubmit;

    this.successView.setCallbacks({
      onClose: () => {
        this.successView.close();
        this.basketModel.clear();
        this.basketPresenter.updateCounter();
        this.orderView.close();
      }
    });
  }

  public startOrderProcess(): void {
    this.orderView.render();
    this.orderView.open();
  }

  private handleOrderFormInput = (data: { address: string; payment: string | null }): void => {
    this.orderModel.setAddress(data.address);
    this.orderModel.setPayment(data.payment || '');

    const errors = this.orderModel.validateStep1();
    const isValid = errors.length === 0 && this.basketModel.getItems().length > 0;

    this.orderView.showErrors(errors);
    this.orderView.updateButtonState(isValid);
  };

  private handleOrderFormSubmit = (formData: IOrderForm): void => {
    this.orderModel.setAddress(formData.address);
    this.orderModel.setPayment(formData.payment);

    const errors = this.orderModel.validateStep1();
    if (errors.length > 0) {
      this.orderView.showErrors(errors);
      return;
    }

    this.contactsPresenter.start(this.modalContent, this.handleContactsFormSubmit);
  };

  private handleContactsFormSubmit = async (contactsData: IOrderForm): Promise<void> => {
    this.orderModel.setEmail(contactsData.email);
    this.orderModel.setPhone(contactsData.phone);

    const errors = this.orderModel.validateStep2();
    if (errors.length > 0) {
      this.contactsPresenter.showErrors(errors);
      return;
    }

    const orderData = {
      ...this.orderModel.getData(),
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
