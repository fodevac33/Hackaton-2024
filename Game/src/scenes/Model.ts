import { Scene } from "phaser";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import sendPrompt from "../services/index";
import { resolution } from "../main";
import { globalData } from "../main";

export class Model extends Scene {
  chatHistory: [];
  background: Phaser.GameObjects.Image;
  camera: Phaser.Cameras.Scene2D.Camera;
  rexUI: RexUIPlugin;
  msg_text: Phaser.GameObjects.Text;
  cloud: Phaser.GameObjects.Image;
  button: Phaser.GameObjects.Image;
  button2: Phaser.GameObjects.Image;
  offsetY: number = 0;
  maxoffsetY: number = 620;
  lines: string[];
  maxMessages: number = 7;
  displayedMessages: [];
  constructor() {
    super("Model");
  }

  preload() {
    this.load.plugin(
      "rexinputtextplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js",
      true
    );
  }

  create() {
    globalData.modelLevel;

    this.chatHistory = [];
    this.displayedMessages = [];
    this.input.keyboard.removeCapture("SPACE");
    this.input.keyboard.removeCapture("LEFT");
    this.camera = this.cameras.main;
    this.offsetY = 0;
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

    //--------------------------------------------]

    const background = this.add.sprite(512, 384, "animatedBackground");
    background.setOrigin(0.5, 0.5);
    background.play("animatedBackground");

    //--------------------teclado input user ------------------------/
    this.cloud = this.add.image(510, 710, "chat");
    this.cloud.setScale(0.48);
    const inputText = this.add
      .rexInputText(520, 730, 600, 100, {
        type: "textarea",
        text: "Escribe un pregunta",
        fontFamily: "Kenney Mini Square",
        fontSize: "25px",
        color: "#000000",
        align: "center",
        maxLength: 76,
        wordWrap: { width: 700, useAdvancedWrap: true },
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setFocus();

    //--------------------efectos en el teclado-------------------//

    this.input.on("pointerdown", function (pointer, currentlyOver) {
      if (!currentlyOver.includes(inputText)) {
        inputText.setBlur();
      }
    });

    this.input.keyboard.on("keydown-ENTER", () => {
      const inputContent = inputText.text;
      inputText.setText("");
      console.log(inputContent);
      if (inputContent !== "") {
        this.handleUserInput(inputContent);
      }
    });
    //--------------------/efectos en el teclado-------------------//
    //--------------------Botones----------------------------------//

    this.button = this.add.image(895, 710, "plane").setInteractive();
    this.button.setScale(0.035);

    this.button.on("pointerdown", () => {
      const inputContent = inputText.text;
      inputText.setText("");
      console.log(inputContent);
      if (inputContent !== "") {
        this.handleUserInput(inputContent);
      }
    });

    this.button2 = this.add
      .image(resolution.width - 40, 40, "x")
      .setInteractive();
    this.button2.setScale(0.2);
    this.button2.on("pointerdown", () => {
      this.scene.start("Map");
    });
    //--------------------/Botones----------------------------------//

    //---------------------API-----------------------//
  }
  //-----------------------------Envio de informacion -------------------//
  handleUserInput(text: string) {
    this.addToChatHistory("User", text);
    sendPrompt(text, false)
      .then((response) => {
        console.log(response);
        this.addToChatHistory("API", response);
      })
      .catch((error) => {
        console.error("Error in API call:", error);
      });
  }
  addToChatHistory(speaker, message) {
    this.chatHistory.push({ speaker, message });

    if (
      this.chatHistory.length > this.maxMessages ||
      this.offsetY > this.maxoffsetY
    ) {
      this.chatHistory.shift();
      console.log(this.offsetY);
      this.refreshChatDisplay();
      console.log("refresh display");
    } else {
      this.updateChatDisplay(speaker, message);
    }
  }

  updateChatDisplay(speaker, message) {
    if (speaker == "User") {
      console.log("Posicion respuesta de usuario", this.offsetY);

      this.cloud = this.add.image(200, this.offsetY + 30, "chat");
      this.cloud.setScale(0.28);
      const width_user = this.cloud.width * 0.28;
      this.msg_text = this.add.text(20, this.offsetY + 10, message, {
        fontFamily: "Kenney Mini Square",
        fontSize: 13,
        color: "#000000",
        align: "center",
        wordWrap: { width: width_user - 200, useAdvancedWrap: true },
        fontStyle: "bold",
      });
      this.msg_text.setScale(1);
      this.offsetY += 40;
      this.displayedMessages.push({
        cloud: this.cloud,
        msgText: this.msg_text,
      });
    }
    if (speaker == "API") {
      let lines = [];
      if (message.length > 100) {
        let start = 0;
        while (start < message.length) {
          let end = start + 95;
          if (end > message.length) {
            end = message.length;
          }
          let segment = message.substring(start, end).trim();
          if (segment.length > 0) {
            lines.push(segment.replace(/\s+/g, " "));
          }
          start += 95;
        }
      } else {
        lines = [message.trim().replace(/\s+/g, " ")];
      }

      for (let i = 0; i < lines.length; i++) {
        this.cloud = this.add.image(750, this.offsetY + 30, "chat");
        this.cloud.setScale(0.3);
        this.msg_text = this.add.text(750, this.offsetY + 30, lines[i], {
          fontFamily: "Kenney Mini Square",
          fontSize: 13,
          color: "#000000",
          align: "center",
          wordWrap: { width: 380, useAdvancedWrap: true },
          fontStyle: "bold",
        });
        console.log("Posicion respuesta de api", this.offsetY);

        this.msg_text.setOrigin(0.5);
        if (i != lines.length) {
          this.offsetY += 70;
          this.displayedMessages.push({
            cloud: this.cloud,
            msgText: this.msg_text,
          });

          // eliminamos el mensaje un mensaje previo cuando la respuesta de la api supera el umbral del chat
          if (this.offsetY > this.maxoffsetY) {
            this.chatHistory.shift();
            console.log(this.offsetY);
            this.refreshChatDisplay();
          }
        }
      }
    }
    this.cameras.main.scrollY = Math.max(
      0,
      this.offsetY - this.cameras.main.height
    );
    if (this.displayedMessages.length > this.maxMessages) {
      const oldest = this.displayedMessages.shift();
      oldest?.cloud.destroy();
      oldest?.msgText.destroy();
    }
  }
  refreshChatDisplay() {
    this.displayedMessages.forEach((msg) => {
      msg.cloud.destroy();
      msg.msgText.destroy();
    });
    this.displayedMessages = [];
    this.offsetY = 0;
    console.log(this.chatHistory);
    this.chatHistory.forEach((msg) =>
      this.updateChatDisplay(msg.speaker, msg.message)
    );
  }
  //-----------------------------/CHAT-------------------//

  update() {}
}
