import * as THREE from "three";
import background1 from "../images/background1.jpg";
import { game } from "../App";

export const boardSetup = () => {
  game.scene = new THREE.Scene();
  game.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  game.camera.position.z = 25;
  game.camera.position.y = 14;
  game.camera.rotation.x -= 0.6;
  game.renderer = new THREE.WebGLRenderer();
  game.renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(game.renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  game.scene.add(cube);

  game.renderer.shadowMap.enabled = true;
  game.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  //Create a DirectionalLight and turn on shadows for the light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 1, 0); //default; light shining from top
  light.castShadow = true; // default false
  game.scene.add(light);
  const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
  game.scene.add(ambientLight);

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default

  const loader = new THREE.TextureLoader();
  const texture = loader.load(background1);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);

  //Create a plane that receives shadows (but does not cast them)
  const planeGeometry = new THREE.PlaneGeometry(40, 30, 32, 32);
  const planeMaterial = new THREE.MeshStandardMaterial({ map: texture });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -1.57;
  plane.position.y = -10;
  game.scene.add(plane);

  // Create a helper for the shadow camera (optional)
  // const helper = new THREE.CameraHelper(light.shadow.camera);
  // scene.add(helper);
};
