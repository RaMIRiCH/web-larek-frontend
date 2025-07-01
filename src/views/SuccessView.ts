import { EventEmitter } from '../components/base/events';

export class SuccessView {
  private element: HTMLElement;
  private descriptionElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(
    template: HTMLTemplateElement,
    private eventEmitter: EventEmitter
  ) {
    const content = template.content.cloneNode(true) as DocumentFragment;
    this.element = content.firstElementChild as HTMLElement;

    this.descriptionElement = this.element.querySelector('.order-success__description')!;
    this.closeButton = this.element.querySelector('.order-success__close')!;

    this.closeButton.addEventListener('click', () => {
      this.eventEmitter.emit('modal:close');
    });
  }

  public render(total: number): HTMLElement {
    this.descriptionElement.textContent = `Списано ${total} синапсов`;
    return this.element;
  }
}
