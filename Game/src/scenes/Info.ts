import { Scene } from "phaser";
import { globalData } from "../main";

export class Info extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  professor: Phaser.GameObjects.Image;
  cloud: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  constructor() {
    super("Info");
  }

  preload() {
    this.cameras.main.fadeIn(3000);
  }

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

    const coolData = [
      "Sabias que Los modelos de lenguaje grande, como GPT-4, están entrenados en vastas cantidades de texto de internet y otras fuentes para generar respuestas coherentes y contextualmente relevantes.",
      "Sabias que los LLMs pueden realizar tareas de procesamiento de lenguaje natural como traducción, resumen de texto, análisis de sentimientos y generación de texto creativo.",
      "Sabias que a medida que los modelos de lenguaje grande se hacen más grandes y complejos, requieren cantidades significativas de potencia computacional y recursos para su entrenamiento y funcionamiento.",
      "Sabias que los LLMs han demostrado la capacidad de realizar razonamiento matemático básico y lógica deductiva, aunque su rendimiento puede variar dependiendo de la tarea específica.",
      "Sabias que el uso de LLMs ha planteado preocupaciones éticas sobre el sesgo en los datos de entrenamiento, la privacidad y el uso potencial para desinformación o actividades malintencionadas.",
    ];

    const background = this.add.sprite(512, 384, "animatedBackground");
    background.setOrigin(0.5, 0.5);
    background.play("animatedBackground");
    this.professor = this.add.image(940, 500, "professor");
    this.cloud = this.add.image(450, 600, "cloudSpeech");
    this.cloud.setScale(0.32);

    this.msg_text = this.add.text(
      450,
      588,
      coolData[globalData.coolDataIndex],
      {
        fontFamily: "Kenney Mini Square",
        fontSize: 30,
        color: "#000000",
        align: "center",
        wordWrap: { width: 700, useAdvancedWrap: true },
        fontStyle: "bold",
      }
    );
    this.msg_text.setOrigin(0.5);
    this.msg_text.setScale(1);

    this.input.once("pointerdown", () => {
      if (globalData.coolDataIndex < 4) {
        globalData.coolDataIndex += 1;
      } else {
        globalData.coolDataIndex = 0;
      }
      globalData.teraflops += globalData.coolDataIndex * 2;
      this.scene.start("Map");
    });
  }
}
