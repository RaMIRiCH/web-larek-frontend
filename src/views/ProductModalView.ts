import { Product } from '../models/Product';
import { CDN_URL } from '../utils/constants';
import { EventEmitter } from '../components/base/events';
import { modalManager } from '../components/ModalManager';

export class ProductModalView {
  private container: HTMLElement;
  private titleElem: HTMLElement;
  private descriptionElem: HTMLElement;
  private priceElem: HTMLElement;
  private imageElem: HTMLImageElement;
  private categoryElem: HTMLElement;
  private addButton: HTMLElement;

  private currentProduct: Product | null = null;

  constructor(
    private template: HTMLTemplateElement,
    private eventEmitter: EventEmitter
  ) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    this.container = fragment.firstElementChild as HTMLElement;

    this.titleElem = this.container.querySelector('.card__title')!;
    this.descriptionElem = this.container.querySelector('.card__text')!;
    this.priceElem = this.container.querySelector('.card__price')!;
    this.imageElem = this.container.querySelector('.card__image')!;
    this.addButton = this.container.querySelector('.card__button')!;
    this.categoryElem = this.container.querySelector('.card__category')!;

    this.addButton.addEventListener('click', () => {
      if (this.currentProduct) {
        this.eventEmitter.emit('basket:add', this.currentProduct);
        modalManager.close();
      }
    });
  }

  public updateContent(product: Product): void {
    this.currentProduct = product;

    this.titleElem.textContent = product.title;
    this.descriptionElem.textContent = product.description;
    this.priceElem.textContent = product.formattedPrice;
    this.imageElem.src = `${CDN_URL}${product.image}`;
    this.imageElem.alt = product.title;

    this.categoryElem.textContent = product.category;
    this.categoryElem.className = `card__category card__category_${product.categoryModifier}`;
  }

  public render(): HTMLElement {
    return this.container;
  }
}
