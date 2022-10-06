import * as THREE from "three";
import { game } from "../../App";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export const loadModel = ({ character, piece }) => {
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
      action.timeScale = character.attackSpeed * 1.2 - 0.2;
    }
    action.reset().fadeIn().play();
    currentAnim = action;
  };

  piece.animate = () => {
    if (mixer) {
      mixer.update(0.01);
    }
  };

  piece.setDirection = (direction) => {
    if (!isNaN(direction) && glbModel) {
      const radians = (direction - 180) / (-180 / Math.PI);
      glbModel.scene.rotation.y = radians;
      console.log(radians);
      //   console.log(Math.floor(Date.now() / 1000) % 6);
    }
  };
};
