import { Product } from '../models/Product';
import { CDN_URL } from '../utils/constants';
import { EventEmitter } from '../components/base/events';

export class ProductCardView {
  private container: HTMLElement;
  private categoryElem: HTMLElement;
  private titleElem: HTMLElement;
  private priceElem: HTMLElement;
  private imageElem: HTMLImageElement;

  constructor(
    private template: HTMLTemplateElement,
    private eventEmitter: EventEmitter
  ) {
    const fragment = this.template.content.cloneNode(true) as DocumentFragment;
    this.container = fragment.firstElementChild as HTMLElement;

    this.categoryElem = this.container.querySelector('.card__category')!;
    this.titleElem = this.container.querySelector('.card__title')!;
    this.priceElem = this.container.querySelector('.card__price')!;
    this.imageElem = this.container.querySelector('.card__image')!;
  }

  public updateContent(product: Product): void {
    this.categoryElem.textContent = product.category;
    this.categoryElem.className = `card__category card__category_${product.categoryModifier}`;
    this.titleElem.textContent = product.title;
    this.priceElem.textContent = product.formattedPrice;
    this.imageElem.src = `${CDN_URL}${product.image}`;
    this.imageElem.alt = product.title;

    this.container.onclick = () => {
      this.eventEmitter.emit('product:open', product);
    };
  }

  public render(): HTMLElement {
    return this.container;
  }
}
