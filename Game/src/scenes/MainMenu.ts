import { Scene, GameObjects } from "phaser";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  buttonPlay: GameObjects.Image;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    this.logo = this.add.image(512, 300, "logo");

    this.buttonPlay = this.add.image(512, 500, "buttonPlay");

    this.input.once("pointerdown", () => {
      this.scene.start("Intro");
    });
  }
}
