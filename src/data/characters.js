import Paladin from "../images/characters/paladin.jpg";
import Mage from "../images/characters/mage.png";
import Viking from "../images/characters/viking.jpg";
import KingsGuard from "../images/characters/KingsGuard.jpg";

const images = {
  Paladin,
  Mage,
  Viking,
  KingsGuard,
};

const charFactory = (name) => ({
  name,
  image: () => <img src={images[name]} alt={name} />,
  imagePath: images[name],
});

export const characters = {
  Paladin: {
    ...charFactory("Paladin"),
    health: 100,
    damage: 5,
    attackSpeed: 1.1,
    speed: 1.1,
    defence: 50,
    magicDefence: 50,
    range: 1,
  },
  Mage: {
    ...charFactory("Mage"),
    health: 50,
    damage: 8,
    attackSpeed: 0.4,
    speed: 0.6,
    defence: 20,
    magicDefence: 40,
    range: 4,
  },
  Viking: {
    ...charFactory("Viking"),
    health: 80,
    damage: 4,
    attackSpeed: 1.4,
    speed: 1.3,
    defence: 30,
    magicDefence: 10,
    range: 1,
  },
  KingsGuard: {
    ...charFactory("KingsGuard"),
    health: 120,
    damage: 30,
    attackSpeed: 0.6,
    speed: 1.3,
    defence: 80,
    magicDefence: 80,
    range: 1,
  },
};
