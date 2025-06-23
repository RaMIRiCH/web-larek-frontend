import { IOrderForm } from '../types';
import { openModal, closeModal, clearModalContent } from './Modal';

export class OrderView {
  private template: HTMLTemplateElement;
  private container: HTMLElement;
  private contentElement: HTMLElement;
  private element!: HTMLElement;
  private form!: HTMLFormElement;
  private addressInput!: HTMLInputElement;
  private paymentButtons!: HTMLButtonElement[];
  private nextButton!: HTMLButtonElement;
  private errorsContainer!: HTMLElement;

  public onInputChange?: (data: { address: string; payment: string | null }) => void;
  public onFormSubmit?: (data: IOrderForm) => void;

  private selectedPayment: string | null = null;

  constructor(template: HTMLTemplateElement) {
    this.template = template;
    this.container = document.getElementById('modal-container')!;
    this.contentElement = this.container.querySelector('.modal__content')!;
  }

  render(): void {
    this.contentElement.innerHTML = '';
    const content = this.template.content.cloneNode(true) as DocumentFragment;
    this.contentElement.appendChild(content);

    this.element = this.container;
    this.form = this.contentElement.querySelector<HTMLFormElement>('form[name="order"]')!;
    this.addressInput = this.contentElement.querySelector<HTMLInputElement>('input[name="address"]')!;
    this.paymentButtons = Array.from(
      this.contentElement.querySelectorAll<HTMLButtonElement>('button[name="card"], button[name="cash"]')
    );
    this.nextButton = this.contentElement.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    this.errorsContainer = this.contentElement.querySelector<HTMLElement>('.form__errors')!;

    this.initListeners();
  }

  private initListeners(): void {
    this.paymentButtons.forEach((btn) =>
      btn.addEventListener('click', () => {
        this.selectedPayment = btn.name;
        this.updatePaymentButtons();
        this.emitInputChange();
      })
    );

    this.addressInput.addEventListener('input', () => this.emitInputChange());

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onFormSubmit?.({
        address: this.addressInput.value,
        payment: this.selectedPayment!,
        email: '',
        phone: '',
      });
    });

    this.container.querySelector('.modal__close')?.addEventListener('click', () => this.close());
  }

  private emitInputChange(): void {
    this.onInputChange?.({
      address: this.addressInput.value,
      payment: this.selectedPayment,
    });
  }

  private updatePaymentButtons(): void {
    this.paymentButtons.forEach((btn) => {
      btn.classList.toggle('button_alt-active', btn.name === this.selectedPayment);
    });
  }

  public showErrors(errors: string[]): void {
    this.errorsContainer.innerHTML = errors.map((e) => `<span>${e}</span>`).join('<br>');
  }

  public updateButtonState(enabled: boolean): void {
    this.nextButton.disabled = !enabled;
  }

  public open(): void {
    openModal(this.element);
  }

  public close(): void {
    closeModal(this.element);
    clearModalContent(this.element);
  }
}
