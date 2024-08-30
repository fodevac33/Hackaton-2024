import { GameObjects, Types } from "phaser";

import { Scene } from "phaser";

export class Fight extends Scene
{
  background: GameObjects.Image;
  title: GameObjects.Image;
  player: Types.Physics.Arcade.ImageWithDynamicBody;
  wall: Types.Physics.Arcade.ImageWithStaticBody
  cursors: Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("Fight");
  }

  preload() {
    this.load.setPath("assets/book_fight");

    this.load.audio('bach', 'audio/bach_cantata.mp3');
    this.load.image('shakespire', 'image/shakespire.png');
    this.load.image('wall', 'image/wall.jpg');
    this.load.image('title', 'image/title.png')
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/mushroom.png');
  }

  create() {
    const music = this.sound.add('bach');

    if (this.input.keyboard?.createCursorKeys()) {
      this.cursors = this.input.keyboard?.createCursorKeys();
    }

    this.background = this.add.image(512, 384, "shakespire")
    this.title = this.add.image(512, 110, "title")

    this.wall = this.physics.add.staticImage(600, 400, 'wall');
    this.wall.setScale(0.2)
    this.wall.refreshBody()

    this.player = this.physics.add.image(400, 300, 'player');
    this.player.setScale(4)
    this.player.setCollideWorldBounds(true)

    this.physics.add.collider(this.player, this.wall);
    
    // music.play();
  }

  update () {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-300);
    }
    else if (this.cursors.down.isDown) {
      this.player.setVelocityY(300);
    }
  }
}