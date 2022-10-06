import * as THREE from "three";
import { game } from "../../App";

export const getHTMLPosition = (piece) => {
  let pos = new THREE.Vector3();
  pos = pos.setFromMatrixPosition(piece.matrixWorld);
  pos.project(game.camera);

  let widthHalf = window.innerWidth / 2;
  let heightHalf = window.innerHeight / 2;

  pos.x = pos.x * widthHalf + widthHalf;
  pos.y = -(pos.y * heightHalf) + heightHalf;
  pos.z = 0;
  return pos;
};

export const healthBarFactory = ({ piece, character }) => {
  const healthBar = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 0.2, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  );
  healthBar.rotation.x = -0.4;
  healthBar.position.x = piece.position.x;
  healthBar.position.y = piece.position.y + 4.2;
  healthBar.position.z = piece.position.z;
  const healthBarBack = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 0.2, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xbb0000 })
  );
  healthBarBack.rotation.x = -0.4;
  healthBarBack.position.x = piece.position.x;
  healthBarBack.position.y = piece.position.y + 4.2;
  healthBarBack.position.z = piece.position.z - 0.01;
  game.scene.add(healthBar);
  game.scene.add(healthBarBack);
  piece.attach(healthBar);
  piece.attach(healthBarBack);
  healthBar.setHealth = (health) => {
    healthBar.scale.x = health / character.health;
  };
  return healthBar;
};

export const defendDamage = (damage, defence) => {
  const weight = (4 - Math.log((defence + 50) / 50)) / 4;
  return damage * weight;
};

export const damageManager = ({
  character,
  damage,
  health,
  piece,
  healthBar,
}) => {
  const reducedDamage = defendDamage(damage, character.defence);
  health -= reducedDamage;
  healthBar.setHealth(health);

  if (health <= 0) {
    console.log(character.name + " died!");
    health = 0;
    game.hexTiles[piece.row][piece.column].piece = undefined;
    game.pieces[piece.id] = undefined;
    game.scene.remove(piece);
  }

  const pos = getHTMLPosition(piece);

  const damageText = document.createElement("div");
  damageText.classList.add("damageTag");
  damageText.innerHTML = Math.round(reducedDamage);
  damageText.style.top = pos.y + "px";
  damageText.style.left = pos.x + "px";
  document.body.appendChild(damageText);
  game.damageParticles.push({
    element: damageText,
    startTime: Date.now(),
    random: Math.random() - 0.5,
    pos,
  });

  setTimeout(() => {
    damageText.remove();
    piece.damageParticles.pop();
  }, 500);

  return health;
};
