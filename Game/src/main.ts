import { Boot } from "./scenes/Boot";
import { Intro } from "./scenes/Intro";
import { Fight } from "./scenes/Fight";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { Map } from "./scenes/Map";
import { Model } from "./scenes/Model";

import { Game, Types } from "phaser";
import { Info } from "./scenes/Info";

export const resolution = {
  width: 1024,
  height: 768,
};

export const globalData = {
  teraflops: 0,
  coolDataIndex: 0,
  level: 1,
  spawnPoint: {
    x: 0,
    y: 0,
  },
  modelLevel: 1,
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
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
  pixelArt: true,

  scene: [Boot, Preloader, MainMenu, Intro, GameOver, Map, Fight, Info, Model],
};

export default new Game(config);
