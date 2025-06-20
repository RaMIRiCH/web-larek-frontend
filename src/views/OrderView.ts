/* eslint-disable @typescript-eslint/no-empty-function */
import { IOrderForm } from '../types';
import { openModal, closeModal, clearModalContent } from './Modal';

export class OrderView {
  private template: HTMLTemplateElement;
  private container: HTMLElement;
  private element!: HTMLElement;
  private errorsContainer: HTMLElement;
  private contentElement: HTMLElement;
  private selectedPayment: string | null = null;
  private form!: HTMLFormElement;
  private addressInput!: HTMLInputElement;
  private paymentButtons!: HTMLButtonElement[];
  private nextButton!: HTMLButtonElement;
  private onSubmitCallback: (data: IOrderForm) => void = () => {};

  constructor(template: HTMLTemplateElement) {
    this.template = template;
    this.container = document.getElementById('modal-container')!;
    this.contentElement = this.container.querySelector('.modal__content')!;
    this.element = this.container;
  }

  public render(): void {
    this.contentElement.innerHTML = '';
    const content = this.template.content.cloneNode(true) as DocumentFragment;
    this.contentElement.appendChild(content);

    this.errorsContainer = this.contentElement.querySelector('.form__errors')!;
    this.form = this.contentElement.querySelector<HTMLFormElement>('form[name="order"]')!;
    this.addressInput = this.contentElement.querySelector<HTMLInputElement>('input[name="address"]')!;
    this.paymentButtons = Array.from(
      this.contentElement.querySelectorAll<HTMLButtonElement>('button[name="card"], button[name="cash"]')
    );
    this.nextButton = this.contentElement.querySelector<HTMLButtonElement>('button.order__button')!;

    this.initListeners();
  }

  open(): void {
    openModal(this.element);
  }

  close(): void {
    closeModal(this.element);
    clearModalContent(this.element);
  }

  private handleSubmit(e: Event): void {
    e.preventDefault();
    this.onSubmitCallback({
      address: this.addressInput.value,
      payment: this.selectedPayment!,
      email: '',
      phone: '',
    });
  }

  private initListeners(): void {
    this.paymentButtons.forEach(btn =>
      btn.addEventListener('click', () => {
        this.paymentButtons.forEach(b => b.classList.toggle('button_alt-active', b === btn));
        this.selectedPayment = btn.name;
        this.updateFormState();
      })
    );
    this.addressInput.addEventListener('input', () => this.updateFormState());
    this.form.addEventListener('submit', e => this.handleSubmit(e));
    this.container.querySelector('.modal__close')!
      .addEventListener('click', () => this.close());
    this.updateFormState();
  }
  
  public showErrors(errors: string[]): void {
    this.errorsContainer.innerHTML = errors.map(e => `<span>${e}</span>`).join('<br>')
  }

  private updateFormState(): void {
    const validAddr = this.addressInput.value.trim().length > 5;
    const paymentSel = !!this.selectedPayment;
    this.nextButton.disabled = !(validAddr && paymentSel);
  }

  set onFormSubmit(cb: (data: IOrderForm) => void) {
    this.onSubmitCallback = cb;
  }

  public showSuccessModal(totalPrice: number): void {
    const modal = document.getElementById('modal-container')!;
    const template = document.getElementById('success') as HTMLTemplateElement;
    modal.innerHTML = '';
    const content = template.content.cloneNode(true) as DocumentFragment;
    content.querySelector('.order-success__description')!
      .textContent = `Списано ${totalPrice} синапсов`;
    modal.appendChild(content);
    openModal(modal);
  }
}
