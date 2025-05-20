import { Product } from './Product';

export class BasketModel {
	private items: Product[] = [];

	addItem(product: Product): void {
		if (!this.items.find((item) => item.id === product.id)) {
			this.items.push(product);
		}
	}

	removeItem(productId: string): void {
		this.items = this.items.filter((item) => item.id !== productId);
	}

	clear(): void {
		this.items = [];
	}

	getItems(): Product[] {
		return this.items;
	}

	getTotalPrice(): number {
		return this.items.reduce((sum, item) => sum + item.price, 0);
	}
}