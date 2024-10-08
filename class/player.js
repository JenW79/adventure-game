import { Character } from './character.js';
import { Food } from './food.js';
import { Weapon } from './weapon.js';
import { outputText } from './utils.js';

export class Player extends Character {
  constructor(name, startingRoom) {
    super(name, "Player character", startingRoom);
    this.items = [];
    this.health = 100
    this.punchDamage = 5; // Base punch damage
    this.maxItems = 10;
  }
    
  checkHealth() {
    outputText(`Your current health is ${this.health}.`);
  }

  move(direction) {
    const nextRoom = this.currentRoom.getRoomInDirection(direction);
    if (nextRoom) {
      this.currentRoom = nextRoom;
      nextRoom.printRoom(this);
    } else {
      outputText("You cannot move in that direction");
    }
  }

  printInventory() {
    if (this.items.length === 0) {
      outputText(`${this.name} is not carrying anything.`);
    } else {
      outputText(`${this.name} is carrying:`);
      const itemCounts = {};
      this.items.forEach(item => {
        if (itemCounts[item.name]) {
          itemCounts[item.name]++;
        } else {
          itemCounts[item.name] = 1;
        }
      });

      for (const [name, count] of Object.entries(itemCounts)) {
        outputText(`  ${name}${count > 1 ? ` (x${count})` : ''}`);
      }
    }
  }

  takeItem(itemName) {
    const item = this.currentRoom.getItemByName(itemName);

    if (item) {
        if (this.items.length >= this.maxItems) {
            outputText("Your inventory is full. You can't carry any more items.");
        } else {
            // Check for sword and rock conflict
            const hasSword = this.items.some(i => i.name.toLowerCase() === 'sword');
            const hasRock = this.items.some(i => i.name.toLowerCase() === 'rock');

            if (item.name.toLowerCase() === 'sword' && hasRock) {
                this.dropItem('rock');
                outputText("You drop the rock to pick up the sword.");
            } else if (item.name.toLowerCase() === 'rock' && hasSword) {
                this.dropItem('sword');
                outputText("You drop the sword to pick up the rock.");
            }

            this.items.push(item);
            this.currentRoom.removeItem(itemName);
            outputText(`You took ${item.name}`);
        }
    } else {
        outputText(`${itemName} is not in the room.`);
    }
}


  dropItem(itemName) {
    const item = this.getItemByName(itemName);
    if (item) {
      this.currentRoom.addItem(item);
      outputText(`You dropped ${item.name}.`);
    } else {
      outputText(`You don't have ${itemName}.`);
    }
  }

  eatItem(itemName) {
    const itemIndex = this.items.findIndex(item => item.name.toLowerCase() === itemName.toLowerCase());
    if (itemIndex !== -1) {
      const item = this.items[itemIndex];
      if (item instanceof Food) {
        this.items.splice(itemIndex, 1); // Remove the food item from inventory
        this.health += item.healthValue || 10; // Increase health by item's health value or default to 10
        outputText(`You ate ${item.name}. Your health is now ${this.health}.`);
      } else {
        outputText(`${item.name} is not food and cannot be eaten.`);
      }
    } else {
      outputText(`You do not have ${itemName} in your inventory.`);
    }
  }

  getItemByName(name) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.name.toLowerCase() === name.toLowerCase()) {
        return this.items.splice(i, 1)[0]; // Splice removes and returns item
      }
    }
    return null;
  }

  attack(enemy) {
    const weapon = this.items.find(item => item instanceof Weapon);
    let totalDamage;

    if (weapon) {
      totalDamage = weapon.damage;
      outputText(`You attack ${enemy.name} with ${weapon.name}, dealing ${totalDamage} damage.`);
    } else {
      totalDamage = this.punchDamage;
      outputText(`You punch ${enemy.name}, dealing ${totalDamage} damage.`);
    }

    enemy.applyDamage(totalDamage);
  }

  die() {
    outputText("You have died. Game over.");
    document.getElementById('input').disabled = true; // Disable input to end the game
  }
}

