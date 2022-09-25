import { useState } from "react";
import "./character.css";

export const Character = ({ character }) => {
  return (
    <div className="character">
      <p>{character.name}</p>
      <div className="imageContainer">{character.image()}</div>
      <div>{character.health}</div>
      <div>{character.damage}</div>
      <div>{character.attackSpeed}</div>
      <div>{character.speed}</div>
    </div>
  );
};
