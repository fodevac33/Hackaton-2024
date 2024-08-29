import Phaser from "phaser";

export class Fight extends Phaser.Scene
{
    player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
      super("Fight");
    }

    create ()
    {
      if (this.input.keyboard?.createCursorKeys()) {
        this.cursors = this.input.keyboard?.createCursorKeys();
      }

      this.player = this.physics.add.image(400, 300, 'player');
      this.player.setScale(4)

      this.player.setCollideWorldBounds(true);
    }

    update ()
    {
        this.player.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-300);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(300);
        }

        if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-300);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocityY(300);
        }
    }
}