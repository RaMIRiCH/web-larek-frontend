import { ContactsView } from '../views/ContactsView';
import { IOrderForm } from '../types';

export class ContactsPresenter {
  private callback: ((data: IOrderForm) => void) | null = null;

  constructor(private contactsView: ContactsView) {
    this.contactsView.onFormSubmit = (data) => {
      if (this.callback) this.callback(data);
    };
  }

  public start(container: HTMLElement, callback: (data: IOrderForm) => void): void {
    this.callback = callback;
    this.contactsView.render(container);
    this.contactsView.open();
  }
}
