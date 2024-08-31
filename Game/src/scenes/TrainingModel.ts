import { Scene } from "phaser";
import { resolution } from "../main";

export class TrainingModel extends Scene {
  bar: Phaser.GameObjects.Rectangle;
  startTime: number;
  progressBar: Phaser.GameObjects.Rectangle;
  progressBarBg: Phaser.GameObjects.Rectangle;
  interactionEnabled: boolean = false;

  constructor() {
    super("TrainingModel");
  }

  preload() {}

  startCustomProgress() {
    const duration = 5000;
    const interval = 50;
    const totalSteps = duration / interval;
    let currentStep = 0;

    const timer = this.time.addEvent({
      delay: interval,
      callback: () => {
        currentStep++;
        const progress = currentStep / totalSteps;

        // Update the progress bar width
        this.progressBar.width = 4 + 460 * progress;

        if (currentStep >= totalSteps) {
          timer.remove();
          this.interactionEnabled = true;
          this.scene.start("Model");
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  create() {
    const msg_text = this.add.text(
      resolution.width / 2,
      resolution.height / 2 - 60,
      "Training model with the new data...",
      {
        fontFamily: "Kenney Mini Square",
        fontSize: 30,
        color: "#fff   ",
        align: "center",
        fontStyle: "bold",
      }
    );
    msg_text.setOrigin(0.5);
    msg_text.setScale(1);

    this.progressBarBg = this.add
      .rectangle(resolution.width / 2, resolution.height / 2, 468, 32)
      .setStrokeStyle(1, 0xffffff);
    this.progressBar = this.add.rectangle(
      resolution.width / 2 - 230,
      resolution.height / 2,
      4,
      28,
      0xffffff
    );

    this.startCustomProgress();
  }
}
