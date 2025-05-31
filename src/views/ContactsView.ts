import { IOrderForm } from '../types';

export class ContactsView {
  private template: HTMLTemplateElement;
  private element!: HTMLElement; // теперь инициализируется в render
  private form!: HTMLFormElement;
  private emailInput!: HTMLInputElement;
  private phoneInput!: HTMLInputElement;
  private nextButton!: HTMLButtonElement;

  private formSubmitCallback?: (data: IOrderForm) => void;

  constructor(template: HTMLTemplateElement) {
    this.template = template;
  }

  render(modalContentContainer: HTMLElement) {
    modalContentContainer.innerHTML = '';
    this.element = this.template.content.querySelector('form')!.cloneNode(true) as HTMLElement;
    modalContentContainer.appendChild(this.element);
    this.initElements();
  }

  private initElements() {
    this.form = this.element as HTMLFormElement;
    this.emailInput = this.form.querySelector('input[name="email"]')!;
    this.phoneInput = this.form.querySelector('input[name="phone"]')!;
    this.nextButton = this.form.querySelector('button[type="submit"]')!;

    this.nextButton.disabled = true;

    this.emailInput.addEventListener('input', () => this.validateForm());
    this.phoneInput.addEventListener('input', () => this.validateForm());

    if (this.formSubmitCallback) {
      this.attachSubmitListener();
    }
  }

  private attachSubmitListener() {
    if (!this.form) return;

    this.form.removeEventListener('submit', this.handleSubmit);
    this.form.addEventListener('submit', this.handleSubmit);
  }

  private handleSubmit = (e: Event) => {
    e.preventDefault();

    if (!this.form.checkValidity()) {
      this.form.reportValidity();
      return;
    }

    if (this.nextButton.disabled) return;

    this.formSubmitCallback && this.formSubmitCallback(this.formData);
  };

  open() {
    const modal = this.element.closest('.modal');
    if (modal) modal.classList.add('modal_active');
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

    this.nextButton.disabled = !(emailValid && phoneValid);
  }

  set onFormSubmit(callback: (data: IOrderForm) => void) {
    this.formSubmitCallback = callback;
    if (this.form) {
      this.attachSubmitListener();
    }
  }
}

