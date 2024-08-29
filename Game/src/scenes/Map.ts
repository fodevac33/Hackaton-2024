import { Scene } from "phaser";

export class Map extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  controls: Phaser.Cameras.Controls.FixedKeyControl;

  constructor() {
    super("Map");
  }

  preload() {}

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

    if (tileset) {
      const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
      const worldLayer = map.createLayer("World", tileset, 0, 0);
      const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);
      if (worldLayer) {
        worldLayer.setCollisionBetween(12, 44);
        worldLayer.setCollisionByProperty({ collides: true });

        // To check if collisions works

        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // worldLayer.renderDebug(debugGraphics, {
        //   tileColor: null, // Color of non-colliding tiles
        //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
        // });
      }
    }

    // Collisions

    // Movement camera
    const cursor = this.input.keyboard?.createCursorKeys();
    if (cursor) {
      this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
        camera: this.camera,
        left: cursor.left,
        right: cursor.right,
        up: cursor.up,
        down: cursor.down,
        speed: 0.8,
      });
    }

    this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  update(time: number, delta: number): void {
    this.controls.update(delta);
  }
}
