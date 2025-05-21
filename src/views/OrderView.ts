/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IOrderForm } from '../types';
import { openModal } from './Modal';

export class OrderView {
  private form: HTMLFormElement;
  private addressInput: HTMLInputElement;
  private paymentButtons: HTMLButtonElement[];
  private selectedPayment: string = '';
  private nextButton: HTMLButtonElement;

  constructor(private container: HTMLElement) {
    this.selectedPayment = '';
    this.validateContainer();
    
    this.form = this.getElement<HTMLFormElement>('form[name="order"]', 'FORM_NOT_FOUND');
    this.addressInput = this.getElement<HTMLInputElement>('input[name="address"]', 'ADDRESS_INPUT_NOT_FOUND');
    this.paymentButtons = Array.from(this.container.querySelectorAll<HTMLButtonElement>(
      'button[name="card"], button[name="cash"]'
    ));
    this.nextButton = this.getElement<HTMLButtonElement>('button.order__button', 'SUBMIT_BUTTON_NOT_FOUND');

    this.validateElements();
    this.initializeEventListeners();
  }

  private validateContainer(): void {
    if (!(this.container instanceof HTMLElement)) {
      throw new Error('INVALID_CONTAINER_TYPE');
    }
    if (this.container.children.length === 0) {
      console.warn('CONTAINER_IS_EMPTY', this.container);
    }
  }

  private getElement<T extends HTMLElement>(selector: string, errorCode: string): T {
    const element = this.container.querySelector<T>(selector);
    if (!element) {
      throw new Error(`${errorCode}: ${selector}`);
    }
    return element;
  }

  private validateElements(): void {
    const checks = {
      FORM_ELEMENTS: this.form.elements.length > 0,
      PAYMENT_BUTTONS: this.paymentButtons.length >= 2,
    };

    if (!checks.FORM_ELEMENTS || !checks.PAYMENT_BUTTONS) {
      console.error('VALIDATION_FAILED:', checks);
      throw new Error('FORM_VALIDATION_FAILED');
    }
  }

  private initializeEventListeners(): void {
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => this.handlePaymentSelect(button));
    });

    this.addressInput.addEventListener('input', () => this.handleAddressInput());
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    this.updateFormState();
  }

  private handlePaymentSelect(button: HTMLButtonElement): void {
    this.selectedPayment = button.name;
    this.paymentButtons.forEach(btn => 
      btn.classList.toggle('button_selected', btn === button)
    );
    this.updateFormState();
  }

  private handleAddressInput(): void {
    this.updateFormState();
  }

  private updateFormState(): void {
    const isAddressValid = this.addressInput.value.trim().length > 5;
    const isPaymentSelected = !!this.selectedPayment;
    
    this.nextButton.disabled = !(isAddressValid && isPaymentSelected);
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    
    if (this.nextButton.disabled) {
      this.showValidationErrors();
      return;
    }

    const formData = this.getFormData();
    this.onSubmitCallback(formData);
  }

  private showValidationErrors(): void {
    const errors: string[] = [];
    
    if (!this.addressInput.value.trim()) {
      errors.push('Адрес доставки обязателен');
    }
    
    if (!this.selectedPayment) {
      errors.push('Выберите способ оплаты');
    }

    alert(`Ошибки:\n${errors.join('\n')}`);
  }

  getFormData(): IOrderForm {
    return {
      address: this.addressInput.value.trim(),
      payment: this.selectedPayment,
      email: '',
      phone: '',
    };
  }

  private onSubmitCallback: (data: IOrderForm) => void = () => {};

  set onFormSubmit(callback: (data: IOrderForm) => void) {
    this.onSubmitCallback = callback;
  }

  public showSuccessModal(totalPrice: number): void {
    const modal = document.getElementById('modal-container')!;
    const template = document.getElementById('success') as HTMLTemplateElement;
    
    modal.innerHTML = '';
    const content = template.content.cloneNode(true) as DocumentFragment;
    const description = content.querySelector('.order-success__description')!;
    
    description.textContent = `Списано ${totalPrice} синапсов`;
    modal.appendChild(content);
    
    openModal(modal);
  }
}