import { ProductView } from '../views/ProductView';
import { Product } from '../models/Product';
import { BasketModel } from '../models/Basket';
import { Api } from '../components/base/api';

export class ProductPresenter {
  private view: ProductView;
  private basketModel: BasketModel;
  private api: Api;

  constructor(view: ProductView, basketModel: BasketModel, api: Api) {
    this.view = view;
    this.basketModel = basketModel;
    this.api = api;
  }

  async open(productId: string) {
    try {
      const productData = await this.api.getProductById(productId);
      const product = new Product(
        productData.id,
        productData.title,
        productData.description,
        productData.image,
        productData.category,
        productData.price
      );
      this.view.render(product, () => {
        this.basketModel.addItem(product);
      });
    } catch (err) {
      console.error('Ошибка при загрузке товара:', err);
    }
  }
}
