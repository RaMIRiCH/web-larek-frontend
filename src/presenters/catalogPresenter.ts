import { CatalogView } from '../views/CatalogView';
import { Api, ApiListResponse } from '../components/base/api';
import { ProductModalPresenter } from './ProductModalPresenter';
import { IProduct } from '../types';
import { Product } from '../models/Product';

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
      const response = await this.api.get('/product/');
      const rawProducts = (response as ApiListResponse<IProduct>).items;

      const products = rawProducts.map(p => new Product(
        p.id,
        p.title,
        p.description ?? '',
        p.image,
        p.category,
        p.price ?? null
      ));

      this.view.renderItems(products, (productId: string) => {
        this.productModalPresenter.show(productId);
      });
    } catch (err) {
      console.error(err);
    }
  }
}
