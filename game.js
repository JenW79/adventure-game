
import { Player } from './class/player.js';
import { Enemy } from './class/enemy.js';
import { World } from './class/world.js';
import { Room } from './class/room.js'; 
import { outputText } from './class/utils.js';

import worldData from './world-data.js';

// Define game variables and imports
const gameWorld = new World();
let player;

// Modify the startGame function to work with HTML inputs
function startGame() {
    document.getElementById('input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            processCommand(event.target.value);
            event.target.value = '';
        }
    });

    // Set up combat buttons
    document.getElementById('attack-button').addEventListener('click', () => attackEnemy());
    document.getElementById('run-button').addEventListener('click', () => runAway());

    // Initialize game world and player
    gameWorld.loadWorld(worldData);
    player = new Player('Player', gameWorld.rooms[1]);
    gameWorld.setPlayer(player);

    // Create enemies
    const goblin = new Enemy('Goblin', 'A sneaky goblin', gameWorld.rooms[3]);
    goblin.setPlayer(player);
    goblin.act();
    gameWorld.rooms[3].addEnemy(goblin);

    // Print initial room
    player.currentRoom.printRoom();

    // Show initial game instructions
    printHelp();
}

// Make the startGame function available globally
window.startGame = startGame;

// Modify this function to display the help text in the HTML output
function printHelp() {
    outputText("Controls:");
    outputText("  Type 'l' to look around");
    outputText("  Type 'i' to check your inventory");
    outputText("  Type 'health' to check your health");
    outputText("  Type 'take <item>' to take an item");
    outputText("  Type 'drop <item>' to drop an item");
    outputText("  Type 'eat <item>' to eat a food item");
    outputText("  Type 'n', 's', 'e', 'w' to move");
    outputText("  Use buttons to 'hit <enemy>' to attack an enemy or run away");
    outputText("  Type 'q' to quit");
}

// Modify processCommand function to work with HTML inputs
function processCommand(input) {
    const cmd = input.toLowerCase().trim();
    const parts = cmd.split(/\s+/);
    const command = parts[0];
    const argument = parts.slice(1).join(" ");

    switch (command) {
        // Handling for single-word commands
        case 'l':
        case 'i':
        case 'health':
        case 'h':
            
            handleSingleWordCommands(command);
            break;

        // Commands that require an argument
        case 'take':
        case 'drop':
        case 'eat':
            if (argument) {
                handleItemCommands(command, argument);
            } else {
                outputText(`Please specify an item to ${command}.`);
            }
            break;

        // Direction commands
        case 'n':
        case 's':
        case 'e':
        case 'w':
            player.move(command);
            break;

        case 'q':
            outputText("Game over. Thanks for playing!");
            document.getElementById('input').disabled = true;
            break;

        default:
            outputText("Invalid command. Type 'h' for help.");
            break;
    }

    updateGameState();
}

function handleSingleWordCommands(command) {
    switch (command) {
        case 'l': player.currentRoom.printRoom(); break;
        case 'i': player.printInventory(); break;
        case 'health': player.checkHealth(); break;
        case 'h': printHelp(); break;
    }
}

function handleItemCommands(command, argument) {
    switch (command) {
        case 'take': player.takeItem(argument); break;
        case 'drop': player.dropItem(argument); break;
        case 'eat': player.eatItem(argument); break;
    }
}

function updateGameState() {
    toggleCombatButtons();
    if (player.health <= 0) {
        player.die();
    }
    if (player.currentRoom.enemies.length > 0) {
        player.currentRoom.enemies.forEach(enemy => enemy.flushMessages());
    }
}

// Function to attack the current enemy
function attackEnemy() {
    const currentEnemy = player.currentRoom.enemies[0]; // Assume attacking the first enemy in the room
    if (currentEnemy) {
        player.attack(currentEnemy);
        if (currentEnemy.isAlive()) {
            currentEnemy.attack();
        } else {
            outputText(`${currentEnemy.name} is defeated!! Nice Work. Eat a Sandwich to get health back.`);
            player.currentRoom.removeEnemy(currentEnemy.name);
            toggleCombatButtons(); // Hide combat buttons if no more enemies
        }
    } else {
        outputText("No enemies to attack here.");
    }
}

// Function to run away from the current room
function runAway() {
    const availableDirections = player.currentRoom.getExits();
    if (availableDirections.length > 0) {
        const direction = availableDirections[0]; // Move to the first available exit
        player.move(direction);
        toggleCombatButtons();
        outputText(`You ran away to the ${direction}.`);

        player.currentRoom.enemies.forEach(enemy => {
            enemy.cooldown = 0; // Reset enemy cooldowns
            enemy.hasMetPlayer = false; // Ensure enemies do not follow immediately
        });

        toggleCombatButtons(); // Hide combat buttons after moving
    } else {
        outputText("There's nowhere to run!");
    }
}




// Toggle visibility of combat buttons based on game state
function toggleCombatButtons() {
    const combatButtons = document.getElementById('combat-buttons');
    const hasEnemies = player.currentRoom.enemies && player.currentRoom.enemies.length > 0;
    combatButtons.style.display = hasEnemies ? 'block' : 'none';
}

window.processCommand = processCommand;

// Override room's printRoom to use HTML
Room.prototype.printRoom = function () {
    outputText(`<strong>${this.name}</strong>`);
    outputText(this.description);
    if (this.items.length > 0) {
        outputText(`Items: ${this.items.map(item => item.name).join(", ")}`);
    }
    outputText(this.getExitsString());
};

// Start the game automatically on page load
window.onload = startGame;
