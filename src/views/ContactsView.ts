import { IOrderForm } from '../types';

export class ContactsView {
  private form: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private nextButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    this.form = container.querySelector('form')!;
    this.emailInput = container.querySelector('input[name="email"]')!;
    this.phoneInput = container.querySelector('input[name="phone"]')!;
    this.nextButton = container.querySelector('button[type="submit"]')!;

    this.nextButton.disabled = true;

    this.emailInput.addEventListener('input', () => this.validateForm());
    this.phoneInput.addEventListener('input', () => this.validateForm());
  }

  get formData(): IOrderForm {
    return {
      address: '',
      payment: '',
      email: this.emailInput.value,
      phone: this.phoneInput.value,
    };
  }

  validateForm() {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.emailInput.value);
    const phoneDigits = this.phoneInput.value.replace(/\D/g, '');
    const phoneValid = phoneDigits.length >= 10;

    if (!emailValid) {
      this.emailInput.setCustomValidity('Введите корректный Email');
    } else {
      this.emailInput.setCustomValidity('');
    }

    if (!phoneValid) {
      this.phoneInput.setCustomValidity('Введите корректный телефон');
    } else {
      this.phoneInput.setCustomValidity('');
    }

    this.emailInput.reportValidity();
    this.phoneInput.reportValidity();

    this.nextButton.disabled = !(emailValid && phoneValid);
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
}
