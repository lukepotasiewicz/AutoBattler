import * as THREE from "three";
import { game } from "../App";

export const boardPiece = (xPos, zPos, size = 1) => {
  //Create a sphere that cast shadows (but does not receive them)
  const sphereGeometry = new THREE.SphereGeometry(size, 10, 10);
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff7700 });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.castShadow = true; //default is false
  sphere.receiveShadow = false; //default
  sphere.position.x = xPos;
  sphere.position.y = -9;
  sphere.position.z = zPos;
  game.scene.add(sphere);
  game.pieces[sphere.id] = sphere;
  return sphere;
};
