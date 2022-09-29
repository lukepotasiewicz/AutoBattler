import * as THREE from "three";
import { game } from "../App";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { characters } from "../data/characters";

const teamColors = {
  0: 0x006699,
  1: 0xff4400,
};

export const boardPiece = (row, column, character, team = 0) => {
  // piece piece
  const piece = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.4, 0.3, 20),
    new THREE.MeshStandardMaterial({
      color: teamColors[team],
      transparent: true,
      opacity: 0.5,
    })
  );
  piece.castShadow = true;
  piece.receiveShadow = true;
  piece.position.y = -10.1;
  piece.name = character.name;
  piece.character = character;
  game.scene.add(piece);

  const loader = new GLTFLoader();
  let mixer;
  let glbModel;
  loader.load(
    character.model,
    function (g) {
      glbModel = g;
      game.scene.add(glbModel.scene);

      glbModel.scene.castShadow = true;
      glbModel.scene.scale.x *= character.scale;
      glbModel.scene.scale.y *= character.scale;
      glbModel.scene.scale.z *= character.scale;
      glbModel.scene.position.y = -10;
      glbModel.scene.position.x = piece.position.x;
      glbModel.scene.position.z = piece.position.z;
      piece.attach(glbModel.scene);

      if (character.name === "Paladin") {
        const model = glbModel.scene.children[0];
        [...Array(4)].forEach((_, i) => {
          model.children[i + 1].castShadow = true;
          model.children[i + 1].receiveShadow = true;
        });
        model.children[1].material.envMap = game.scene.background;
        model.children[1].material.metalness = -8;
      }
      if (character.name === "KingsGuard") {
        const model = glbModel.scene.children[0];
        [...Array(4)].forEach((_, i) => {
          model.children[i + 1].castShadow = true;
          model.children[i + 1].receiveShadow = true;
        });
        model.children[1].material.envMap = game.scene.background;
        model.children[1].material.metalness = -2;
      }
      if (character.name === "Viking") {
        console.log(glbModel.scene);
        glbModel.scene.children[0].castShadow = true;
        glbModel.scene.children[0].receiveShadow = true;
        glbModel.scene.children[1].castShadow = true;
        glbModel.scene.children[1].receiveShadow = true;
      }

      mixer = new THREE.AnimationMixer(glbModel.scene);
      piece.playAnimation("Idle");
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  let currentAnim;
  piece.playAnimation = (anim) => {
    const clips = glbModel.animations;
    if (currentAnim) {
      currentAnim.fadeOut(0.5);
    }
    const clip = THREE.AnimationClip.findByName(clips, anim);
    const action = mixer.clipAction(clip);
    if (anim === "Attack") {
      action.loop = THREE.LoopOnce;
      action.timeScale = character.attackSpeed * 1.2 - 0.4;
    }
    action.reset().fadeIn().play();
    currentAnim = action;
  };

  // health bar
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

  // actions
  let health = character.health;
  piece.damageParticles = [];
  piece.takeDamage = (damage) => {
    const reducedDamage = (damage * (7 - Math.log(character.defence / 10))) / 7;
    health -= reducedDamage;

    if (health <= 0) {
      health = 0;
      game.hexTiles[piece.row][piece.column].piece = undefined;
      game.pieces[piece.id] = undefined;
      game.scene.remove(piece);
    }
    healthBar.scale.x = health / character.health;
    healthBar.position.x -= (reducedDamage * 1.08) / character.health;

    let pos = new THREE.Vector3();
    pos = pos.setFromMatrixPosition(piece.matrixWorld);
    pos.project(game.camera);

    let widthHalf = window.innerWidth / 2;
    let heightHalf = window.innerHeight / 2;

    pos.x = pos.x * widthHalf + widthHalf;
    pos.y = -(pos.y * heightHalf) + heightHalf;
    pos.z = 0;

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
  };

  piece.action = () => {
    if (health <= 0) {
      return;
    }
    // check adjacent tiles
    const target = [
      [1, -1],
      [1, 1],
      [0, -2],
      [0, 2],
      [-1, -1],
      [-1, 1],
    ].find((pos) => {
      const searchTile =
        game.hexTiles[piece.row + pos[0]]?.[piece.column + pos[1]]?.piece;
      return searchTile && searchTile?.team !== team;
    });
    if (target) {
      piece.playAnimation("Attack");
      const targetPiece =
        game.hexTiles[piece.row + target[0]][piece.column + target[1]].piece;
      targetPiece.takeDamage(character.damage);
      if (character.name === "Viking") {
        character.attackSpeed =
          characters.Viking.attackSpeed *
          ((character.health * 2) / (health + character.health));
        console.log(characters.Viking.attackSpeed);
        piece.takeDamage(-8);
      }
      setTimeout(piece.action, (1 / character.attackSpeed) * 1000);
      return;
    }

    piece.playAnimation("Run");
    // move toward nearest enemy, avoiding filled tiles
    const enemies = Object.values(game.pieces).filter(
      (enemy) => enemy && enemy.team !== team
    );
    if (enemies.length === 0) {
      piece.playAnimation("Idle");
      return;
    }
    let closest = null;
    let closestDistance = 999;
    enemies.forEach((enemy) => {
      const distance = enemy.position.distanceTo(piece.position);
      if (distance < closestDistance) {
        closest = enemy;
        closestDistance = distance;
      }
    });
    let angle =
      -Math.atan2(
        piece.position.x - closest.position.x,
        piece.position.z - closest.position.z
      ) *
      (180 / Math.PI);

    let targetTile = null;
    let i = 0;
    do {
      if (angle < 0) {
        angle += 360;
      } else if (angle > 360) {
        angle -= 360;
      }
      const direction = [
        [1, 1],
        [0, 2],
        [-1, 1],
        [-1, -1],
        [0, -2],
        [1, -1],
      ][Math.floor(angle / 60)];
      targetTile =
        game.hexTiles?.[piece.row + direction[0]]?.[
          piece.column + direction[1]
        ];
      i++;
      angle += i % 2 === 0 ? i * 60 : i * -60;
    } while (!!targetTile?.piece && i < 6);

    if (targetTile && !targetTile.piece) {
      glbModel.scene.rotation.y = (angle - 120) / (180 / Math.PI);
      // move piece
      piece.targetPosition = new THREE.Vector3(
        targetTile.hex.position.x,
        0,
        targetTile.hex.position.z
      );
      piece.movementEndTime = Date.now() + character.speed * 1000;

      // remove hex's piece
      game.hexTiles[piece.row][piece.column].piece = undefined;
      // set new row and column on piece
      piece.row = targetTile.hex.row;
      piece.column = targetTile.hex.column;
      // set new hex's piece
      game.hexTiles[piece.row][piece.column].piece = piece;
    }

    setTimeout(piece.action, (1 / character.speed) * 1000);
    return;
  };

  piece.tween = () => {
    if (mixer) {
      mixer.update(0.01);
    }
    const currentTime = Date.now();
    const weight =
      character.speed /
      20 /
      (piece.movementEndTime / 1000 - currentTime / 1000);
    if (piece.targetPosition && piece.targetPosition.x !== piece.position.x) {
      if (piece.movementEndTime < currentTime) {
        piece.position.z = piece.targetPosition.z;
        piece.targetPosition = null;
      } else {
        piece.position.x =
          piece.targetPosition.x * weight + piece.position.x * (1 - weight);
        piece.position.z =
          piece.targetPosition.z * weight + piece.position.z * (1 - weight);
      }
    }
  };

  // add to board
  game.pieces[piece.id] = piece;
  game.hexTiles[row][column].piece = piece;
  piece.position.x = game.hexTiles[row][column].hex.position.x;
  piece.position.z = game.hexTiles[row][column].hex.position.z;

  piece.row = row;
  piece.column = column;
  piece.team = team;
  return piece;
};
