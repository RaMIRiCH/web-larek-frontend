import { OrderView } from '../views/OrderView';
import { ContactsPresenter } from './contactsPresenter';
import { BasketModel } from '../models/Basket';
import { Api } from '../components/base/api';
import { IOrderForm } from '../types';

export class OrderPresenter {
  // Первый шаг
  private address: string = '';
  private payment: string = '';

  constructor(
    private orderView: OrderView,
    private contactsPresenter: ContactsPresenter,
    private basketModel: BasketModel,
    private api: Api
  ) {
    // Обработчик первого шага — адрес + способ оплаты
    this.orderView.onFormSubmit = this.handleOrderFormSubmit;
  }

  // Запуск оформления заказа
  public startOrderProcess(): void {
    this.orderView.render();
    this.orderView.open();
  }

  // Первый шаг: сохраняем адрес и способ оплаты
  private handleOrderFormSubmit = (formData: IOrderForm): void => {
    this.address = formData.address;
    this.payment = formData.payment;

    const modalContent = document.querySelector<HTMLElement>('.modal__content');
    if (!modalContent) {
      console.error('Модалка не найдена');
      return;
    }

    // Показываем второй шаг: контакты
    this.contactsPresenter.start(modalContent, this.handleContactsFormSubmit);
  };

  // Второй шаг: email и телефон → собираем заказ и отправляем
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

      // Показываем модалку успешного заказа
      this.orderView.showSuccessModal(orderData.total);
    } catch (error) {
      console.error('Ошибка отправки заказа:', error);
      alert('Не удалось отправить заказ. Попробуйте позже.');
    }
  };
}
