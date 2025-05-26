import { BasketModel } from '../models/Basket';
import { BasketView } from '../views/BasketView';

export class BasketPresenter {
  constructor(
    private model: BasketModel,
    private view: BasketView
  ) {
    this.view.setCallbacks({
      onRemoveItem: this.handleRemoveItem,
      onSubmit: this.handleSubmit,
    });
  }

  updateCounter() {
  this.view.renderCounter(this.model.getItems().length);
}

  public open(): void {
    this.updateView();
    this.view.open();
  }

  private updateView(): void {
    this.view.renderItems(this.model.getItems());
    this.view.updateTotal(this.model.getTotalPrice());
  }

  private handleRemoveItem = (productId: string): void => {
    this.model.removeItem(productId);
    this.updateView();
    this.updateCounter();
  };

  private handleSubmit = (): void => {
    this.view.close();
    document.dispatchEvent(new CustomEvent('order:start'));
  };
}
