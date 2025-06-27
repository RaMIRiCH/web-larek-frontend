export class CatalogView {
  constructor(private container: HTMLElement) {}

  setItems(items: HTMLElement[]): void {
    this.container.replaceChildren(...items);
  }
}

