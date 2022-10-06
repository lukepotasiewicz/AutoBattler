import * as THREE from "three";
import { game } from "../App";
import { characters } from "../data/characters";
import { damageManager, healthBarFactory } from "./utils/damageUtil";
import { loadModel } from "./utils/modelLoader";

const teamColors = {
  0: 0x006699,
  1: 0xff4400,
};

export const boardPiece = (row, column, name, team = 0) => {
  const character = { ...characters[name] };
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
  piece.position.y = -10.05;
  piece.name = character.name;
  piece.character = character;
  game.scene.add(piece);

  loadModel({ character, piece });
  const healthBar = healthBarFactory({ piece, character });

  let health = character.health;
  piece.damageParticles = [];
  piece.takeDamage = (damage) => {
    health = damageManager({ character, damage, health, piece, healthBar });
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
      const targetPiece =
        game.hexTiles[piece.row + target[0]][piece.column + target[1]].piece;

      let angle =
        -Math.atan2(
          piece.position.x - targetPiece.position.x,
          piece.position.z - targetPiece.position.z
        ) *
        (180 / Math.PI);
      piece.setDirection(angle);
      piece.playAnimation("Attack");

      setTimeout(
        () => health > 0 && targetPiece.takeDamage(character.damage),
        (1 / character.attackSpeed) * 500
      );
      if (character.name === "Viking") {
        character.attackSpeed =
          characters.Viking.attackSpeed *
          ((character.health * 2) / (health + character.health));
        piece.takeDamage(-10);
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
      console.log(angle);
      piece.setDirection(angle + 30);
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
    piece.animate();
    const currentTime = Date.now();
    const weight =
      character.speed /
      40 /
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
