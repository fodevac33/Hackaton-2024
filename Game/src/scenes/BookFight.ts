import { GameObjects, Types, Physics, Actions, Sound } from "phaser";
import { Scene } from "phaser";
import { position } from "../main";
import { globalData } from "../main";

export class BookFight extends Scene {
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
  timeLeft: number = 10; // 60 seconds countdown
  timerEvent: Phaser.Time.TimerEvent;
  music: Sound.NoAudioSound | Sound.HTML5AudioSound | Sound.WebAudioSound;

  text_color = "#7d6e31";

  constructor() {
    super("BookFight");
  }

  preload() {
    this.cameras.main.fadeIn(3000);
    this.load.setPath("assets/book_fight");

    this.load.audio("bach_book", "audio/bach_fugue.mp3");

    this.load.image("shakespire_book", "image/shakespire.png");
    this.load.image("wall_book", "image/wall.jpg");
    this.load.image("title_book", "image/title.png");
    this.load.image("projectile_book", "image/projectile.png");
  }

  create() {
    this.music = this.sound.add("bach_book");
    this.music.play("", {
      volume: 0.7,
      detune: 0,
    });

    if (this.input.keyboard?.createCursorKeys()) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    this.background = this.add.image(
      position(2, 1, "w"),
      position(2, 1, "h"),
      "shakespire_book"
    );
    this.background.setScale(0.8, 0.7);

    this.title = this.add.image(
      position(2, 1, "w"),
      position(8, 7, "h"),
      "title_book"
    );

    this.wall = this.physics.add.staticGroup();
    const scale = 0.15;
    for (let i = 0; i < 55; i++) {
      const wallObject = this.wall.create(
        0,
        0,
        "wall_book"
      ) as Phaser.Physics.Arcade.Image;
      wallObject.setScale(scale);
      wallObject.refreshBody();
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
      "Tiempo: 60",
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

    this.player.body.setSize(this.player.height * 0.9, this.player.width * 1);
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

    if (this.lives == 0) {
      this.music.stop();
      this.scene.start("Map");
    }
  }

  spawnProjectile() {
    const projectile = this.projectiles.create(
      this.player.x,
      0,
      "projectile_book"
    ) as Types.Physics.Arcade.ImageWithDynamicBody;
    projectile.setScale(0.12, 0.15);
    projectile.setAngle(90);
    projectile.refreshBody();
    projectile.body.setSize(projectile.height * 0.9, projectile.width * 0.9);

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
