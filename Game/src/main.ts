import { Boot } from "./scenes/Boot";
import { Intro } from "./scenes/Intro";
import { Fight } from "./scenes/Fight"
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { Map } from "./scenes/Map";

import { Game, Types } from "phaser";

export const resolution ={
  width: 1024,
  height: 768
}

export const position = (divisions: number, place: number, dim: string) => {
  if (place > divisions) {
   throw Error("Place must be lesser or equal than divisions")
  }

  let side: number

  if (dim == "w") {
    side = resolution.width
  } else if (dim == "h") {
    side = resolution.height
  } else {
    throw Error("Non existent dimension")
  }

  const chunk = side / divisions

  if (dim == "w") {
    return chunk * place
  }

  return chunk * (divisions - place)
}

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: resolution.width,
  height: resolution.height,
  parent: "game-container",
  backgroundColor: "#028af8",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },

  scene: [Boot, Preloader, MainMenu, Intro, GameOver, Map, Fight],
};

export default new Game(config);
