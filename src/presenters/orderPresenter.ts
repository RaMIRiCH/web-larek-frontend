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
    this.orderView.onFormSubmit = this.handleOrderFormSubmit;

    this.successView.setCallbacks({
      onClose: () => location.reload()
    });
  }

  public startOrderProcess(): void {
    this.orderView.render();
    this.orderView.open();
  }

  private handleOrderFormSubmit = (formData: IOrderForm): void => {
    console.log('[OrderPresenter] handleOrderFormSubmit called', formData);
    this.orderModel.setAddress(formData.address);
    this.orderModel.setPayment(formData.payment);

    const errors = this.orderModel.validateStep1();

    if (errors.length > 0) {
      console.log('[OrderPresenter] Step1 validation errors:', errors);
      this.orderView.showErrors(errors);
      return;
    }

    this.orderModel.setItems(this.basketModel.getItems().map((item) => item.id));
    this.orderModel.setTotal(this.basketModel.getTotalPrice());

    console.log('[OrderPresenter] Starting contactsPresenter');

    this.contactsPresenter.start(this.modalContent, this.handleContactsFormSubmit);
  };

  private handleContactsFormSubmit = async (contactsData: IOrderForm): Promise<void> => {
    console.log('[OrderPresenter] handleContactsFormSubmit called', contactsData);
    this.orderModel.setEmail(contactsData.email);
    this.orderModel.setPhone(contactsData.phone);

    const errors = this.orderModel.validateStep2();
    console.log('[OrderPresenter] Step2 validation errors:', errors);
    if (errors.length > 0) {
      this.contactsPresenter.showErrors(errors);
      return;
    }

    const orderData = this.orderModel.getData();

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
