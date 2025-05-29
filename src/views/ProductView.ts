import { IProduct } from '../types';
import { openModal } from './Modal';

export class ProductView {
  private modal: HTMLElement;
  private content: HTMLElement;

  constructor(modalContainer: HTMLElement) {
    this.modal = modalContainer;
    this.content = this.modal.querySelector('.modal__content')!;
  }

  render(product: IProduct, onAddToBasket: (product: IProduct) => void) {
    const template = document.getElementById('product-preview') as HTMLTemplateElement;
    const fragment = template.content.cloneNode(true) as HTMLElement;

    (fragment.querySelector('.product__title') as HTMLElement).textContent = product.title;
    (fragment.querySelector('.product__image') as HTMLImageElement).src = product.image;
    (fragment.querySelector('.product__price') as HTMLElement).textContent = `${product.price} синапсов`;
    (fragment.querySelector('.product__description') as HTMLElement).textContent = product.description;

    const buyButton = fragment.querySelector('.product__buy') as HTMLButtonElement;
    buyButton.addEventListener('click', () => onAddToBasket(product));

    this.content.innerHTML = '';
    this.content.appendChild(fragment);

    openModal(this.modal);
  }
}
