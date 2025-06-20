import { IOrder } from '../types/index';

export class OrderModel {
  private address: string = '';
  private payment: string = '';
  private email: string = '';
  private phone: string = '';

  setAddress(address: string): void {
    this.address = address.trim();
  }

  setPayment(payment: string): void {
    this.payment = payment;
  }

  setEmail(email: string): void {
    this.email = email.trim();
  }

  setPhone(phone: string): void {
    this.phone = phone.trim();
  }

  validateStep1(): string[] {
    const errors: string[] = [];

    if (!this.payment) {
      errors.push('Выберите способ оплаты');
    }

    if (this.address.length < 6) {
      errors.push('Адрес должен быть не короче 6 символов');
    }

    return errors;
  }

  validateStep2(): string[] {
    const errors: string[] = [];

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    if (!emailValid) {
      errors.push('Введите корректный Email');
    }

    const phoneValid = this.phone.replace(/\D/g, '');
    if (phoneValid.length < 10) {
      errors.push('Введите корректный телефон');
    }

    return errors;
  }

  getData(): IOrder {
    return {
      address: this.address,
      payment: this.payment,
      email: this.email,
      phone: this.phone,
    };
  }

  clear(): void {
    this.address = '';
    this.payment = '';
    this.email = '';
    this.phone = '';
  }
}
