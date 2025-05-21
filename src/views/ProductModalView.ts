import { CDN_URL } from "../utils/constants";

export class ProductModalView {
  private container: HTMLElement;
  private closeBtn: HTMLButtonElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(product: { id: string; title: string; description: string; price: number; image: string }) {
    const imageUrl = `${CDN_URL}${product.image}`;
    this.container.classList.add('modal', 'modal_active');

    this.container.innerHTML = `
        <div class="modal__container">
          <button class="modal__close" aria-label="закрыть"></button>
          <div class="modal__content">
            <div class="card card_full">
              <img class="card__image" src="${imageUrl}" alt="${product.title}" />
              <div class="card__column">
                <span class="card__category card__category_other">другое</span>
                <h2 class="card__title">${product.title}</h2>
                <p class="card__text">${product.description}</p>
                <div class="card__row">
                  <button class="button">В корзину</button>
                  <span class="card__price">${product.price} синапсов</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    `;
    this.closeBtn = this.container.querySelector('.modal__close');
  }

  bindClose(handler: () => void) {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', handler);
    }
  }
}