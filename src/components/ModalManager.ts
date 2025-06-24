export class ModalManager {
  private modal: HTMLElement;
  private content: HTMLElement;
  private closeButton: HTMLElement;

  constructor() {
    const modal = document.getElementById('modal-container');
    if (!modal) throw new Error('[ModalManager] Элемент #modal-container не найден');
    this.modal = modal;

    const content = modal.querySelector('.modal__content');
    if (!content) throw new Error('[ModalManager] Элемент .modal__content не найден');
    this.content = content as HTMLElement;

    const close = modal.querySelector('.modal__close');
    if (!close) throw new Error('[ModalManager] Элемент .modal__close не найден');
    this.closeButton = close as HTMLElement;

    this.initListeners();
  }

  private initListeners(): void {
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    this.closeButton.addEventListener('click', () => {
      this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('modal_active')) {
        this.close();
      }
    });
  }

  public setContent(content: HTMLElement): void {
    this.clear();
    this.content.appendChild(content);
    this.modal.classList.add('modal_active');
    document.body.classList.add('no-scroll');
  }

  public open(content: HTMLElement): void {
    this.clear();
    this.content.appendChild(content);
    this.modal.classList.add('modal_active');
    document.body.classList.add('no-scroll');
  }

  public close(): void {
    this.modal.classList.remove('modal_active');
    document.body.classList.remove('no-scroll');
    this.clear();
  }

  public clear(): void {
    this.content.innerHTML = '';
  }
}

export const modalManager = new ModalManager();
