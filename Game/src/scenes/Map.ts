import { Scene } from "phaser";
import { globalData, resolution } from "../main";
import { glob } from "fs";

export class Map extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  controls: Phaser.Cameras.Controls.FixedKeyControl;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursor: Phaser.Types.Input.Keyboard.CursorKeys;
  model_idle: Phaser.GameObjects.Image;
  gpu: Phaser.GameObjects.Image;
  score: Phaser.GameObjects.Text;
  modelZone: Phaser.GameObjects.Zone;
  dictionary: Phaser.GameObjects.Image;
  books: Phaser.GameObjects.Image;
  fightTriggered: boolean;

  constructor() {
    super("Map");
  }

  preload() {
    this.cameras.main.fadeIn(3000);
  }

  create() {
    this.camera = this.cameras.main;
    const map = this.make.tilemap({ key: "map" });
    this.camera.setZoom(2.8, 2.8);
    this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Interface global
    this.gpu = this.add.image(360, 270, "gpu");
    this.gpu.setScale(0.06);
    this.gpu.setScrollFactor(0);
    this.gpu.setDepth(20);

    const dataInterface = [
      {
        name: "dictionary",
        x: 670,
        y: 270,
        scale: 0.04,
        owned: globalData.arenasVisited.arena1.owned,
      },
      {
        name: "books",
        x: 640,
        y: 270,
        scale: 0.07,
        owned: globalData.arenasVisited.arena2.owned,
      },
      {
        name: "calculator",
        x: 610,
        y: 270,
        scale: 0.06,
        owned: globalData.arenasVisited.arena3.owned,
      },
      {
        name: "router",
        x: 580,
        y: 270,
        scale: 0.03,
        owned: globalData.arenasVisited.arena5.owned,
      },
      {
        name: "keyboard",
        x: 540,
        y: 270,
        scale: 0.04,
        owned: globalData.arenasVisited.arena4.owned,
      },
    ];

    dataInterface.forEach((data) => {
      const image = this.add.image(data.x, data.y, data.name);
      console.log(image);

      image.setScale(data.scale);
      image.setScrollFactor(0);
      image.setDepth(20);

      (this as Record<string, any>)[data.name] = image;

      if (!data.owned) {
        image.setAlpha(0.3);
      }
    });

    this.score = this.add.text(385, 258, globalData.teraflops.toString(), {
      fontFamily: "Kenney Mini Square",
      fontSize: 14,
      color: "#fff",
      stroke: "#000",
      strokeThickness: 3,
      align: "center",
    });

    this.score.setScrollFactor(0);
    this.score.setDepth(40);

    /////

    const tileset1 = map.addTilesetImage("base_design_opt2", "tile1");
    const tileset2 = map.addTilesetImage("base_design", "tile2");
    this.player = this.physics.add.sprite(400, 350, "player", "misa-front");

    this.anims.create({
      key: "model_idle",
      frames: this.anims.generateFrameNumbers("model_idle", {
        start: 0,
        end: 4,
      }),
      frameRate: 5,
      repeat: -1,
    });

    const model_idle = this.add.sprite(
      map.widthInPixels / 2 + 45,
      map.heightInPixels / 2 + 95,
      "model_idle"
    );
    model_idle.play("model_idle");
    model_idle.setScale(globalData.modelLevel);

    if (!tileset1 || !tileset2) {
      return null;
    }

    // Dont erase this line!
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
    const borderLayer = map.createLayer("Border", [tileset1, tileset2], 0, 0);
    borderLayer?.setCollisionByProperty({ collides: true });
    borderLayer?.setVisible(false);

    if (!worldLayer || !aboveLayer) {
      return null;
    }

    if (!worldLayer || !borderLayer) {
      return null;
    }

    worldLayer.setCollisionBetween(12, 44);
    worldLayer.setCollisionByProperty({ collides: true });

    // On top of the player
    aboveLayer.setDepth(10);

    // To check if collisions works

    const spawnLayer = map.getObjectLayer("Spawn Point");
    const spawnPoint = spawnLayer?.objects.find(
      (obj) => obj.name === "" // Find the object with an empty name
    );

    const setSpawnPoint = (x: number, y: number) => {
      this.player = this.physics.add
        .sprite(x, y, "player", "misa-front")
        .setSize(30, 40)
        .setOffset(0, 24);
    };

    if (
      spawnPoint &&
      spawnPoint.x &&
      spawnPoint.y &&
      globalData.spawnPoint.x == 0
    ) {
      setSpawnPoint(spawnPoint?.x, spawnPoint?.y - 100);
      globalData.spawnPoint = { x: spawnPoint.x, y: spawnPoint.y - 100 };
    } else {
      setSpawnPoint(globalData.spawnPoint.x, globalData.spawnPoint.y);
    }

    //--------------------------------LOGICA FIGHT---------------------------------//

    const arenasLayer = map.getObjectLayer("Arenas");

    if (arenasLayer) {
      const arenas = this.physics.add.staticGroup();
      arenasLayer.objects.forEach((objData) => {
        const { x = 0, y = 0, width = 0, height = 0, name = "" } = objData;
        const arena = this.add.rectangle(
          x + width / 2,
          y + height / 2,
          width - 20,
          height - 20
        );
        arena.setData("name", name);
        arenas.add(arena);
      });

      this.physics.add.overlap(this.player, arenas, (player, arena) => {
        globalData.spawnPoint = { x: this.player.x, y: this.player.y };

        if (arena instanceof Phaser.GameObjects.GameObject) {
          const arenaName = arena.getData(
            "name"
          ) as keyof typeof globalData.arenasVisited;

          if (
            !globalData.arenasVisited[arenaName].owned &&
            globalData.arenasVisited[arenaName].allowed
          ) {
            const nextScene = globalData.arenasVisited[arenaName].scene;
            this.score.setText(globalData.teraflops.toString());
            this.scene.start(nextScene);
          }
        }
      });
    }
    //--------------------------------/LOGICA FIGHT---------------------------------//
    //--------------------------------LOGICA HOME---------------------------------//
    // const modelHome = map.getObjectLayer("Model");
    //-----------------------------SE AGREGA TERAFLOPS EN EL MAPA---------------------------//
    const teraflopLayer = map.getObjectLayer("Teraflops");
    if (teraflopLayer) {
      const teraflops = this.physics.add.group({
        classType: Phaser.Physics.Arcade.Image,
      });

      const numTeraflops = 5;
      let count = 0;
      while (count < numTeraflops) {
        const x = Phaser.Math.RND.between(0, map.widthInPixels);
        const y = Phaser.Math.RND.between(0, map.heightInPixels);
        // Comprobar si la posición está en una zona no colisionable
        if (
          !worldLayer.getTileAtWorldXY(x, y) ||
          !worldLayer.getTileAtWorldXY(x, y).collides
        ) {
          const teraflop = this.physics.add.image(x, y, "gpu");
          teraflop.setScale(0.035);
          teraflop.setInteractive();
          teraflops.add(teraflop);
          count++;
        }
      }

      this.physics.add.overlap(this.player, teraflops, (player, teraflop) => {
        globalData.spawnPoint = { x: this.player.x, y: this.player.y };
        this.scene.start("Info");
        teraflop.destroy();
        globalData.teraflops += 1;
        this.score.setText(globalData.teraflops.toString());
      });
    }

    //-----------------------------/SE AGREGA TERAFLOPS EN EL MAPA---------------------------//
    //------------------------------SE AGREGA MODEL EN EL INICIO---------------------------------//
    const modelHome = map.getObjectLayer("Model")["objects"][0];
    this.modelZone = this.add.zone(
      modelHome?.x + modelHome.width / 2,
      modelHome?.y + modelHome.height / 2,
      modelHome?.width - 40,
      modelHome?.height - 60
    );
    this.physics.world.enable(this.modelZone);
    this.modelZone.body.setAllowGravity(false);
    // In the create method, add an overlap collider
    this.physics.add.overlap(this.player, this.modelZone, () => {
      globalData.spawnPoint = { x: this.player.x, y: this.player.y };
      this.score.setText(globalData.teraflops.toString());
      this.scene.start("TrainingModel");
    });

    //------------------------------/SE AGREGA MODEL EN EL INICIO---------------------------------//

    this.physics.add.collider(this.player, worldLayer);
    this.physics.add.collider(this.player, borderLayer);

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
    model_idle.setDepth(20);

    this.camera.startFollow(this.player);
    this.camera.setBackgroundColor(0x00ff00);
  }

  update(time: number, delta: number): void {
    this.controls.update(delta);
    const speed = 175;

    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursor.left.isDown) {
      this.player.body.setVelocityX(-100);
    } else if (this.cursor.right.isDown) {
      this.player.body.setVelocityX(100);
    }

    // Vertical movement
    if (this.cursor.up.isDown) {
      this.player.body.setVelocityY(-1);
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
  }
}
