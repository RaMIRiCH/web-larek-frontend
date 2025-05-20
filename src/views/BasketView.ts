import { Product } from '../models/Product';

export type BasketViewCallbacks = {
	onRemoveItem?: (productId: string) => void;
	onSubmit?: () => void;
};

export class BasketView {
	private container: HTMLElement;
	private listEl: HTMLElement;
	private totalEl: HTMLElement;
	private buttonEl: HTMLButtonElement;
	private callbacks: BasketViewCallbacks = {};

	constructor(template: HTMLTemplateElement) {
		const content = template.content.cloneNode(true) as HTMLElement;
		this.container = content.querySelector('.basket')!;
		this.listEl = this.container.querySelector('.basket__list')!;
		this.totalEl = this.container.querySelector('.basket__price')!;
		this.buttonEl = this.container.querySelector('.basket__button')!;

		this.buttonEl.addEventListener('click', () => {
			this.callbacks.onSubmit?.();
		});
	}

	renderItems(items: Product[]): void {
		this.listEl.innerHTML = '';
		items.forEach((item) => {
			const li = document.createElement('li');
			li.classList.add('basket__item');
			li.innerHTML = `
				<span>${item.title}</span>
				<span>${item.formattedPrice}</span>
				<button class="basket__item-delete" data-id="${item.id}" aria-label="Удалить"></button>
			`;
			this.listEl.appendChild(li);
		});

		this.listEl.querySelectorAll<HTMLButtonElement>('.basket__item-delete').forEach((btn) => {
			btn.addEventListener('click', () => {
				const id = btn.dataset.id;
				if (id) this.callbacks.onRemoveItem?.(id);
			});
		});
	}

	updateTotal(price: number): void {
		this.totalEl.textContent = `${price} синапсов`;
	}

	get element(): HTMLElement {
		return this.container;
	}

	setCallbacks(callbacks: BasketViewCallbacks): void {
		this.callbacks = callbacks;
	}
}