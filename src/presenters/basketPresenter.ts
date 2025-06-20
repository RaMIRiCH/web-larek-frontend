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
    const isOrderAvailable = this.model.isOrderAvailable();

    this.view.render();
    this.view.renderItems(items, isOrderAvailable);
    this.view.updateTotal(this.model.getTotalPrice());
    this.view.open();
    this.updateCounter();
  }

  private handleRemoveItem = (productId: string): void => {
    this.model.removeItem(productId);

    const items = this.model.getItems();
    const isOrderAvailable = this.model.isOrderAvailable();

    this.view.renderItems(items, isOrderAvailable);
    this.view.updateTotal(this.model.getTotalPrice());
    this.updateCounter();
  };

  public handleSubmit = (): void => {
    this.view.close();
    document.dispatchEvent(new CustomEvent('order:start'));
  };
}
