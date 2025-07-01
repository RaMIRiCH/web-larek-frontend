import { EventEmitter } from '../components/base/events';

export class PageView {
  private basketButton: HTMLElement;

  constructor(private eventEmitter: EventEmitter) {
    this.basketButton = document.querySelector('.header__basket')!;

    this.basketButton.addEventListener('click', () => {
      this.eventEmitter.emit('basket:open');
    });
  }
}
