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

	getItemIds(): string[] {
		return this.items.map(item => item.id);
	}

	getTotalPrice(): number | null {
		if (this.items.length === 0) return 0;

		if (this.items.some(item => item.price === null)) {
			return null;
		}

		return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
	}

	canOrder(): boolean {
    	return this.items.length > 0 && this.items.every(item => item.price !== null);
  	}

	isEmpty(): boolean {
    	return this.items.length === 0;
  	}

	hasPricelessItems(): boolean {
		return this.items.some(item => item.price === null);
	}

	isOrderAvailable(): boolean {
		return !this.isEmpty() && !this.hasPricelessItems();
	}

	public contains(productId: string): boolean {
		return this.items.some(item => item.id === productId);
	}
}
