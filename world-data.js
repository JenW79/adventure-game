export default {
  rooms: [
    {
      id: 1,
      name: "Crossroad",
      description: "You find yourself at a bustling crossroad, where ancient cobblestones meet underfoot. The air is filled with the distant echo of a mystical chant carried by the wind. To the north, east, south, and west, mysterious paths beckon, each whispering promises of untold adventures.",
      exits: { n: 2, e: 3, w: 4, s: 5 }
    },
    {
      id: 2,
      name: "Northern Point",
      description: "The northern path opens up to a serene glade, where sunlight dances through the canopy, casting playful shadows on the forest floor. The smell of fresh pine fills your senses, and in the distance, the gentle murmur of a hidden brook calls you further into the unknown.",
      exits: { s: 1 }
    },
    {
      id: 3,
      name: "Eastern Point",
      description: "As you venture east, the landscape transforms into a rocky terrain, where jagged cliffs rise majestically against the sky. The path is treacherous, yet the thrill of discovery urges you onward. The rustle of unseen creatures among the rocks keeps you alert and curious.",
      exits: { w: 1 }
    },
    {
      id: 4,
      name: "Western Point",
      description: "Heading west, the path narrows between towering trees whose branches form a natural archway overhead. The forest is alive with the chatter of unseen animals and the scent of damp earth.",
      exits: { e: 1 }
    },
    {
      id: 5,
      name: "Southern Point",
      description: "You stand at the southern point, where the forest opens up to reveal a tranquil pond. The water is crystal clear, reflecting the sky and surrounded by a ring of reeds. The serene atmosphere invites contemplation.",
      exits: { n: 1 }
    }
  ],
  
  items: [
    {
      name: "Rock",
      description: "A sturdy rock",
      room: 4,
      isWeapon: true,
      damage: 6
    },
    {
      name: "Sandwich",
      description: "A tasty looking sandwich",
      room: 2,
      isFood: true
    },
    {
      name: "Sword",
      description: "A sharp sword",
      room: 1,
      isWeapon: true,
      damage: 15
    }
  ]
};

