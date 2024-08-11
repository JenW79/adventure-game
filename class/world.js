import { Room } from './room.js';
import { Item } from './item.js';
import { Food } from './food.js';
import { Weapon } from './weapon.js';

export class World {
  constructor() {
    this.rooms = {};
  }

  loadWorld(worldData) {
    const roomList = worldData.rooms;
    const itemList = worldData.items;

    // Check if roomList and itemList are properly initialized
    if (!roomList || !Array.isArray(roomList)) {
      console.error('Room list is missing or not an array.');
      return;
    }

    if (!itemList || !Array.isArray(itemList)) {
      console.warn('Item list is missing or not an array.');
    }

    // Instantiate new room objects
    for (let i = 0; i < roomList.length; i++) {
      const roomData = roomList[i];
      const newRoom = new Room(roomData.name, roomData.description);
      this.rooms[roomData.id] = newRoom;
    }

    // Connect rooms by ID
    for (let i = 0; i < roomList.length; i++) {
      const roomID = roomList[i].id;
      const roomConnections = roomList[i].exits;

      for (const direction in roomConnections) {
        const connectedRoomID = roomConnections[direction];
        const roomToConnect = this.rooms[connectedRoomID];
        this.rooms[roomID].connectRooms(direction, roomToConnect);
      }
    }

    // Instantiate items using data stored in the itemList variable
    if (itemList) {
      for (let i = 0; i < itemList.length; i++) {
        const itemData = itemList[i];
        let newItem;

        if (itemData.isFood) {
          newItem = new Food(itemData.name, itemData.description);
        } else if (itemData.isWeapon) {
          newItem = new Weapon(itemData.name, itemData.description, itemData.damage || 10);
        } else {
          newItem = new Item(itemData.name, itemData.description);
        }

        const itemRoom = this.rooms[itemData.room];
        if (itemRoom) {
          itemRoom.addItem(newItem);
        } else {
          console.warn(`Room ID ${itemData.room} not found for item ${itemData.name}`);
        }
      }
    }
  }

  setPlayer(player) {
    this.player = player;
  }

  addEnemy(enemy) {
    const room = enemy.currentRoom;
    if (room) {
      room.addEnemy(enemy);
    }
  }
}

