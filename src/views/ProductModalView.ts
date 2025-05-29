import { IProduct } from '../types';
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

  render(product: IProduct): void {
    const content = this.container.querySelector('.modal__content');
    if (!content) {
      console.error('Не найдена .modal__content в модалке');
      return;
    }
    content.innerHTML = '';

    const cardFragment = this.template.content.cloneNode(true) as HTMLElement;

    const card = cardFragment.querySelector('.card') as HTMLElement;
    const image = card.querySelector('.card__image') as HTMLImageElement;
    const category = card.querySelector('.card__category') as HTMLElement;
    const title = card.querySelector('.card__title') as HTMLElement;
    const description = card.querySelector('.card__text') as HTMLElement;
    const price = card.querySelector('.card__price') as HTMLElement;
    this.addButton = card.querySelector('.button') as HTMLButtonElement;

    image.src = `${CDN_URL}${product.image}`;
    image.alt = product.title;

    category.classList.forEach(className => {
      if (className.startsWith('card__category_')) {
        category.classList.remove(className);
      }
    });

    if (!category.classList.contains('card__category')) {
      category.classList.add('card__category');
    }

    const categoryMap: Record<string, string> = {
      'софт-скил': 'soft',
      'хард-скил': 'hard',
      'другое': 'other',
      'кнопка': 'button',
      'дополнительное': 'additional'
    };

    const categoryRaw = product.category.toLowerCase();
    const modifier = categoryMap[categoryRaw] ?? 'other';
    category.classList.add(`card__category_${modifier}`);
    category.textContent = product.category;

    title.textContent = product.title;
    description.textContent = product.description;
    price.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';

    this.addButton.dataset.id = product.id;

    content.appendChild(cardFragment);

    this.closeBtn = this.container.querySelector('.modal__close');
  }

  bindClose(handler: () => void): void {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', handler);
    }
  }

  bindAddToBasket(handler: (productId: string) => void): void {
    if (this.addButton) {
      const id = this.addButton.getAttribute('data-id');
      if (id) {
        this.addButton.addEventListener('click', () => handler(id));
      }
    }
  }
}
