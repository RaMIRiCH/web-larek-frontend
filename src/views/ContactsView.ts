import { IOrderForm } from '../types';
import { openModal, closeModal, clearModalContent } from './Modal';

export class ContactsView {
  private template: HTMLTemplateElement;
  private element!: HTMLElement;
  private form!: HTMLFormElement;
  private emailInput!: HTMLInputElement;
  private phoneInput!: HTMLInputElement;
  private nextButton!: HTMLButtonElement;
  private errorsContainer!: HTMLElement;

  private formSubmitCallback?: (data: IOrderForm) => void;
  public onInputChange?: () => void;

  constructor(template: HTMLTemplateElement) {
    this.template = template;
  }

  render(modalContentContainer: HTMLElement) {
    console.log('[ContactsView] render called');
    modalContentContainer.innerHTML = '';

    const content = this.template.content.cloneNode(true) as DocumentFragment;

    modalContentContainer.appendChild(content);

    this.element = modalContentContainer.querySelector('form')!;
    this.initElements();

    this.updateButtonState(false);
  }

  private initElements() {
    console.log('[ContactsView] initElements called');
    this.form = this.element as HTMLFormElement;
    this.emailInput = this.form.querySelector('input[name="email"]')!;
    this.phoneInput = this.form.querySelector('input[name="phone"]')!;
    this.nextButton = this.form.querySelector('button[type="submit"]')!;
    this.errorsContainer = this.form.querySelector('.form__errors')!;

    this.emailInput.addEventListener('input', () => {
      console.log('[ContactsView] email input changed');
      this.onInputChange?.();
    });

    this.phoneInput.addEventListener('input', () => {
      this.onInputChange?.();
    });

    this.form.addEventListener('submit', this.handleSubmit);
  }

  public showErrors(errors: string[]) {
    console.log('[ContactsView.showErrors] errors:', errors);
    this.errorsContainer.innerHTML = errors.length > 0
      ? errors.map(e => `<span>${e}</span>`).join('<br>')
      : '';
  }

  public handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log('[ContactsView] handleSubmit called');
    if (this.formSubmitCallback) {
      this.formSubmitCallback(this.formData);
    }
  };

    open(): void {
      openModal(this.element);
    }
  
    close(): void {
      closeModal(this.element);
      clearModalContent(this.element);
    }

    get email(): string {
      return this.emailInput?.value ?? '';
    }

    get phone(): string {
      return this.phoneInput?.value ?? '';
    }

  get formData(): IOrderForm {
    return {
      address: '',
      payment: '',
      email: this.emailInput.value,
      phone: this.phoneInput.value,
    };
  }

  updateButtonState(isEnabled: boolean): void {
    this.nextButton.disabled = !isEnabled;
  }

  set onFormSubmit(callback: (data: IOrderForm) => void) {
    this.formSubmitCallback = callback;
  }
}
