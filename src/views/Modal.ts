function findModal(element: HTMLElement): HTMLElement | null {
  return element.closest('.modal');
}

export function openModal(elementInsideModal: HTMLElement): void {
  const modal = findModal(elementInsideModal);
  if (!modal) return;
  modal.classList.add('modal_active');
  document.body.classList.add('no-scroll');
}

export function closeModal(elementInsideModal: HTMLElement): void {
  const modal = findModal(elementInsideModal);
  if (!modal) return;
  modal.classList.remove('modal_active');
  document.body.classList.remove('no-scroll');
  const content = modal.querySelector('.modal__content');
  if (content) content.innerHTML = '';
}

export function clearModalContent(modal: HTMLElement) {
  const content = modal.querySelector('.modal__content');
  if (content) content.innerHTML = '';
}

export function initModalCloseHandlers() {
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal as HTMLElement);
    });

    modal.querySelector('.modal__close')?.addEventListener('click', () => {
      closeModal(modal as HTMLElement);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.modal_active').forEach((modal) => {
        closeModal(modal as HTMLElement);
      });
    }
  });
}
