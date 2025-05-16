export function openModal(modal: HTMLElement) {
  modal.classList.add('modal_active');
  document.body.classList.add('no-scroll');
}

export function closeModal(modal: HTMLElement) {
  modal.classList.remove('modal_active');
  document.body.classList.remove('no-scroll');
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
