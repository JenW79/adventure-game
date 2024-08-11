import { Item } from './item.js';

export class Weapon extends Item {
  constructor(name, description, damage) {
    super(name, description);
    this.damage = damage;
  }
}
