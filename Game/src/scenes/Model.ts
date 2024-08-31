import { Scene } from "phaser";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import sendPrompt from "../services/index";
export class Model extends Scene {
  chatHistory = [];
  chatContainer;
  background: Phaser.GameObjects.Image;
  camera: Phaser.Cameras.Scene2D.Camera;
  rexUI: RexUIPlugin;
  msg_text: Phaser.GameObjects.Text;
  cloud: Phaser.GameObjects.Image;
  button: Phaser.GameObjects.Image;
  offsetY = 0;
  maxOffsetY = 0;
  lines = [];

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

    //--------------------------------------------

    const background = this.add.sprite(512, 384, "animatedBackground");
    background.setOrigin(0.5, 0.5);
    background.play("animatedBackground");

    //--------------------TEXT------------------------/
    this.cloud = this.add.image(510, 710, "chat");
    this.cloud.setScale(0.48);
    console.log(this.cloud.width, this.cloud.height);
    const inputText = this.add
      .rexInputText(520, 730, 600, 100, {
        type: "textarea",
        text: "hello world",
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

    this.input.on("pointerdown", function (pointer, currentlyOver) {
      if (!currentlyOver.includes(inputText)) {
        inputText.setBlur();
      }
    });

    inputText.on("keydown", function (event) {
      if (event.key === "Enter") {
        inputText.setBlur();
      }
    });

    this.button = this.add.image(880, 710, "button").setInteractive();
    this.button.setScale(1.5);
    this.button.on("pointerdown", () => {
      const inputContent = inputText.text;
      inputText.setText("");
      console.log(inputContent);
      if (inputContent !== "" && this.offsetY <= 600) {
        this.handleUserInput(inputContent);
      }
    });

    //---------------------API-----------------------//
  }
  //-----------------------------CHAT-------------------//
  handleUserInput(text) {
    this.addToChatHistory("User", text);
    sendPrompt(text, 5) // Assume '5' is a fixed level for the API endpoint
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
    this.updateChatDisplay(speaker, message);
  }

  updateChatDisplay(speaker, message) {
    if (speaker == "User") {
      this.cloud = this.add.image(200, this.offsetY + 30, "chat");
      this.cloud.setScale(0.28);
      const width_user = this.cloud.width * 0.28;
      console.log(width_user);
      this.msg_text = this.add.text(20, this.offsetY + 10, message, {
        fontFamily: "Kenney Mini Square",
        fontSize: 13,
        color: "#000000",
        align: "left",
        wordWrap: { width: width_user - 200, useAdvancedWrap: true },
        fontStyle: "bold",
      });
      this.msg_text.setScale(1);
      this.offsetY += 40;
    }
    if (speaker == "API") {
      let lines = [];
      if (message.length > 120) {
        let start = 0;
        while (start < message.length) {
          let end = start + 155;
          if (end > message.length) {
            end = message.length;
          }
          let segment = message.substring(start, end).trim();
          if (segment.length > 0) {
            lines.push(segment.replace(/\s+/g, " "));
          }
          start += 155;
        }
      } else {
        if (message.length > 0) {
          lines = [message.trim().replace(/\s+/g, " ")];
        } else {
          lines = [];
        }
      }
      console.log(lines);
      for (let i = 0; i < lines.length; i++) {
        this.cloud = this.add.image(750, this.offsetY + 30, "chat");
        this.cloud.setScale(0.3);
        this.msg_text = this.add.text(750, this.offsetY + 30, lines[i], {
          fontFamily: "Kenney Mini Square",
          fontSize: 13,
          color: "#000000",
          align: "left",
          wordWrap: { width: 380, useAdvancedWrap: true },
          fontStyle: "bold",
        });
        this.msg_text.setOrigin(0.5);
        this.offsetY += 70;
      }
    }

    this.offsetY += 30;
  }
  //-----------------------------/CHAT-------------------//

  update() {}
}
