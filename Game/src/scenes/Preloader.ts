import { Scene } from "phaser";
// @ts-ignore
import * as WebFontLoader from "../../lib/webfontloader.js";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    WebFontLoader.default.load({
      custom: {
        families: ["Kenney Mini Square"],
      },
    });

    this.load.audio("sfx", "sfx.wav");

    this.load.image("hearth", "hearth.png");

    this.load.image("logo", "logo.png");

    this.load.image("buttonPlay", "buttonPlay.png");

    this.load.image("professor", "professor.png");
    // this.load.image("backgroundCity", "backgroundCity.png");
    this.load.image("cloudSpeech", "cloudSpeech.png");
    this.load.image("gpu", "gpu.png");
    this.load.image("chat", "large_chat.png");

    this.load.spritesheet("animatedBackground", "backgroundCity2.png", {
      frameWidth: 1024,
      frameHeight: 768,
    });

    this.load.spritesheet("model_idle", "model_idle.png", {
      frameWidth: 80,
      frameHeight: 80,
    });

    this.load.image("tile1", "/tilesets/CP_V1.0.4.png");
    this.load.image("tile2", "/tilesets/tilemap_packed.png");

    this.load.image("dictionary", "/dict_fight/image/projectile.png");
    this.load.image("calculator", "/math_fight/image/projectile.png");
    this.load.image("books", "books.png");
    this.load.image("keyboard", "/program_fight/image/projectile.png");
    this.load.image("router", "/internet_fight/image/projectile.png");

    this.load.tilemapTiledJSON("map", "/tilemaps/AI_Land.json");
    this.load.atlas("player", "/player/atlas.png", "/player/atlas.json");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("Model");
  }
}
