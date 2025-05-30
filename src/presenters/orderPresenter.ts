import { OrderView } from '../views/OrderView';
import { ContactsPresenter } from './contactsPresenter';
import { BasketModel } from '../models/Basket';
import { Api } from '../components/base/api';
import { IOrderForm } from '../types';

export class OrderPresenter {
  private firstStepData: IOrderForm | null = null;

  constructor(
    private orderView: OrderView,
    private contactsPresenter: ContactsPresenter,
    private basketModel: BasketModel,
    private api: Api
  ) {
    // Привязываем обработчик сабмита формы заказа (первый шаг)
    this.orderView.onFormSubmit = this.handleOrderFormSubmit;
  }

  // Запускаем процесс оформления заказа — показываем первый шаг (OrderView)
  public startOrderProcess(): void {
    this.orderView.render();
    this.orderView.open();
  }

  // Обработчик отправки первого шага (выбор способа оплаты и адрес)
  private handleOrderFormSubmit = (formData: IOrderForm): void => {
    this.firstStepData = formData;

    // Получаем контейнер для модалки (куда будет рендериться второй шаг)
    const modalContainer = document.querySelector<HTMLElement>('.modal__content');

    if (!modalContainer) {
      console.error('Контейнер для модалки не найден');
      return;
    }

    // Запускаем второй шаг оформления — показываем контакты (Email, телефон)
    // Передаём контейнер и callback для получения данных контактов
    this.contactsPresenter.start(modalContainer, this.handleContactsFormSubmit);
  };

  // Обработчик отправки второго шага (контакты)
  private handleContactsFormSubmit = async (contactsData: IOrderForm): Promise<void> => {
    if (!this.firstStepData) {
      console.error('Данные первого шага отсутствуют');
      return;
    }

    // Собираем данные заказа из первого шага, контактов, корзины
    const orderData = {
      ...this.firstStepData,
      ...contactsData,
      items: this.basketModel.getItems().map(item => item.id),
      total: this.basketModel.getTotalPrice(),
    };

    try {
      // Отправляем заказ на сервер
      await this.api.post('/order', orderData, 'POST');

      // Очищаем корзину после успешного заказа
      this.basketModel.clear();

      // Показываем модальное окно успешного оформления с суммой заказа
      this.orderView.showSuccessModal(orderData.total);
    } catch (err) {
      alert('Ошибка отправки заказа');
      console.error(err);
    }
  };
}
