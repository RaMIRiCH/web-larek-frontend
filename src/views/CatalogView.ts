import { Product } from '../models/Product';
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
    if (imageElem) {
      imageElem.src = `${CDN_URL}${product.image}`;
      imageElem.alt = product.title;
    }

    const priceElem = cardElement.querySelector('.card__price') as HTMLElement;
    if (priceElem) priceElem.textContent = product.formattedPrice;

    const categoryElem = cardElement.querySelector('.card__category') as HTMLElement;
    if (categoryElem) {
      categoryElem.textContent = product.category;
      categoryElem.className = `card__category card__category_${product.categoryModifier}`;
    }

    cardElement.dataset.id = product.id;

    return cardElement;
  }
}
