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
    // Клонируем шаблон и сохраняем корневой контейнер
    this.container = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    // Находим DOM-узлы и сохраняем их
    this.indexElem = this.container.querySelector('.basket__item-index')!;
    this.titleElem = this.container.querySelector('.card__title')!;
    this.priceElem = this.container.querySelector('.card__price')!;
    this.removeButton = this.container.querySelector('.basket__item-delete')!;

    // Подписываемся на клик удаления
    this.removeButton.addEventListener('click', () => {
      // В emit передаем id продукта, который будет передан при вызове updateContent
      if (this.currentProduct) {
        this.eventEmitter.emit('basket:remove', { productId: this.currentProduct.id });
      }
    });
  }

  private currentProduct: Product | null = null;

  // Метод обновляет содержимое в DOM
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
