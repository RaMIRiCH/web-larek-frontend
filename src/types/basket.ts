import { IProduct } from '../types';
import { openModal } from './modal';

let currentBasket: IProduct[] = [];

const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement | null;

export function addToBasket(product: IProduct) {
    currentBasket.push(product);
    updateBasketCount();
}

export function getBasketCount() {
    return currentBasket.length;
}

export function removeFromBasket(id: string) {
    currentBasket = currentBasket.filter(item => item.id !== id);
    renderBasket();
    updateBasketCount();
}

export function updateBasketCount() {
    if (!basketCounter) return;
    basketCounter.textContent = getBasketCount().toString();
}

export function renderBasket() {
    const modal = document.getElementById('modal-container')!;
    const content = modal.querySelector('.modal__content')!;
    const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
    const itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;

    const basket = basketTemplate.content.cloneNode(true) as HTMLElement;
    const list = basket.querySelector('.basket__list')!;
    const priceEl = basket.querySelector('.basket__price')!;
    const orderButton = basket.querySelector('.basket__button') as HTMLButtonElement;

    const freshOrderButton = orderButton.cloneNode(true) as HTMLButtonElement;
        orderButton.replaceWith(freshOrderButton);

    freshOrderButton.addEventListener('click', () => {
        renderOrderForm();
    });

    if (currentBasket.length === 0) {
        list.innerHTML = `<li class="basket__empty">Корзина пуста</li>`;
        priceEl.textContent = '0 синапсов';

    freshOrderButton.disabled = true;
    } else {
        list.innerHTML = '';

    currentBasket.forEach((item, index) => {
        const el = itemTemplate.content.cloneNode(true) as HTMLElement;
        (el.querySelector('.basket__item-index') as HTMLElement).textContent = `${index + 1}`;
        (el.querySelector('.card__title') as HTMLElement).textContent = item.title;
        (el.querySelector('.card__price') as HTMLElement).textContent = `${item.price ?? 'Бесценно'} синапсов`;

        const btn = el.querySelector('.basket__item-delete') as HTMLButtonElement;
        btn.dataset.id = item.id;
        btn.addEventListener('click', () => removeFromBasket(item.id));

        list.append(el);
    });

    const total = currentBasket.reduce((acc, item) => acc + (item.price ?? 0), 0);
    priceEl.textContent = `${total} синапсов`;

    freshOrderButton.disabled = false;
    }

    content.innerHTML = '';
    content.append(basket);
    openModal(modal);
}


function isValidAddress(value: string): boolean {
    return /^[\u0400-\u04FF0-9\s.,-]+$/.test(value.trim());
}

export function renderOrderForm() {
    const modal = document.getElementById('modal-container')!;
    const content = modal.querySelector('.modal__content')!;
    const orderTemplate = document.getElementById('order') as HTMLTemplateElement;

    const fragment = orderTemplate.content.cloneNode(true) as DocumentFragment;
    const form = fragment.querySelector('form')!;
    const addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
    const errorContainer = form.querySelector('.form__errors') as HTMLElement;
    const nextButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;

    const paymentButtons = form.querySelectorAll('.order__buttons .button');
        let selectedPayment: 'card' | 'cash' | null = null;

    paymentButtons.forEach((btn) => {
        const button = btn as HTMLButtonElement;
        button.addEventListener('click', () => {
        paymentButtons.forEach(b => (b as HTMLButtonElement).classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        selectedPayment = button.name as 'card' | 'cash';
        });
    });

    nextButton.disabled = true;

    addressInput.addEventListener('input', () => {
        if (!isValidAddress(addressInput.value)) {
        errorContainer.textContent = 'Разрешены только кириллица, цифры и знаки препинания';
        nextButton.disabled = true;
        } else {
            errorContainer.textContent = '';
            nextButton.disabled = false;
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (isValidAddress(addressInput.value) && selectedPayment) {
            renderContactForm(addressInput.value.trim(), selectedPayment);
        } else {
            errorContainer.textContent = 'Пожалуйста, введите корректный адрес и выберите способ оплаты';
        }
    });

    content.innerHTML = '';
    content.append(fragment);
    openModal(modal);
}

export function renderContactForm(address: string, payment: string) {
    const modal = document.getElementById('modal-container')!;
    const content = modal.querySelector('.modal__content')!;
    const template = document.getElementById('contacts') as HTMLTemplateElement;
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const form = fragment.querySelector('form')!;

    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
    const errorContainer = form.querySelector('.form__errors') as HTMLElement;
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;

    function validateForm() {
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPhoneValid = /^\+7\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/.test(phone);

        if (!isEmailValid) {
            errorContainer.textContent = 'Введите корректный email';
            submitButton.disabled = true;
        } else if (!isPhoneValid) {
            errorContainer.textContent = 'Введите корректный номер телефона';
            submitButton.disabled = true;
        } else {
            errorContainer.textContent = '';
            submitButton.disabled = false;
        }
    }

    emailInput.addEventListener('input', validateForm);
    phoneInput.addEventListener('input', validateForm);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        validateForm();

        if (submitButton.disabled) return;

        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        const total = currentBasket.reduce((acc, item) => acc + (item.price ?? 0), 0);

        const orderData = {
          payment,
          address,
          total,
          email,
          phone,
          items: currentBasket.map((item) => item.id),
        };

    try {
        const response = await fetch('https://larek-api.nomoreparties.co/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });

    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }

    renderSuccessModal(total);
    } catch (err) {
        errorContainer.textContent = 'Не удалось отправить заказ. Попробуйте позже.';
        console.error('Ошибка отправки:', err);
    }
});

    content.innerHTML = '';
    content.append(form);
    openModal(modal);
}

export function renderSuccessModal(totalPrice: number) {
    const modal = document.getElementById('modal-container')!;
    const content = modal.querySelector('.modal__content')!;
    const template = document.getElementById('success') as HTMLTemplateElement;

    const success = template.content.cloneNode(true) as HTMLElement;
    const description = success.querySelector('.order-success__description')!;
    const closeButton = success.querySelector('.order-success__close') as HTMLButtonElement;

    description.textContent = `Списано ${totalPrice} синапсов`;

    closeButton.addEventListener('click', () => {
        currentBasket.length = 0;
        updateBasketCount();
        modal.classList.remove('modal_active');
    });

    content.innerHTML = '';
    content.append(success);
    openModal(modal);
}
