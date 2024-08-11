import { Character } from './character.js';
import { outputText } from './utils.js';

export class Enemy extends Character {
  constructor(name, description, currentRoom) {
    super(name, description, currentRoom);
    this.cooldown = 0;
    this.player = null;
    this.messageBuffer = [];
    this.hasMetPlayer = false;
    this.baseDamage = 5;
    this.respawnTime = 15000; //15 sec respawn time
  }

  setPlayer(player) {
    this.player = player;
  }

  followPlayer() {
    const shouldFollow = Math.random() < 0.3; // 30% chance to follow
    if (shouldFollow && this.hasMetPlayer && this.player && this.player.currentRoom !== this.currentRoom) {
      this.currentRoom = this.player.currentRoom;
      this.messageBuffer.push(`${this.name} follows you into the ${this.currentRoom.name}.`);
      toggleCombatButtons(); // Ensure buttons are updated when enemy follows
    }
  }

  alert(message) {
    if (this.player && this.player.currentRoom === this.currentRoom) {
      this.messageBuffer.push(message);
    }
  }

  rest() {
    const resetCooldown = () => {
      this.cooldown = 0;
      this.act();
    };
    setTimeout(resetCooldown, this.cooldown);
  }

  attack() {
    if (this.player && this.player.currentRoom === this.currentRoom) {
      this.messageBuffer.push(`${this.name} punches ${this.player.name}, dealing ${this.baseDamage} damage!`);
      this.player.applyDamage(this.baseDamage);
      this.cooldown += 8000;
    }
  }

  applyDamage(amount) {
    super.applyDamage(amount);
    if (this.health > 0) {
      this.cooldown += 1000;
    }
  }

  act() {
    if (this.health <= 0) {
        this.messageBuffer.push(`${this.name} is defeated.`);
        this.respawn();
    } else if (this.cooldown > 0) {
        this.rest();
    } else {
        if (this.player.currentRoom === this.currentRoom) {
            this.hasMetPlayer = true;
            this.tryToStealSandwich(); 
            this.attack();
        } else if (this.hasMetPlayer) {
            this.followPlayer();
        } else {
            this.scratchNose();
        }
        this.rest();
    }
}

  scratchNose() {
    this.cooldown += 1000;
    this.alert(`${this.name} scratches its nose`);
  }

  flushMessages() {
    while (this.messageBuffer.length > 0) {
      outputText(this.messageBuffer.shift());
    }
  }

  respawn() {
    setTimeout(() => {
        this.health = 100; // Reset health
        // Respawn in a random room instead of the player's current room
        const randomRoomIndex = Math.floor(Math.random() * Object.keys(this.player.currentRoom.world.rooms).length);
        const randomRoom = this.player.currentRoom.world.rooms[randomRoomIndex + 1]; // Assuming rooms are indexed from 1

        this.currentRoom = randomRoom;
        this.currentRoom.addEnemy(this); // Add goblin back to the room's enemy list
        this.messageBuffer.push(`${this.name} has appeared in the ${this.currentRoom.name}.`);
        toggleCombatButtons(); // Ensure buttons are updated when enemy respawns
    }, this.respawnTime);
}

  tryToStealSandwich() {
    const sandwich = this.player.getItemByName('sandwich');
    const shouldSteal = Math.random() < 0.4; // 40% chance to steal

    if (sandwich && shouldSteal) {
      this.health += 5; // Heal the goblin by 5 HP
      this.messageBuffer.push(`${this.name} snatches your sandwich and heals 5 HP!`);
    } else if (sandwich) {
      // If goblin doesn't steal, return the sandwich to inventory
      this.player.items.push(sandwich);
    }
  }
}







