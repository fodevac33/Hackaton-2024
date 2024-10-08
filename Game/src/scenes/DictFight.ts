import { GameObjects, Types, Physics, Actions, Sound } from "phaser";
import { Scene } from "phaser";
import { position } from "../main";
import { globalData } from "../main";

export class DictFight extends Scene {
  background: GameObjects.Image;
  title: GameObjects.Image;
  lives_text: GameObjects.Text;
  timer_text: GameObjects.Text;
  player: Types.Physics.Arcade.ImageWithDynamicBody;
  wall: Physics.Arcade.StaticGroup;
  cursors: Types.Input.Keyboard.CursorKeys;
  projectiles: Physics.Arcade.Group;
  lives: number = 3;
  heartImages: GameObjects.Image[] = [];
  timeLeft: number = 15; // 60 seconds countdown
  timerEvent: Phaser.Time.TimerEvent;
  music: Sound.NoAudioSound | Sound.HTML5AudioSound | Sound.WebAudioSound;

  text_color = "#7d6e31";

  constructor() {
    super("DictFight");
  }

  preload() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(
      0,
      0,
      this.sys.game.config.width as number,
      this.sys.game.config.height as number
    );

    // Add a loading text
    const loadingText = this.add
      .text(
        (this.sys.game.config.width as number) / 2,
        (this.sys.game.config.height as number) / 2,
        "Loading...",
        {
          font: "20px Arial",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);

    this.load.on("progress", (value: number) => {
      loadingText.setText(`Loading... ${Math.round(value * 100)}%`);
    });

    // Remove the loading text when loading is complete
    this.load.on("complete", () => {
      loadingText.destroy();
      graphics.destroy();
    });

    this.load.setPath("assets/dict_fight");

    this.load.audio("music_dict", "audio/boring.mp3");

    this.load.image("background_dict", "image/background.jpg");
    this.load.image("wall_dict", "image/wall.png");
    this.load.image("title_dict", "image/title.png");
    this.load.image("projectile_dict", "image/projectile.png");
  }

  create() {
    this.music = this.sound.add("music_dict");

    this.music.play("", {
      volume: 0.7,
    });

    if (this.input.keyboard?.createCursorKeys()) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    this.background = this.add.image(
      position(2, 1, "w"),
      position(2, 1, "h"),
      "background_dict"
    );
    // this.background.setScale(0.8, 0.7);

    this.title = this.add.image(
      position(2, 1, "w"),
      position(8, 7, "h"),
      "title_dict"
    );

    this.wall = this.physics.add.staticGroup();
    const scale = 0.2;
    for (let i = 0; i < 40; i++) {
      const wallObject = this.wall.create(
        0,
        0,
        "wall_dict"
      ) as Phaser.Physics.Arcade.Image;
      wallObject.setScale(scale);
      wallObject.refreshBody();
      wallObject.body?.setSize(wallObject.height * 0.1, wallObject.width * 0.1);
    }
    Actions.PlaceOnRectangle(
      this.wall.getChildren(),
      new Phaser.Geom.Rectangle(
        position(4, 1, "w"),
        position(4, 3, "h"),
        position(4, 2, "w"),
        position(4, 2, "h")
      )
    );
    this.wall.refresh();

    this.lives_text = this.add.text(
      position(25, 1, "w"),
      position(18, 3, "h"),
      "Vidas ",
      {
        fontFamily: "Kenney Mini Square",
        fontSize: 70,
        color: this.text_color,
        align: "center",
        wordWrap: { width: 700, useAdvancedWrap: true },
        fontStyle: "bold",
      }
    );

    // Add heart images
    for (let i = 0; i < 3; i++) {
      const heart = this.add.image(
        this.lives_text.x + this.lives_text.width + 50 + i * 60,
        this.lives_text.y + this.lives_text.height / 2,
        "hearth"
      );
      heart.setScale(0.1);
      this.heartImages.push(heart);
    }

    // Add timer text
    this.timer_text = this.add.text(
      position(25, 15, "w"),
      position(18, 3, "h"),
      "Tiempo: 20",
      {
        fontFamily: "Kenney Mini Square",
        fontSize: 70,
        color: this.text_color,
        align: "center",
        wordWrap: { width: 700, useAdvancedWrap: true },
        fontStyle: "bold",
      }
    );

    this.player = this.physics.add.image(
      position(2, 1, "w"),
      position(2, 1, "h"),
      "player"
    );

    this.player.body.setSize(this.player.height * 0.9, this.player.width * 1.1);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.wall);

    this.projectiles = this.physics.add.group();

    this.physics.add.overlap(
      this.player,
      this.projectiles,
      this.hitProjectile as Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Set up timer to spawn projectiles
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnProjectile,
      callbackScope: this,
      loop: true,
    });

    // Set up countdown timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-300);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(300);
    }
  }

  spawnProjectile() {
    const projectile = this.projectiles.create(
      this.player.x,
      0,
      "projectile_dict"
    ) as Types.Physics.Arcade.ImageWithDynamicBody;
    projectile.setScale(0.12, 0.15);
    projectile.setAngle(90);
    projectile.refreshBody();
    projectile.body.setSize(projectile.height * 0.6, projectile.width * 0.6);

    const angle = Phaser.Math.Angle.Between(
      projectile.x,
      projectile.y,
      this.player.x,
      this.player.y
    );

    const speed = 100;
    projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  updateTimer() {
    this.timeLeft--;
    this.timer_text.setText(`Tiempo: ${this.timeLeft}`);

    if (this.timeLeft <= 0) {
      globalData.arenasVisited.arena1.owned = true;
      globalData.newData = true;
      globalData.arenasVisited.arena2.allowed = true;
      globalData.modelLevel += 1;
      this.endGame("Ganaste!");
    }
  }

  hitProjectile(
    player: GameObjects.GameObject,
    projectile: GameObjects.GameObject
  ) {
    const sfx = this.sound.add("sfx");
    sfx.play();
    this.lives--;

    if (this.lives >= 0 && this.lives < this.heartImages.length) {
      this.heartImages[this.lives].setVisible(false);
    }

    projectile.destroy();

    if (this.lives <= 0) {
      this.endGame("Perdiste!");
    }
  }

  endGame(message: string) {
    this.lives = 3;
    this.heartImages = [];
    this.timeLeft = 15;

    this.music.stop();
    this.timerEvent.remove();
    this.physics.pause();
    this.add
      .text(position(2, 1, "w"), position(2, 1, "h"), message, {
        fontFamily: "Kenney Mini Square",
        fontSize: 70,
        color: this.text_color,
        align: "center",
        wordWrap: { width: 700, useAdvancedWrap: true },
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.time.delayedCall(
      2000,
      () => {
        this.scene.start("Map");
      },
      [],
      this
    );
  }
}
