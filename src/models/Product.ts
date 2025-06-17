export class Product {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public image: string,
		public category: string,
		public price: number | null,
	) {
		if (price === null) {
			this.price = null;
		}
	}

	get formattedPrice(): string {
		return this.price === null ? 'Бесценно' : `${this.price} синапсов`;
	}
}
