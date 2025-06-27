export type BasketViewCallbacks = {
  onRemoveItem?: (productId: string) => void;
  onSubmit?: () => void;
};

export class BasketView {
  private element: HTMLElement;
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private counterElement: HTMLElement;
  private submitButton: HTMLButtonElement;
  private callbacks: BasketViewCallbacks = {};

  constructor(template: HTMLTemplateElement) {
    this.element = template.content.querySelector('.basket')!.cloneNode(true) as HTMLElement;
    this.listElement = this.element.querySelector('.basket__list')!;
    this.totalElement = this.element.querySelector('.basket__price')!;
    this.counterElement = document.querySelector('.header__basket-counter')!;
    this.submitButton = this.element.querySelector('.basket__button')!;

    this.submitButton.addEventListener('click', () => this.callbacks.onSubmit?.());
  }

  setCallbacks(callbacks: BasketViewCallbacks): void {
    this.callbacks = callbacks;
  }

  setItems(elements: HTMLElement[]) {
    this.listElement.replaceChildren(...elements);
  }

  render(): HTMLElement {
    return this.element;
  }

  public setList(items: HTMLElement[]): void {
    this.listElement.replaceChildren(...items);
  }

  public updateTotal(total: number): void {
    this.totalElement.textContent = `${total} синапсов`;
  }

  public renderCounter(count: number): void {
    this.counterElement.textContent = String(count);
  }

  public setSubmitEnabled(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }
}

