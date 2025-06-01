export class SuccessView {
  private element: HTMLElement;

  constructor(template: HTMLTemplateElement) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  }

  render(container: HTMLElement, total: number) {
    container.innerHTML = '';
    container.appendChild(this.element);

    const totalEl = this.element.querySelector('.order-success__description');
    if (totalEl) {
      totalEl.textContent = `${total} синапсов`;
    }

    const closeBtn = this.element.querySelector('.order-success__close') as HTMLButtonElement;
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.close();
        location.reload();
      });
    }
  }

  open() {
    const modal = this.element.closest('.modal');
    if (modal) {
      modal.classList.add('modal_active');
    }
  }

  close() {
    const modal = this.element.closest('.modal');
    if (modal) {
      modal.classList.remove('modal_active');
      const content = modal.querySelector('.modal__content');
      if (content) content.innerHTML = '';
    }
  }
}
