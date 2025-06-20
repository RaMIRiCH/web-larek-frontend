import { Product } from '../models/Product';
import { CDN_URL } from '../utils/constants';

export class ProductModalView {
  private container: HTMLElement;
  private template: HTMLTemplateElement;
  private closeBtn: HTMLButtonElement | null = null;
  private addButton: HTMLButtonElement | null = null;

  constructor(container: HTMLElement, template: HTMLTemplateElement) {
    this.container = container;
    this.template = template;
  }

  render(product: Product): void {
    const content = this.container.querySelector('.modal__content');
    if (!content) return;
    content.innerHTML = '';

    const cardFragment = this.template.content.cloneNode(true) as HTMLElement;
    const card = cardFragment.querySelector('.card') as HTMLElement;

    card.querySelector('.card__image')!.setAttribute('src', `${CDN_URL}${product.image}`);
    card.querySelector('.card__image')!.setAttribute('alt', product.title);
    card.querySelector('.card__title')!.textContent = product.title;
    card.querySelector('.card__text')!.textContent = product.description;
    card.querySelector('.card__price')!.textContent = product.formattedPrice;

    const categoryEl = card.querySelector('.card__category')!;
    categoryEl.textContent = product.category;

    categoryEl.className = 'card__category'; // сброс классов
    categoryEl.classList.add(`card__category_${product.categoryModifier}`);

    this.addButton = card.querySelector('.button') as HTMLButtonElement;
    this.addButton.dataset.id = product.id;

    content.appendChild(cardFragment);

    this.closeBtn = this.container.querySelector('.modal__close');
  }

  bindClose(handler: () => void): void {
    this.closeBtn?.addEventListener('click', handler);
  }

  bindAddToBasket(handler: (productId: string) => void): void {
    const id = this.addButton?.dataset.id;
    if (id) {
      this.addButton!.addEventListener('click', () => handler(id));
    }
  }
}
