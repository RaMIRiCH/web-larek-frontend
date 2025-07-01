import { IOrderForm } from '../types';
import { EventEmitter } from '../components/base/events';

export class OrderView {
  private element: HTMLFormElement;
  private addressInput: HTMLInputElement;
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private submitButton: HTMLButtonElement;
  private errorContainer: HTMLElement;

  constructor(
    private template: HTMLTemplateElement,
    private eventEmitter: EventEmitter
  ) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    this.element = fragment.querySelector('form')!;

    // Инициализируем элементы
    this.addressInput = this.element.querySelector('input[name="address"]')!;
    this.paymentButtons = this.element.querySelectorAll('.button_alt');
    this.submitButton = this.element.querySelector('button[type="submit"]')!;
    this.errorContainer = this.element.querySelector('.form__errors')!;

    this.initListeners();
  }

  private initListeners(): void {
    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.eventEmitter.emit('order:step1:submit');
    });

    this.addressInput.addEventListener('input', () => {
      this.eventEmitter.emit('order:step1:update', this.formData);
    });

    this.paymentButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.paymentButtons.forEach(b =>
          b.classList.toggle('button_alt-active', b === btn)
        );
        this.eventEmitter.emit('order:step1:update', this.formData);
      });
    });
  }

  public get formData(): IOrderForm {
    const selected = Array.from(this.paymentButtons).find(b =>
      b.classList.contains('button_alt-active')
    );
    return {
      address: this.addressInput.value.trim(),
      payment: selected?.getAttribute('name') || '',
      email: '',
      phone: ''
    };
  }

  public updateButtonState(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }

  public showErrors(errors: string[]): void {
    this.errorContainer.innerHTML = errors
      .map(e => `<span>${e}</span>`)
      .join('<br>');
  }

  public render(): HTMLElement {
    return this.element;
  }
}
