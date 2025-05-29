import { ProductModalView } from '../views/ProductModalView';
import { Api } from '../components/base/api';
import { Product } from '../models/Product';
import { BasketModel } from '../models/Basket';
import { BasketPresenter } from './basketPresenter';

export class ProductModalPresenter {
  private view: ProductModalView;
  private api: Api;
  private modalContainer: HTMLElement;
  private basketModel: BasketModel;
  private basketPresenter: BasketPresenter;

  constructor(
  view: ProductModalView,
  api: Api,
  modalContainer: HTMLElement,
  basketModel: BasketModel,
  basketPresenter: BasketPresenter
) {
  this.view = view;
  this.api = api;
  this.modalContainer = modalContainer;
  this.basketModel = basketModel;
  this.basketPresenter = basketPresenter;
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

      this.view.bindAddToBasket(() => {
        this.basketModel.addItem(product);
        this.basketPresenter.updateCounter();
        this.closeModal();
      });

      this.modalContainer.addEventListener('click', this.onOutsideClick);
      document.addEventListener('keydown', this.onEscPress);
    } catch (err) {
      console.error('Ошибка загрузки продукта:', err);
    }
  }

  private openModal() {
    this.modalContainer.classList.add('modal_active');
    document.body.classList.add('no-scroll');
  }

  private closeModal = () => {
    this.modalContainer.classList.remove('modal_active');
    document.body.classList.remove('no-scroll');
    const content = this.modalContainer.querySelector('.modal__content');
      if (content) {
        content.innerHTML = ' ';
      }
    this.modalContainer.removeEventListener('click', this.onOutsideClick);
    document.removeEventListener('keydown', this.onEscPress);
  };

  private onOutsideClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  };

  private onEscPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.closeModal();
    }
  };
}
