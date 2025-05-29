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

  updateCounter(): void {
    this.view.renderCounter(this.model.getItems().length);
  }

  public open(): void {
    const items = this.model.getItems();
    this.view.render();
    this.view.renderItems(items);
    this.view.updateTotal(this.model.getTotalPrice());
    this.view.open();
    this.updateCounter();
}

  private handleRemoveItem = (productId: string): void => {
    this.model.removeItem(productId);

    const items = this.model.getItems();
    this.view.renderItems(items);
    this.view.updateTotal(this.model.getTotalPrice());
    this.updateCounter();
  };

  private handleSubmit = (): void => {
    this.view.close();
    document.dispatchEvent(new CustomEvent('order:start'));
  };
}
