import "./App.css";
import * as THREE from "three";
import { longHexRow, shortHexRow } from "./gameComponents/hexTile";
import { boardPiece } from "./gameComponents/boardPiece";
import { enviornmentSetup } from "./gameComponents/enviornment";
import { SideNav } from "./uiComponents/sideNav";
import { characters } from "./data/characters";
import hdri from "./images/hdri.jpg";

export const game = {
  scene: {},
  hexTiles: {},
  pieces: {},
  damageParticles: [],
  loadedHdri: null,
};
const getSelectedPiece = () => game.hexTiles.selected?.piece;
const setSelected = (selected) => (game.hexTiles.selected = selected);
const getSelectedHex = () => game.hexTiles.selected?.hex;
const getHoveredTile = () =>
  game.hexTiles[game.hexTiles?.hovered?.row]?.[game.hexTiles?.hovered?.column];

const grabPiece = () => {
  if (getHoveredTile()?.piece?.team === 0) setSelected(getHoveredTile());
};
const dropPiece = () => {
  if (
    game.hexTiles.hovered &&
    !getHoveredTile()?.piece &&
    game.hexTiles?.hovered?.row < 4
  ) {
    getSelectedPiece().position.x = game.hexTiles.hovered.position.x;
    getSelectedPiece().position.z = game.hexTiles.hovered.position.z;

    const selectedPiece = game.hexTiles.selected.piece;

    game.hexTiles.selected.piece = null;

    game.hexTiles[game.hexTiles.hovered.row][
      game.hexTiles.hovered.column
    ].piece = selectedPiece;

    selectedPiece.row = game.hexTiles.hovered.row;
    selectedPiece.column = game.hexTiles.hovered.column;

    setSelected(null);
  } else {
    getSelectedPiece().position.x = getSelectedHex().position.x;
    getSelectedPiece().position.z = getSelectedHex().position.z;
    setSelected(null);
  }
};

enviornmentSetup();

longHexRow(16.8, -10, 7);
shortHexRow(14.8, -6.8, 6);
longHexRow(16.8, -3.6, 5);
shortHexRow(14.8, -0.4, 4);

longHexRow(16.8, 2.8, 3);
shortHexRow(14.8, 6, 2);
longHexRow(16.8, 9.2, 1);
shortHexRow(14.8, 12.4, 0);

boardPiece(7, 0, characters.KingsGuard, 1);
boardPiece(7, 8, characters.KingsGuard, 1);
boardPiece(7, 16, characters.KingsGuard, 1);

boardPiece(0, 5, characters.Paladin);
boardPiece(0, 9, characters.Viking);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const onPointerMove = (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

const onMouseDown = (event) => {
  if (game.hexTiles.hovered && !game.blocked) {
    grabPiece();
  }
};
const onMouseUp = (event) => {
  if (getSelectedPiece() && !game.blocked) {
    dropPiece();
  }
};

window.addEventListener("pointermove", onPointerMove);
window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mouseup", onMouseUp);

const loadedHdri = new THREE.TextureLoader().load(hdri);
loadedHdri.mapping = THREE.EquirectangularReflectionMapping;
game.scene.background = loadedHdri;
game.scene.enviornment = loadedHdri;

function animate() {
  requestAnimationFrame(animate);
  const currentTime = Date.now();
  game.renderer.render(game.scene, game.camera);

  Object.values(game.pieces).forEach((piece) => piece && piece.tween());

  game.damageParticles.forEach((particle, i) => {
    game.damageParticles[i].pos.y -=
      (currentTime - particle.startTime) / -150 + 2;
    game.damageParticles[i].pos.x += particle.random / 2;
    particle.element.style.top = particle.pos.y + "px";
    particle.element.style.left = particle.pos.x + "px";
  });

  if (game.camera.position.z < 30) {
    game.camera.position.z += (30.1 - game.camera.position.z) / 25;
  }

  if (getSelectedPiece()) {
    getSelectedPiece().position.x = game.mousePos.x;
    getSelectedPiece().position.z = game.mousePos.z;
  }

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, game.camera);
  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(game.scene.children);

  let onTile = false;
  for (let i = 0; i < intersects.length; i++) {
    if (
      intersects[i].object.name === "hexTile" ||
      intersects[i].object.name === "board"
    ) {
      game.mousePos = new THREE.Vector3(
        intersects[i].point.x,
        0,
        intersects[i].point.z
      );
    }
    if (intersects[i].object.name === "hexTile") {
      onTile = true;

      intersects[i].object.material.color.set(0xffffff);
      if (
        game.hexTiles.hovered &&
        game.hexTiles.hovered.id !== intersects[i].object.id
      ) {
        game.hexTiles.hovered.material.color.set(0x000000);
      }

      game.hexTiles.hovered = intersects[i].object;
    }
  }
  if (!onTile && game.hexTiles.hovered) {
    game.hexTiles.hovered.material.color.set(0x000000);
    game.hexTiles.hovered = null;
  }
}
animate();

const fight = () => {
  console.log(game);
  Object.values(game.pieces).forEach((piece) => piece.action());
};

function App() {
  return (
    <div className="App">
      <SideNav />
      <button className="startButton" onClick={fight}>
        Start
      </button>
    </div>
  );
}

export default App;
