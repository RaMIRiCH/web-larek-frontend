export class Product {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public image: string,
		public category: string,
		public price: number
	) {}

	get formattedPrice(): string {
		return `${this.price} синапсов`;
	}
}
