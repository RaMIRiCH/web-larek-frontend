export class ProductModalView {
  private container: HTMLElement;
  private closeBtn: HTMLButtonElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(product: { id: string; title: string; description: string; price: number; image: string }) {
    this.container.innerHTML = `
      <div class="modal__header">
        <h2>${product.title}</h2>
        <button class="modal__close" aria-label="Закрыть">&times;</button>
      </div>
      <div class="modal__body">
        <img src="${product.image}" alt="${product.title}" class="product-modal__image" />
        <p>${product.description}</p>
        <p><strong>Цена: </strong>${product.price} синапсов</p>
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
