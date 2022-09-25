import Paladin from "../images/characters/paladin.jpg";
import Mage from "../images/characters/mage.png";
import Viking from "../images/characters/viking.jpg";

const images = {
  Paladin,
  Mage,
  Viking,
};

const charFactory = (name) => ({
  name,
  image: () => <img src={images[name]} alt={name} />,
});

export const characters = {
  character1: {
    ...charFactory("Paladin"),
    health: 100,
    damage: 5,
    attackSpeed: 0.8,
    speed: 1,
  },
  character2: {
    ...charFactory("Mage"),
    health: 50,
    damage: 8,
    attackSpeed: 0.4,
    speed: 0.6,
  },
  character3: {
    ...charFactory("Viking"),
    health: 80,
    damage: 4,
    attackSpeed: 1.4,
    speed: 1.3,
  },
};
