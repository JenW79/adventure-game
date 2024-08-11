import { Item } from './item.js';

export class Food extends Item {
  constructor(name, description) {
    super(name, description);
    this.healthValue = 25; // Default health increase
  }
}
