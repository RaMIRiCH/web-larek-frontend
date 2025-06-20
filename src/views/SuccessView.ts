import { openModal, closeModal, clearModalContent } from './Modal';

export type SuccessViewCallbacks = {
  onClose?: () => void;
};

export class SuccessView {
  private element: HTMLElement;
  private descriptionElement!: HTMLElement;
  private closeButton!: HTMLButtonElement;
  private callbacks: SuccessViewCallbacks = {};

  constructor(template: HTMLTemplateElement) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  }

  render(container: HTMLElement, formattedTotal: string): void {
    container.innerHTML = '';
    container.appendChild(this.element);

    this.descriptionElement = this.element.querySelector('.order-success__description') as HTMLElement;
    this.closeButton = this.element.querySelector('.order-success__close') as HTMLButtonElement;

    if (this.descriptionElement) {
      this.descriptionElement.textContent = formattedTotal;
    }

    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        this.callbacks.onClose?.();
        this.close();
      });
    }
  }

  open(): void {
    openModal(this.element);
  }

  close(): void {
    closeModal(this.element);
    clearModalContent(this.element);
  }

  setCallbacks(callbacks: SuccessViewCallbacks): void {
    this.callbacks = callbacks;
  }
}
