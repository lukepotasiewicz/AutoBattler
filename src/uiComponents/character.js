import { game } from "../App";
import { boardPiece } from "../gameComponents/boardPiece";
import { defendDamage } from "../gameComponents/utils/damageUtil";
import "./character.css";

export const Character = ({ character }) => {
  return (
    <div className="character">
      <p>{character.name}</p>
      <button
        className="add"
        onClick={() => {
          let i = 1;
          while (game.hexTiles[0][i].piece) {
            i += 2;
          }
          boardPiece(0, i, character.name);
        }}
      >
        +
      </button>
      <div className="imageContainer">{character.image()}</div>
      <div className="stat">❤️{character.health}</div>
      <div className="stat">⚔️{character.damage}</div>
      <div className="stat">🛡️{character.defence}</div>
      <div className="stat">🗡️{character.attackSpeed}</div>
      <div className="stat">🔵{character.magicDefence}</div>
      <div className="stat">🏹{character.range}</div>
      <div className="stat">🥾{character.speed}</div>
      {false && (
        <div
          style={{ height: "102px", width: "204px", border: "solid 1px white" }}
        >
          {[...Array(100)].map((_, i) => (
            <div
              style={{
                height: `${defendDamage(100, i * 10)}px`,
                width: "2px",
                background: "red",
                float: "left",
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};
