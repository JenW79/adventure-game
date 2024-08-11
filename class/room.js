import { outputText } from './utils.js';
import { Item } from './item.js';
import { Food } from './food.js';
import { Weapon } from './weapon.js';
import { Enemy } from './enemy.js';

export class Room {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.exits = {};
    this.items = [];
    this.enemies = [];
    this.hasGenerated = false; // Flag to check if the room has been generated
  }

  printRoom() {
    this.generateContents(); // Ensure contents are generated when room is entered

    outputText(`<strong>${this.name}</strong>`);
    outputText(this.description);

    if (this.items.length > 0) {
      const itemDescriptions = this.items.map(item => `a ${item.name.toLowerCase()}`);
      const itemText = itemDescriptions.length > 1 ? itemDescriptions.join(", and ") : itemDescriptions[0];
      outputText(`There is ${itemText} in this room. Type 'take <item>' to pick it up.`);
  } else {
      outputText(`There are no items in this room.`);
  }

  console.log(`Items in room: ${this.items.length}`);
  console.log(`Enemies in room: ${this.enemies.length}`);

  

    outputText(this.getExitsString());
}


  getExits() {
    return Object.keys(this.exits);
  }

  getExitsString() {
    return `Exits: ${this.getExits().join(", ")}`;
  }

  connectRooms(direction, connectingRoom) {
    if (['n', 's', 'e', 'w'].indexOf(direction) < 0 || !connectingRoom) {
      throw new Error("Error: Invalid room connection");
    }
    this.exits[direction] = connectingRoom;
  }

  getRoomInDirection(direction) {
    return this.exits[direction];
  }

  getItemByName(itemName) {
    return this.items.find(item => item.name.toLowerCase() === itemName.toLowerCase());
  }

  generateContents() {
    if (!this.hasGenerated) {
      this.hasGenerated = true;

      // Randomly add items
      if (Math.random() < 0.5) this.addItem(new Item("Rock", "A sturdy rock"));
      if (Math.random() < 0.3) this.addItem(new Food("Sandwich", "A tasty looking sandwich"));
      if (Math.random() < 0.4) this.addItem(new Weapon("Sword", "A sharp sword", 15));

      // Randomly add enemies
      if (Math.random() < 0.5) {
        const goblin = new Enemy("Goblin", "A sneaky goblin", this);
        this.addEnemy(goblin);
      }
    }
  }

  removeItem(itemName) {
    const index = this.items.findIndex(item => item.name.toLowerCase() === itemName.toLowerCase());
    if (index !== -1) {
      return this.items.splice(index, 1)[0];
    }
    return null;
  }

  addItem(item) {
    this.items.push(item);
  }

  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  removeEnemy(enemyName) {
    this.enemies = this.enemies.filter(enemy => enemy.name !== enemyName);
  }
}
