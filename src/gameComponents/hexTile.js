import * as THREE from "three";
import { game } from "../App";
import hex from "../images/hex.png";

export const hexTile = (xPos, zPos, size, row, column) => {
  const loader = new THREE.TextureLoader();
  const texture = loader.load(hex);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);

  //Create a plane that receives shadows (but does not cast them)
  const planeGeometry = new THREE.PlaneGeometry(size, size, 3, 3);
  const planeMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    opacity: 0.2,
    color: 0x000000,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -1.57;
  plane.position.y = -9.8;
  plane.position.x = xPos;
  plane.position.z = zPos;
  plane.row = row;
  plane.column = column;

  game.scene.add(plane);
  if (!game.hexTiles[row]) {
    game.hexTiles[row] = {};
  }
  game.hexTiles[row][column] = { hex: plane, piece: null };
  plane.name = "hexTile";
  return plane;
};

export const longHexRow = (xPos, zPos, row) => {
  for (let i = 0; i < 9; i++) {
    hexTile(i * (4 + 0.2) - xPos, zPos, 4, row, i);
  }
};

export const shortHexRow = (xPos, zPos, row) => {
  for (let i = 0; i < 8; i++) {
    hexTile(i * (4 + 0.2) - xPos, zPos, 4, row, i);
  }
};
