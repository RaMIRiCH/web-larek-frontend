import { IOrderForm } from '../types';

export type ContactsViewCallbacks = {
  onInputChange?: () => void;
  onFormSubmit?: (data: IOrderForm) => void;
};

export class ContactsView {
  private element!: HTMLFormElement;
  private emailInput!: HTMLInputElement;
  private phoneInput!: HTMLInputElement;
  private nextButton!: HTMLButtonElement;
  private errorsContainer!: HTMLElement;
  private callbacks: ContactsViewCallbacks = {};

  constructor(private template: HTMLTemplateElement) {}

  public onInputChange?: () => void;
  public onFormSubmit?: (data: IOrderForm) => void;

  public render(): HTMLElement {
    const content = this.template.content.cloneNode(true) as DocumentFragment;
    this.element = content.querySelector('form')!;
    this.initElements();
    this.updateButtonState(false);
    return this.element;
  }

  private initElements(): void {
    this.emailInput = this.element.querySelector('input[name="email"]')!;
    this.phoneInput = this.element.querySelector('input[name="phone"]')!;
    this.nextButton = this.element.querySelector('button[type="submit"]')!;
    this.errorsContainer = this.element.querySelector('.form__errors')!;

    this.emailInput.addEventListener('input', () => this.callbacks.onInputChange?.());
    this.phoneInput.addEventListener('input', () => this.callbacks.onInputChange?.());
    this.element.addEventListener('submit', this.handleSubmit);
  }

  private handleSubmit = (event: Event): void => {
    event.preventDefault();
    this.callbacks.onFormSubmit?.(this.formData);
  };

  public setCallbacks(callbacks: ContactsViewCallbacks): void {
    this.callbacks = callbacks;
  }

  public showErrors(errors: string[]): void {
    this.errorsContainer.innerHTML = errors.length > 0
      ? errors.map(e => `<span>${e}</span>`).join('<br>')
      : '';
  }

  public updateButtonState(enabled: boolean): void {
    this.nextButton.disabled = !enabled;
  }

  public get formData(): IOrderForm {
    return {
      address: '',
      payment: '',
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    };
  }

  public setEmail(email: string): void {
    this.emailInput.value = email;
  }

  public setPhone(phone: string): void {
    this.phoneInput.value = phone;
  }
}
