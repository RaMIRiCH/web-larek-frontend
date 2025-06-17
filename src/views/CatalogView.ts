import { Product } from '../models/Product';  // Импортируем класс Product
import { CDN_URL } from '../utils/constants';

export class CatalogView {
  private container: HTMLElement;
  private template: HTMLTemplateElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.template = document.getElementById('card-catalog') as HTMLTemplateElement;
    if (!this.template) {
      throw new Error('Template with id "card-catalog" not found');
    }
  }

  // Обратите внимание — теперь Product[], а не IProduct[]
  renderItems(products: Product[], onCardClick: (productId: string) => void): void {
    this.container.innerHTML = '';

    products.forEach(product => {
      const card = this.renderCard(product);
      card.addEventListener('click', () => onCardClick(product.id));
      this.container.append(card);
    });
  }

  private renderCard(product: Product): HTMLElement {
    const fragment = this.template.content.cloneNode(true) as DocumentFragment;

    const cardElement = fragment.querySelector('.card') as HTMLElement;
    if (!cardElement) {
      throw new Error('Card element with class .card not found in template');
    }

    const titleElem = cardElement.querySelector('.card__title') as HTMLElement;
    if (titleElem) titleElem.textContent = product.title;

    const imageElem = cardElement.querySelector('.card__image') as HTMLImageElement;
    if (imageElem) imageElem.src = `${CDN_URL}${product.image}`;

    const priceElem = cardElement.querySelector('.card__price') as HTMLElement;
    if (priceElem) priceElem.textContent = product.formattedPrice; // Используем геттер из класса Product

    const categoryElem = cardElement.querySelector('.card__category') as HTMLElement;
    if (categoryElem) {
      categoryElem.textContent = product.category;

      const className = 'card__category_' + (
        {
          'софт-скил': 'soft',
          'хард-скил': 'hard',
          'дополнительное': 'additional',
          'другое': 'other',
          'кнопка': 'button'
        }[product.category.toLowerCase()] || 'other'
      );

      categoryElem.className = `card__category ${className}`;
    }

    cardElement.dataset.id = product.id;

    return cardElement;
  }
}
