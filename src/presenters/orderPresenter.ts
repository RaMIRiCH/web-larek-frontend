import { OrderView } from '../views/OrderView';
import { BasketModel } from '../models/Basket';
import { IOrderForm } from '../types';
import { API_URL } from '../utils/constants';

export class OrderPresenter {
  private view: OrderView;
  private basketModel: BasketModel;

  constructor(view: OrderView, basketModel: BasketModel) {
    this.view = view;
    this.basketModel = basketModel;

    this.view.onFormSubmit = this.handleFormSubmit;
  }

  private handleFormSubmit = (data: IOrderForm) => {
    if (!this.validate(data)) return;

    const orderData = {
      ...data,
      items: this.basketModel.getItems().map(item => item.id),
      total: this.basketModel.getTotalPrice(),
    };

    this.sendOrder(orderData);
  };

  private validate(data: IOrderForm): boolean {
    return Boolean(data.address && data.payment && data.email && data.phone);
  }

  private async sendOrder(orderData: any) {
    try {
      const response = await fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      this.basketModel.clear();
      this.view.showSuccessModal(orderData.total);
    } catch (err) {
      console.error('Ошибка отправки заказа:', err);
    }
  }
}
