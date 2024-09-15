import { Boot } from "./scenes/Boot";
import { Intro } from "./scenes/Intro";
import { BookFight } from "./scenes/BookFight";
import { ProgramFight } from "./scenes/ProgramFight";
import { InternetFight } from "./scenes/InternetFight";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { Map } from "./scenes/Map";
import { MathFight } from "./scenes/MathFight";
import { Model } from "./scenes/Model";
import { Info } from "./scenes/Info";
import { TrainingModel } from "./scenes/TrainingModel";

import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import { Game, Types } from "phaser";
import { DictFight } from "./scenes/DictFight";

export const resolution = {
  width: 1024,
  height: 768,
};

export const model_images = {
  level_1: {
    name: "level 1",
    x: 500,
    y: 30,
    scale: 0.15,
  },
  level_2: {
    name: "level 2",
    x: 500,
    y: 30,
    scale: 0.25,
  },
  level_3: {
    name: "level 3",
    x: 500,
    y: 30,
    scale: 0.55,
  },
  level_4: {
    name: "level 4",
    x: 490,
    y: 45,
    scale: 0.13,
  },
  level_5: {
    name: "level 5",
    x: 500,
    y: 40,
    scale: 0.07,
  },
};
export const globalData = {
  teraflops: 0,
  coolDataIndex: 0,
  spawnPoint: {
    x: 0,
    y: 0,
  },
  modelLevel: 0,
  arenasVisited: {
    arena1: {
      scene: "DictFight",
      owned: false,
      allowed: true,
    },
    arena2: {
      scene: "BookFight",
      owned: false,
      allowed: false,
    },
    arena3: {
      scene: "MathFight",
      owned: false,
      allowed: false,
    },
    arena4: {
      scene: "ProgramFight",
      owned: false,
      allowed: false,
    },
    arena5: {
      scene: "InternetFight",
      owned: false,
      allowed: false,
    },
  },
  newData: true,
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
  backgroundColor: "#000",
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
  dom: {
    createContainer: true,
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
    TrainingModel,
    Model,
    ProgramFight,
    InternetFight,
  ],
  plugins: {
    scene: [
      {
        key: "rexUI",
        plugin: RexUIPlugin,
        mapping: "rexUI",
      },
    ],
  },
};

export default new Game(config);
