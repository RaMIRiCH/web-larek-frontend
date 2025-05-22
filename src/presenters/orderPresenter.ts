import { OrderView } from "../views/OrderView";
import { BasketModel } from "../models/Basket";
import { Api } from "../components/base/api";
import { IOrderForm } from "../types";

export class OrderPresenter {
  constructor(
    private view: OrderView,
    private basketModel: BasketModel,
    private api: Api
  ) {
    this.view.onFormSubmit = this.handleSubmit;
  }

  public startOrderProcess(): void {
    this.view.render();
    this.view.open();
  }

  private handleSubmit = async (formData: IOrderForm) => {
    const orderData = {
      ...formData,
      items: this.basketModel.getItems().map(i => i.id),
      total: this.basketModel.getTotalPrice(),
    };
    await this.api.post('/order', orderData, 'POST');
    this.basketModel.clear();
    this.view.close();
    this.view.showSuccessModal(orderData.total);
  };
}
