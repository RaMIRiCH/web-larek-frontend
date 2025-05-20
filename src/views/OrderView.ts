import { IOrderForm } from '../types';
import { openModal } from './Modal';

export class OrderView {
  private form: HTMLFormElement;
  private addressInput: HTMLInputElement;
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private selectedPayment = '';
  private nextButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    this.form = container.querySelector('form')!;
    this.addressInput = container.querySelector('input[name="address"]')!;
    this.paymentButtons = container.querySelectorAll('button[name="card"], button[name="cash"]');
    this.nextButton = container.querySelector('button[type="submit"]')!;

    this.nextButton.disabled = true;

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.selectedPayment = button.name;
        this.updatePaymentButtons();
        this.validateForm();
      });
    });

    this.addressInput.addEventListener('input', () => {
      this.validateForm();
    });
  }

  private updatePaymentButtons() {
    this.paymentButtons.forEach(button => {
      if (button.name === this.selectedPayment) {
        button.classList.add('button_selected');
      } else {
        button.classList.remove('button_selected');
      }
    });
  }

  get formData(): IOrderForm {
    return {
      address: this.addressInput.value,
      payment: this.selectedPayment,
      email: '',
      phone: '',
    };
  }

  validateForm() {
    const isValid = this.addressInput.value.trim() !== '' && this.selectedPayment !== '';
    this.nextButton.disabled = !isValid;
  }

  set onFormSubmit(callback: (data: IOrderForm) => void) {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!this.nextButton.disabled) {
        callback(this.formData);
      } else {
        this.form.reportValidity();
      }
    });
  }

  public showSuccessModal(totalPrice: number): void {
    const modal = document.getElementById('modal-container')!;
    const content = modal.querySelector('.modal__content')!;
    const template = document.getElementById('success') as HTMLTemplateElement;

    const success = template.content.cloneNode(true) as HTMLElement;
    const description = success.querySelector('.order-success__description')!;
    const closeButton = success.querySelector('.order-success__close') as HTMLButtonElement;

    description.textContent = `Списано ${totalPrice} синапсов`;

    closeButton.addEventListener('click', () => {
      modal.classList.remove('modal_active');
    });

    content.innerHTML = '';
    content.append(success);
    openModal(modal);
  }
}
