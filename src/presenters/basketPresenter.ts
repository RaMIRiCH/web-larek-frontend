import { BasketModel } from '../models/Basket';
import { BasketView } from '../views/BasketView';
import { openModal, closeModal } from '../views/Modal';

export class BasketPresenter {
  constructor(
    private model: BasketModel,
    private view: BasketView,
    private modalElement: HTMLElement
  ) {
    this.view.setCallbacks({
      onRemoveItem: this.handleRemoveItem,
      onSubmit: this.handleSubmit,
    });
  }

  open(): void {
    this.updateView();
    openModal(this.modalElement);
  }

  private updateView(): void {
    this.view.renderItems(this.model.getItems());
    this.view.updateTotal(this.model.getTotalPrice());
  }

  private handleRemoveItem = (productId: string): void => {
    this.model.removeItem(productId);
    this.updateView();
  };

  private handleSubmit = (): void => {
    closeModal(this.modalElement);
    document.dispatchEvent(new CustomEvent('order:start'));
  };
}