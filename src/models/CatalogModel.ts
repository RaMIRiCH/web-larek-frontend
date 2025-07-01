import { Product } from "./Product";
import { EventEmitter } from "../components/base/events";
import { IProduct } from "../types";

export class CatalogModel {
  private products: Product[] = [];

  constructor(private events: EventEmitter) {}

  setProducts(data: IProduct[]): void {
    this.products = data.map(p => new Product(
      p.id, 
      p.title, 
      p.description ?? '', 
      p.image, 
      p.category, 
      p.price ?? null
    ));
    this.events.emit('catalog:changed', this.products);
  }

  getProducts(): Product[] {
    return this.products;
  }
}
