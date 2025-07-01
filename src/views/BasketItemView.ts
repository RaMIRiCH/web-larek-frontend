import { EventEmitter } from '../components/base/events';
import { Product } from '../models/Product';

export class BasketItemView {
  private container: HTMLElement;
  private indexElem: HTMLElement;
  private titleElem: HTMLElement;
  private priceElem: HTMLElement;
  private removeButton: HTMLButtonElement;

  constructor(
    private template: HTMLTemplateElement,
    private eventEmitter: EventEmitter
  ) {
    this.container = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    this.indexElem = this.container.querySelector('.basket__item-index')!;
    this.titleElem = this.container.querySelector('.card__title')!;
    this.priceElem = this.container.querySelector('.card__price')!;
    this.removeButton = this.container.querySelector('.basket__item-delete')!;

    this.removeButton.addEventListener('click', () => {
      if (this.currentProduct) {
        this.eventEmitter.emit('basket:remove', { productId: this.currentProduct.id });
      }
    });
  }

  private currentProduct: Product | null = null;

  public updateContent(product: Product, index: number): void {
    this.currentProduct = product;

    this.indexElem.textContent = String(index + 1);
    this.titleElem.textContent = product.title;
    this.priceElem.textContent = product.formattedPrice;
  }

  public render(): HTMLElement {
    return this.container;
  }
}
