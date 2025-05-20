import { ProductModalView } from '../views/ProductModalView';
import { Api } from '../components/base/api';
import { Product } from '../models/Product';

export class ProductModalPresenter {
  private view: ProductModalView;
  private api: Api;
  private modalContainer: HTMLElement;

  constructor(view: ProductModalView, api: Api, modalContainer: HTMLElement) {
    this.view = view;
    this.api = api;
    this.modalContainer = modalContainer;
  }

  async show(productId: string) {
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
      this.view.render(product);
      this.openModal();
      this.view.bindClose(() => this.closeModal());
      this.modalContainer.addEventListener('click', this.onOutsideClick);
      document.addEventListener('keydown', this.onEscPress);
    } catch (err) {
      console.error('Ошибка загрузки продукта:', err);
    }
  }

  private openModal() {
    this.modalContainer.classList.add('modal_active');
  }

  private closeModal = () => {
    this.modalContainer.classList.remove('modal_active');
    this.modalContainer.innerHTML = '';
    this.modalContainer.removeEventListener('click', this.onOutsideClick);
    document.removeEventListener('keydown', this.onEscPress);
  };

  private onOutsideClick = (e: MouseEvent) => {
    if (e.target === this.modalContainer) {
      this.closeModal();
    }
  };

  private onEscPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.closeModal();
    }
  };
}
