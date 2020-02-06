class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product) {
    const productIndex = this.items.findIndex(
      item => item.product.id === product.id
    );

    if (productIndex > -1) {
      const item = this.items[productIndex];
      item.incrementQuantity();
    } else {
      items.push(product);
    }
  }

  update(product, quantity) {
    if (quantity < 0) {
      return;
    }

    const productIndex = this.items.findIndex(
      item => item.product.id === product.id
    );

    if (productIndex > -1) {
      const item = this.items[productIndex];

      if (quantity > 0) {
        item.quantity = quantity;
      } else {
        items.splice(productIndex, 1);
      }
    }
  }

  get items() {
    return items;
  }

  get numberOfItems() {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  get subtotal() {
    return items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );
  }

  clear() {
    this.items = [];
  }
}

module.export = ShoppingCart;
