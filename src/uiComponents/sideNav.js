import { useState } from "react";
import { characters } from "../data/characters";
import PartyIcon from "../images/party.png";
import { Character } from "./character";
import "./sideNav.css";

export const SideNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="sideNav">
      <button
        className={`navToggle ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <img src={PartyIcon} alt="Party" />
      </button>
      <div className={`sideNavContent ${open ? "open" : ""}`}>
        {Object.values(characters).map((character) => (
          <Character character={character} />
        ))}
      </div>
    </div>
  );
};
