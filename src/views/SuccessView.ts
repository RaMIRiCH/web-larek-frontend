export class SuccessView {
  private element: HTMLElement;

  constructor(private template: HTMLTemplateElement) {
    const content = template.content.cloneNode(true) as DocumentFragment;
    this.element = content.firstElementChild as HTMLElement;
  }

  public render(total: number): HTMLElement {
    const clone = this.element.cloneNode(true) as HTMLElement;

    const description = clone.querySelector('.order-success__description');
    if (description) {
      description.textContent = `Списано ${total} синапсов`;
    }

    const closeButton = clone.querySelector('.order-success__close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        const event = new CustomEvent('modal:close');
        document.dispatchEvent(event);
      });
    }

    return clone;
  }
}
