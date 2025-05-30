/* eslint-disable @typescript-eslint/no-empty-function */
import { IOrderForm } from '../types';
import { openModal, closeModal } from './Modal';

export class OrderView {
  private template: HTMLTemplateElement;
  private container: HTMLElement;
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
  }

  public render(): void {
    this.contentElement.innerHTML = '';
    const content = this.template.content.cloneNode(true) as DocumentFragment;
    this.contentElement.appendChild(content);

    this.form = this.contentElement.querySelector<HTMLFormElement>('form[name="order"]')!;
    this.addressInput = this.contentElement.querySelector<HTMLInputElement>('input[name="address"]')!;
    this.paymentButtons = Array.from(
      this.contentElement.querySelectorAll<HTMLButtonElement>('button[name="card"], button[name="cash"]')
    );
    this.nextButton = this.contentElement.querySelector<HTMLButtonElement>('button.order__button')!;

    this.initListeners();
  }

  public open(): void {
    document.body.classList.add('modal-open');
    openModal(this.container);
  }

  public close(): void {
    closeModal(this.container);
  }

  private initListeners(): void {
    this.paymentButtons.forEach(btn =>
      btn.addEventListener('click', () => {
        this.paymentButtons.forEach(b => b.classList.toggle('button_alt-active', b === btn));
        this.selectedPayment = btn.name;  // <-- здесь
        this.updateFormState();
      })
    );
    this.addressInput.addEventListener('input', () => this.updateFormState());
    this.form.addEventListener('submit', e => this.handleSubmit(e));
    this.container.querySelector('.modal__close')!
      .addEventListener('click', () => this.close());
    this.updateFormState();
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (this.nextButton.disabled) {
      alert('Проверьте данные');
      return;
    }
    const data: IOrderForm = {
      address: this.addressInput.value.trim(),
      payment: this.selectedPayment ?? '',
      email: '',
      phone: '',
    };
    this.onSubmitCallback(data);
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
