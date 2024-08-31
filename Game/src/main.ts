import { Boot } from "./scenes/Boot";
import { Intro } from "./scenes/Intro";
import { BookFight } from "./scenes/BookFight";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { Map } from "./scenes/Map";
import { MathFight } from "./scenes/MathFight";
import { Model } from "./scenes/Model";
import { Info } from "./scenes/Info";

import { Game, Types } from "phaser";
import { DictFight } from "./scenes/DictFight";

export const resolution = {
  width: 1024,
  height: 768,
};

export const globalData = {
  teraflops: 0,
  coolDataIndex: 0,
  spawnPoint: {
    x: 0,
    y: 0,
  },
  modelLevel: 1,
  arenasVisited: {
    arena1: {
      scene: "BookFight",
      owned: false,
    },
    arena2: {
      scene: "DictFight",
      owned: false,
    },
    arena3: {
      scene: "MathFight",
      owned: false,
    },
  },
};

export const position = (divisions: number, place: number, dim: string) => {
  if (place > divisions) {
    throw Error("Place must be lesser or equal than divisions");
  }

  let side: number;

  if (dim == "w") {
    side = resolution.width;
  } else if (dim == "h") {
    side = resolution.height;
  } else {
    throw Error("Non existent dimension");
  }

  const chunk = side / divisions;

  if (dim == "w") {
    return chunk * place;
  }

  return chunk * (divisions - place);
};

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
      debug: false,
    },
  },

  scene: [
    Boot,
    Preloader,
    MainMenu,
    Intro,
    GameOver,
    Map,
    BookFight,
    DictFight,
    MathFight,
    Info,
    Model,
  ],
};

export default new Game(config);
