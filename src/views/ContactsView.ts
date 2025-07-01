import { IOrderForm } from '../types';
import { EventEmitter } from '../components/base/events';

export class ContactsView {
  private element: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private nextButton: HTMLButtonElement;
  private errorsContainer: HTMLElement;

  constructor(
    private template: HTMLTemplateElement,
    private eventEmitter: EventEmitter
  ) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    this.element = fragment.querySelector('form')!;

    this.emailInput = this.element.querySelector('input[name="email"]')!;
    this.phoneInput = this.element.querySelector('input[name="phone"]')!;
    this.nextButton = this.element.querySelector('button[type="submit"]')!;
    this.errorsContainer = this.element.querySelector('.form__errors')!;

    this.initListeners();
  }

  private initListeners(): void {
    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.eventEmitter.emit('order:submit', this.formData);
    });

    [this.emailInput, this.phoneInput].forEach(input => {
      input.addEventListener('input', () => {
        this.eventEmitter.emit('order:step2:update', this.formData);
      });
    });
  }

  public render(): HTMLElement {
    return this.element;
  }

  public get formData(): IOrderForm {
    return {
      address: '',
      payment: '',
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim()
    };
  }

  public updateButtonState(enabled: boolean): void {
    this.nextButton.disabled = !enabled;
  }

  public showErrors(errors: string[]): void {
    this.errorsContainer.innerHTML = errors
      .map(e => `<span>${e}</span>`)
      .join('<br>');
  }

  public setEmail(email: string): void {
    this.emailInput.value = email;
  }

  public setPhone(phone: string): void {
    this.phoneInput.value = phone;
  }
}
