import "./App.css";
import * as THREE from "three";
import { longHexRow, shortHexRow } from "./gameComponents/hexTile";
import { boardPiece } from "./gameComponents/boardPiece";
import { boardSetup } from "./gameComponents/enviornment";
import { SideNav } from "./uiComponents/sideNav";

export const game = {
  scene: {},
  hexTiles: {},
  pieces: {},
};
const getSelectedPiece = () => game.hexTiles.selected?.piece;
const setSelected = (selected) => (game.hexTiles.selected = selected);
const getSelectedHex = () => game.hexTiles.selected?.hex;

const grabPiece = () => {
  setSelected(
    game.hexTiles[game.hexTiles.hovered.row][game.hexTiles.hovered.column]
  );
};
const dropPiece = () => {
  if (game.hexTiles.hovered) {
    getSelectedPiece().position.x = game.hexTiles.hovered.position.x;
    getSelectedPiece().position.z = game.hexTiles.hovered.position.z;

    const selectedPiece = game.hexTiles.selected.piece;

    game.hexTiles.selected.piece = null;

    game.hexTiles[game.hexTiles.hovered.row][
      game.hexTiles.hovered.column
    ].piece = selectedPiece;

    setSelected(null);
  } else {
    getSelectedPiece().position.x = getSelectedHex().position.x;
    getSelectedPiece().position.z = getSelectedHex().position.z;
    setSelected(null);
  }
};

boardSetup();

longHexRow(16.8, 2.8, 0);
shortHexRow(14.8, 6, 1);
longHexRow(16.8, 9.2, 2);
shortHexRow(14.8, 12.4, 3);

game.hexTiles[0][0].piece = boardPiece(2, -5);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const onPointerMove = (event) => {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

const onMouseDown = (event) => {
  if (game.hexTiles.hovered) {
    grabPiece();
  }
};
const onMouseUp = (event) => {
  if (getSelectedPiece()) {
    dropPiece();
  }
};

window.addEventListener("pointermove", onPointerMove);
window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mouseup", onMouseUp);

function animate() {
  requestAnimationFrame(animate);
  game.renderer.render(game.scene, game.camera);
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
      game.mousePos = new THREE.Vector3(
        intersects[i].point.x,
        0,
        intersects[i].point.z
      );
    }
  }
  if (!onTile && game.hexTiles.hovered) {
    game.hexTiles.hovered.material.color.set(0x000000);
    game.hexTiles.hovered = null;
  }
}
animate();

function App() {
  return (
    <div className="App">
      <SideNav />
    </div>
  );
}

export default App;
