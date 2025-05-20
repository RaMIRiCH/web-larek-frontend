import { CatalogView } from '../views/CatalogView';
import { Api, ApiListResponse } from '../components/base/api';
import { ProductModalPresenter } from './ProductModalPresenter';
import { IProduct } from '../types';

export class CatalogPresenter {
  private view: CatalogView;
  private api: Api;
  private productModalPresenter: ProductModalPresenter;

  constructor(
    view: CatalogView,
    api: Api,
    productModalPresenter: ProductModalPresenter
  ) {
    this.view = view;
    this.api = api;
    this.productModalPresenter = productModalPresenter;
  }

  async init() {
  try {
    const response = await this.api.get('/products');
    const products = (response as ApiListResponse<IProduct>).items;
    this.view.renderItems(products, (productId: string) => {
      this.productModalPresenter.show(productId);
    });
  } catch (err) {
    console.error(err);
  }
}
}
