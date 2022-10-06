import Paladin from "../images/characters/paladin.jpg";
import Mage from "../images/characters/mage.png";
import Viking from "../images/characters/viking.jpg";
import KingsGuard from "../images/characters/KingsGuard.jpg";

import PaladinObj from "../models/paladin/paladin8.glb";
import VikingObj from "../models/viking/viking.glb";

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
    model: PaladinObj,
    scale: 2.4,
    health: 1000,
    damage: 50,
    attackSpeed: 1,
    speed: 1.1,
    defence: 50,
    magicDefence: 50,
    range: 1,
  },
  Mage: {
    ...charFactory("Mage"),
    model: PaladinObj,
    scale: 1.4,
    health: 500,
    damage: 80,
    attackSpeed: 0.4,
    speed: 0.6,
    defence: 20,
    magicDefence: 40,
    range: 4,
  },
  Viking: {
    ...charFactory("Viking"),
    model: VikingObj,
    scale: 1.8,
    health: 800,
    damage: 40,
    attackSpeed: 1.2,
    speed: 1.3,
    defence: 20,
    magicDefence: 20,
    range: 1,
  },
  KingsGuard: {
    ...charFactory("KingsGuard"),
    model: PaladinObj,
    scale: 3,
    health: 1200,
    damage: 300,
    attackSpeed: 0.5,
    speed: 1,
    defence: 120,
    magicDefence: 120,
    range: 1,
  },
};
