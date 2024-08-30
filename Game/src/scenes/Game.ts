import { Scene } from "phaser";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  professor: Phaser.GameObjects.Image;
  gpu: Phaser.GameObjects.Image;
  cloud: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

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

    // this.background = this.add.image(512, 384, "backgroundCity");
    // this.background.setScale(1.2);
    this.professor = this.add.image(940, 500, "professor");
    this.cloud = this.add.image(450, 600, "cloudSpeech");
    this.cloud.setScale(0.32);
    this.gpu = this.add.image(500, 150, "gpu");
    this.gpu.setVisible(false);
    this.gpu.setScale(0.3);

    const messagesProfessor = [
      "¡Hola, pequeño explorador! Soy el Profesor Teck , y hoy vamos a embarcarnos en una misión emocionante",
      "Nuestro objetivo es alimentar al modelo con mucho conocimiento. Pero atención, ¡necesitamos usar los teraflops...",
      "Primero, ¿sabes qué es un teraflop?",
      "¡No te preocupes! Un teraflop es una medida de la potencia de los computadores.",
      "Es como la energía mágica que necesitamos para que el modelo aprenda más rápido.",
      "Ahora, mientras avanzas por el camino, verás unas cajas con pequeños ventiladores.",
      "¡Esos son los teraflops! Cuando los encuentres, recógelos con mucho cuidado. son muy valiosos para nuestro aprendizaje.",
      "También verás muchos edificios ¡Esos son edificios de información! Entra a todos",
      "Porque nuestro modelo se alimenta de toda esa información",
    ];
    let indexMessage = 0;

    this.msg_text = this.add.text(450, 595, messagesProfessor[indexMessage], {
      fontFamily: "Kenney Mini Square",
      fontSize: 40,
      color: "#000000",
      align: "center",
      wordWrap: { width: 700, useAdvancedWrap: true },
      fontStyle: "bold",
    });
    this.msg_text.setOrigin(0.5);
    this.msg_text.setScale(1);

    this.input.on("pointerdown", () => {
      indexMessage++;
      if (indexMessage >= messagesProfessor.length) {
        this.scene.start("Map");
      }

      if (indexMessage == 3) {
        this.gpu.setVisible(true);
      }

      this.msg_text.setText(messagesProfessor[indexMessage]);
    });
  }
}
