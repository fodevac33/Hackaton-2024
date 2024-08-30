
import { GameObjects, Types, Physics, Actions } from "phaser";
import { Scene } from "phaser";
import { position } from "../main";

export class MathFight extends Scene {
  background: GameObjects.Image;
  title: GameObjects.Image;
  lives_text: GameObjects.Text;
  player: Types.Physics.Arcade.ImageWithDynamicBody;
  wall: Physics.Arcade.StaticGroup;
  cursors: Types.Input.Keyboard.CursorKeys;
  projectiles: Physics.Arcade.Group;
  lives: number = 3
  lifeText: string[]

  constructor() {
    super("MathFight");
  }

  preload() {
    this.background
    this.load.setPath("assets/math_fight");

    this.load.audio('music', 'audio/math.mp3');
    this.load.audio('sfx', 'audio/sfx.wav');

    this.load.image('background_', 'image/background.jpg');
    this.load.image('wall', 'image/wall.jpg');
    this.load.image('title', 'image/title.png');
    this.load.image('projectile', 'image/projectile.png');
  }

  create() {
    const music = this.sound.add('music');
    music.play('', {
      volume: 0.7
    });

    if (this.input.keyboard?.createCursorKeys()) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    this.background = this.add.image(position(2, 1, "w"), position(2, 1, "h"), "background_");
    // this.background.setScale(0.8, 0.7);

    this.title = this.add.image(position(2, 1, "w"), position(8, 7, "h"), "title");

    this.wall = this.physics.add.staticGroup();
    const scale = 0.2;
    for (let i = 0; i < 40; i++) {
      const wallObject = this.wall.create(0, 0, 'wall') as Phaser.Physics.Arcade.Image;
      wallObject.setScale(scale);
      wallObject.refreshBody();
      wallObject.body?.setSize(wallObject.height * 0.1, wallObject.width * 0.1)
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

    this.lifeText = [
      "Vidas I",
      "Vidas I I",
      "Vidas I I I"
    ]

    this.lives_text = this.add.text(position(25, 1, "w"), position(18, 3, "h"), this.lifeText[this.lives-1], {
      fontFamily: "Kenney Mini Square",
      fontSize: 70,
      color: "#7d6e31",
      align: "center",
      wordWrap: { width: 700, useAdvancedWrap: true },
      fontStyle: "bold",
    });

    this.player = this.physics.add.image(position(2, 1, "w"), position(2, 1, "h"), 'player');

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
      loop: true
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
    const projectile = this.projectiles.create(this.player.x, 0, 'projectile') as Types.Physics.Arcade.ImageWithDynamicBody;
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
    projectile.setVelocity(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    );
  }

  hitProjectile(player: GameObjects.GameObject, projectile: GameObjects.GameObject) {
    const sfx = this.sound.add('sfx')
    sfx.play()
    this.lives--

    this.lives_text.setText(this.lifeText[this.lives-1])

    projectile.destroy();
  }
}