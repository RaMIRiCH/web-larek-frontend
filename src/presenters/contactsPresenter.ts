import { ContactsView } from '../views/ContactsView';
import { OrderModel } from '../models/OrderModel';
import { IOrderForm } from '../types';
import { BasketModel } from '../models/Basket';

export class ContactsPresenter {
  private callback: ((data: IOrderForm) => void) | null = null;

  constructor(
    private contactsView: ContactsView,
    private orderModel: OrderModel,
    private basketModel: BasketModel
  ) {
    this.contactsView.onFormSubmit = (data) => {
      console.log('[ContactsPresenter] onFormSubmit triggered', data);
      this.orderModel.setEmail(data.email);
      this.orderModel.setPhone(data.phone);

      const errors = this.orderModel.validateStep2();
      console.log('[ContactsPresenter] validateStep2 errors:', errors);

      this.contactsView.showErrors(errors);

      if (errors.length === 0 && this.callback) {
        console.log('[ContactsPresenter] Valid data, calling callback');
        this.callback(this.orderModel.getData());
      }
    };

    this.contactsView.onInputChange = () => {
      console.log('[ContactsPresenter] onInputChange triggered');
      this.orderModel.setEmail(this.contactsView.email);
      this.orderModel.setPhone(this.contactsView.phone);

      const errors = this.orderModel.validateStep2();
      const isValid = errors.length === 0;
      const hasItems = this.basketModel.getItems().length > 0;

      this.contactsView.showErrors(errors);

      this.contactsView.updateButtonState(isValid && hasItems);
    };
  }

  public showErrors(errors: string[]): void {
    this.contactsView.showErrors(errors);
  }

  public start(container: HTMLElement, callback: (data: IOrderForm) => void): void {
    this.callback = callback;
    this.contactsView.render(container);
    this.contactsView.open();
  }
}
