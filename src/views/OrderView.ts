import { IOrderForm } from '../types';

export class OrderView {
  private element: HTMLFormElement;
  private addressInput: HTMLInputElement;
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private submitButton: HTMLButtonElement;
  private errorContainer: HTMLElement;

  public onFormSubmit?: (data: IOrderForm) => void;
  public onInputChange?: (data: IOrderForm) => void;

  constructor(template: HTMLTemplateElement) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    this.element = fragment.querySelector('form')!;
    this.addressInput = this.element.querySelector('input[name="address"]')!;
    this.paymentButtons = this.element.querySelectorAll('.button_alt');
    this.submitButton = this.element.querySelector('button[type="submit"]')!;
    this.errorContainer = this.element.querySelector('.form__errors')!;

    this.initListeners();
  }

  private initListeners() {
    this.paymentButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.paymentButtons.forEach(b => b.classList.toggle('button_alt-active', b === btn));
        this.onInputChange?.(this.formData);
      });
    });

    this.addressInput.addEventListener('input', () => {
      this.onInputChange?.(this.formData);
    });

    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onFormSubmit?.(this.formData);
    });
  }

  get formData(): IOrderForm {
    const selectedButton = [...this.paymentButtons].find(b => b.classList.contains('button_alt-active'));
    return {
      address: this.addressInput.value,
      payment: selectedButton?.getAttribute('name') || '',
      email: '',
      phone: '',
    };
  }

  public updateButtonState(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }

  public showErrors(errors: string[]): void {
    this.errorContainer.innerHTML = errors.map(e => `<span>${e}</span>`).join('<br>');
  }

  public render(): HTMLElement {
    return this.element;
  }
}
