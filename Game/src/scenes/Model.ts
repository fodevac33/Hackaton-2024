import { Scene } from "phaser";

export class Model extends Scene {
  background: Phaser.GameObjects.Image;
  camera: Phaser.Cameras.Scene2D.Camera;

  constructor() {
    super("Model");
  }

  preload() {}

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0xff0000);
    this.anims.create({
      key: "animatedBackground",
      frames: this.anims.generateFrameNumbers("animatedBackground", {
        start: 0,
        end: 35,
      }),
      frameRate: 36,
      repeat: -1,
    });
    const background = this.add.sprite(512, 384, "animatedBackground");
    background.setOrigin(0.5, 0.5);
    background.play("animatedBackground");
  }
}
