export class SuccessView {
  private element: HTMLElement;
  private descriptionElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement) {
    const content = template.content.cloneNode(true) as DocumentFragment;
    this.element = content.firstElementChild as HTMLElement;

    this.descriptionElement = this.element.querySelector('.order-success__description')!;
    this.closeButton = this.element.querySelector('.order-success__close')!;

    this.closeButton.addEventListener('click', () => {
      const event = new CustomEvent('modal:close');
      document.dispatchEvent(event);
    });
  }

  public render(total: number): HTMLElement {
    this.descriptionElement.textContent = `Списано ${total} синапсов`;
    return this.element;
  }
}
