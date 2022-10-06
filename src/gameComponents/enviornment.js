import * as THREE from "three";
import background1 from "../images/background1.jpg";
import { game } from "../App";

export const enviornmentSetup = () => {
  game.scene = new THREE.Scene();
  game.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  game.camera.position.z = 25;
  game.camera.position.y = 20;
  game.camera.rotation.x -= 0.8;

  game.renderer = new THREE.WebGLRenderer();
  game.renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(game.renderer.domElement);
  game.renderer.textureEncoding = THREE.sRGBEncoding;

  game.renderer.shadowMap.enabled = true;
  game.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  //Create a DirectionalLight and turn on shadows for the light
  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(0.5, 1, 0.5); //default; light shining from top
  light.castShadow = true; // default false
  game.scene.add(light);
  const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
  game.scene.add(ambientLight);

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 1024; // default
  light.shadow.mapSize.height = 1024; // default
  light.shadow.camera.near = -3; // default
  light.shadow.camera.far = 30; // default

  light.shadow.camera.top = 20;
  light.shadow.camera.bottom = -30;
  light.shadow.camera.left = -24;
  light.shadow.camera.right = 20;

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
  plane.name = "board";
  plane.rotation.x = -1.57;
  plane.position.y = -10;
  game.scene.add(plane);

  document.querySelector("canvas").onwheel = (e) => {
    game.camera.targetPosition = new THREE.Vector3(
      0,
      game.camera.position.y + e.deltaY / 100,
      game.camera.position.z + e.deltaY / 200
    );
  };

  // Create a helper for the shadow camera (optional)
  // const helper = new THREE.CameraHelper(light.shadow.camera);
  // scene.add(helper);
};
