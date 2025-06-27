import { Product } from '../models/Product';
import { CDN_URL } from '../utils/constants';

export type ProductCardViewCallbacks = {
  onClick?: (id: string) => void;
};

export class ProductCardView {
  private element: HTMLElement;
  private callbacks: ProductCardViewCallbacks = {};

  constructor(private template: HTMLTemplateElement) {
    this.element = this.template.content.querySelector('.card')!.cloneNode(true) as HTMLElement;
  }

  setCallbacks(callbacks: ProductCardViewCallbacks): void {
    this.callbacks = callbacks;
  }

  render(product: Product): HTMLElement {
    this.element.querySelector('.card__title')!.textContent = product.title;

    const categoryElem = this.element.querySelector('.card__category')!;
    categoryElem.textContent = product.category;
    categoryElem.className = `card__category card__category_${product.categoryModifier}`;

    const priceElem = this.element.querySelector('.card__price')!;
    priceElem.textContent = product.formattedPrice;

    const imageElem = this.element.querySelector('.card__image') as HTMLImageElement;
    imageElem.src = `${CDN_URL}${product.image}`;
    imageElem.alt = product.title;

    this.element.addEventListener('click', () => {
      this.callbacks.onClick?.(product.id);
    });

    return this.element;
  }
}
