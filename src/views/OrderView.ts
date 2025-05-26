import { IOrderForm } from '../types';
import { openModal, closeModal } from './Modal';

export class OrderView {
  private template: HTMLTemplateElement;
  private container: HTMLElement;
  private form!: HTMLFormElement;
  private addressInput!: HTMLInputElement;
  private paymentButtons!: HTMLButtonElement[];
  private nextButton!: HTMLButtonElement;
  private onSubmitCallback: (data: IOrderForm) => void = () => {};

  constructor(template: HTMLTemplateElement) {
    this.template = template;
    this.container = document.createElement('div');
    this.container.className = 'modal';
  }

  public render(): void {
    const content = this.template.content.cloneNode(true) as DocumentFragment;

    this.container.innerHTML = `
      <div class="modal__container">
        <button class="modal__close" aria-label="Закрыть"></button>
        <div class="modal__content"></div>
      </div>
    `;
    const contentEl = this.container.querySelector('.modal__content')!;
    contentEl.appendChild(content);

    document.body.appendChild(this.container);

    this.form = this.container.querySelector<HTMLFormElement>('form[name="order"]')!;
    this.addressInput = this.container.querySelector<HTMLInputElement>('input[name="address"]')!;
    this.paymentButtons = Array.from(
      this.container.querySelectorAll<HTMLButtonElement>('button[name="card"], button[name="cash"]')
    );
    this.nextButton = this.container.querySelector<HTMLButtonElement>('button.order__button')!;

    this.initListeners();
  }

  public open(): void {
    openModal(this.container);
  }

  public close(): void {
    closeModal(this.container);
  }

  private initListeners(): void {
    this.paymentButtons.forEach(btn =>
      btn.addEventListener('click', () => {
        this.paymentButtons.forEach(b => b.classList.toggle('button_alt-active', b === btn));
        (this as any).selectedPayment = btn.name;
        this.updateFormState();
      })
    );
    this.addressInput.addEventListener('input', () => this.updateFormState());
    this.form.addEventListener('submit', e => this.handleSubmit(e));
    this.container.querySelector('.modal__close')!
      .addEventListener('click', () => this.close());
    this.updateFormState();
  }

  private updateFormState(): void {
    const validAddr = this.addressInput.value.trim().length > 5;
    const paymentSel = !!(this as any).selectedPayment;
    this.nextButton.disabled = !(validAddr && paymentSel);
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (this.nextButton.disabled) {
      alert('Проверьте данные');
      return;
    }
    const data: IOrderForm = {
      address: this.addressInput.value.trim(),
      payment: (this as any).selectedPayment,
      email: '',
      phone: '',
    };
    this.onSubmitCallback(data);
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
