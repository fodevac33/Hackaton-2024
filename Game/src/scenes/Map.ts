import { Scene } from "phaser";
import { resolution } from "../main";

export class Map extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  controls: Phaser.Cameras.Controls.FixedKeyControl;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursor: Phaser.Types.Input.Keyboard.CursorKeys;
  gpu: Phaser.GameObjects.Image;
  score: Phaser.GameObjects.Text;

  constructor() {
    super("Map");
  }

  preload() {
    this.cameras.main.fadeIn(6000);
  }

  create() {
    this.camera = this.cameras.main;
    const map = this.make.tilemap({ key: "map" });
    this.camera.setZoom(2.8, 2.8);
    this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.gpu = this.add.image(100, 50, "gpu");
    this.gpu.setScale(0.15);
    this.gpu.setScrollFactor(0);
    this.gpu.setDepth(20);

    let score = 0;
    this.score = this.add.text(160, 18, score.toString(), {
      fontFamily: "Kenney Mini Square",
      fontSize: 40,
      color: "#fff",
      stroke: "#000",
      strokeThickness: 5,
      align: "center",
      fontStyle: "bold",
    });
    this.score.setScrollFactor(0);
    this.score.setDepth(20);

    const tileset1 = map.addTilesetImage("base_design_opt2", "tile1");
    const tileset2 = map.addTilesetImage("base_design", "tile2");
    this.player = this.physics.add.sprite(400, 350, "player", "misa-front");

    if (!tileset1 || !tileset2) {
      return null;
    }

    const belowLayer = map.createLayer(
      "BelowPlayer",
      [tileset1, tileset2],
      0,
      0
    );
    const worldLayer = map.createLayer("World", [tileset1, tileset2], 0, 0);
    const aboveLayer = map.createLayer(
      "AbovePlayer",
      [tileset1, tileset2],
      0,
      0
    );

    if (!worldLayer || !aboveLayer) {
      return null;
    }

    worldLayer.setCollisionBetween(12, 44);
    worldLayer.setCollisionByProperty({ collides: true });

    // On top of the player
    aboveLayer.setDepth(10);

    // To check if collisions works

    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // worldLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });

    const spawnLayer = map.getObjectLayer("Spawn Point");

    const spawnPoint = spawnLayer?.objects.find(
      (obj) => obj.name === "" // Find the object with an empty name
    );
    console.log(spawnPoint);

    if (spawnPoint && spawnPoint.x && spawnPoint.y) {
      this.player = this.physics.add
        .sprite(spawnPoint.x, spawnPoint.y, "player", "misa-front")
        .setSize(30, 40)
        .setOffset(0, 24);
    }

    this.physics.add.collider(this.player, worldLayer);

    this.player.setScale(0.4);

    // Animations player

    const anims = this.anims;
    anims.create({
      key: "misa-left-walk",
      frames: anims.generateFrameNames("player", {
        prefix: "misa-left-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "misa-right-walk",
      frames: anims.generateFrameNames("player", {
        prefix: "misa-right-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "misa-front-walk",
      frames: anims.generateFrameNames("player", {
        prefix: "misa-front-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "misa-back-walk",
      frames: anims.generateFrameNames("player", {
        prefix: "misa-back-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Collisions

    // Movement camera
    if (this.input.keyboard?.createCursorKeys()) {
      this.cursor = this.input.keyboard?.createCursorKeys();
      this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
        camera: this.camera,
        left: this.cursor.left,
        right: this.cursor.right,
        up: this.cursor.up,
        down: this.cursor.down,
        speed: 0.8,
      });
    }

    this.player = this.player.setDepth(20);
    this.camera.startFollow(this.player);
    this.camera.setBackgroundColor(0x00ff00);
  }

  update(time: number, delta: number): void {
    this.controls.update(delta);
    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();

    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursor.left.isDown) {
      this.player.body.setVelocityX(-100);
    } else if (this.cursor.right.isDown) {
      this.player.body.setVelocityX(100);
    }

    // Vertical movement
    if (this.cursor.up.isDown) {
      this.player.body.setVelocityY(-100);
    } else if (this.cursor.down.isDown) {
      this.player.body.setVelocityY(100);
    }

    this.player.body.velocity.normalize().scale(speed);

    if (this.cursor.left.isDown) {
      this.player.anims.play("misa-left-walk", true);
    } else if (this.cursor.right.isDown) {
      this.player.anims.play("misa-right-walk", true);
    } else if (this.cursor.up.isDown) {
      this.player.anims.play("misa-back-walk", true);
    } else if (this.cursor.down.isDown) {
      this.player.anims.play("misa-front-walk", true);
    } else {
      this.player.anims.stop();
    }

    if (prevVelocity.x < 0) this.player.setTexture("player", "misa-left");
    else if (prevVelocity.x > 0) this.player.setTexture("player", "misa-right");
    else if (prevVelocity.y < 0) this.player.setTexture("player", "misa-back");
    else if (prevVelocity.y > 0) this.player.setTexture("player", "misa-front");
  }
}
