import { outputText } from './utils.js'

export class Character {
  constructor(name, description, currentRoom) {
    this.name = name;
    this.description = description;
    this.currentRoom = currentRoom;
    this.health = 100; // Default health
  }

  applyDamage(amount) {
    this.health -= amount;
    outputText(`${this.name} takes ${amount} damage. Remaining Health: ${this.health}.`);
    if (this.health <= 0) {
      this.die();
    }
  }

  isAlive() {
    return this.health > 0;
  }

  die() {
    outputText(`${this.name} has died.`);
  }
}
