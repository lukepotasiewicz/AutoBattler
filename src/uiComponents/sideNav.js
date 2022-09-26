import { useState } from "react";
import { game } from "../App";
import { characters } from "../data/characters";
import PartyIcon from "../images/party.png";
import { Character } from "./character";
import "./sideNav.css";

export const SideNav = () => {
  const [open, setOpen] = useState(false);
  game.blocked = open;

  return (
    <div className="sideNav">
      <button
        className={`navToggle ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <img src={PartyIcon} alt="Party" />
      </button>
      <div className={`sideNavContent ${open ? "open" : ""}`}>
        {Object.values(characters).map((character, i) => (
          <Character character={character} key={character.name + i} />
        ))}
      </div>
    </div>
  );
};
