import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import skyImg from './assets/sky.png';
import groundImg from './assets/platform.png'
import starImg from './assets/star.png'
import bombImg from './assets/bomb.png'
import dudeImg from './assets/hero1.png'
import slimeImg from './assets/slime.png'
import tileset from './assets/tileset.png'
import worldMusic from './assets/Story2.ogg'
import hitSound from './assets/Hit.mp3'



class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();

        this.score = 0,
        this.scoreText = "",
        this.health = 5
        this.healthText = ""
        this.gameOver = false
        this.facing = 'front';
        this.isHitting = 'false'
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        let itemChance = Phaser.Math.Between(1, 500000)
        console.log(itemChance)
        if (itemChance >= 490000) {
            console.log("YOU GOT A COMMON ITEM!!!!!")
        }
        this.score += 1;
        this.scoreText.setText('money: ' + this.score);
        console.log("score: ", this.score)
        if (this.stars.countActive(true) === 0)
        {
            this.stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        }
    }

    Damage (player, bomb)
{

    this.player.setTint(0xff0000);

    this.player.anims.play('turn');

    this.health--
    this.healthText.setText('health: ' + this.health)
    console.log(this.health)
    if (this.health === 0) {
    this.gameOver = true;
    this.physics.pause();
    }
}


    preload ()
    {

        this.load.image('logo', logoImg);
        this.load.image('sky', skyImg);
        this.load.image('ground', groundImg);
        this.load.image('star', starImg);
        this.load.image('bomb', bombImg);
        this.load.spritesheet('slime',
            slimeImg,
            { frameWidth: 32, frameHeight: 33 });
        this.load.spritesheet('tileset',
            tileset,
            { frameWidth: 32, frameHeight: 33 });
        this.load.audio("storyMusic", worldMusic)
        this.load.audio("hitSound", hitSound)
        this.load.spritesheet('dude',
            dudeImg,
            // setting the frameHeight to 33 removes some odd pixels
            { frameWidth: 32, frameHeight: 33 }
        );

    }

// var platforms is defined outside the create function in the tutorial, don't know if this will come back to bite us

    create ()
    {
        this.add.image(400, 300, 'sky');
        let music = this.sound.add('storyMusic', { loop: true })
        music.play()
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        this.platforms = this.physics.add.staticGroup();

         // this.tilesets.create(400, 568, 'tileset').setScale(2).refreshBody();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'faceingLeft',
            frames: [{ key: 'dude', frame: 4 } ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 1 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'faceingRight',
            frames: [{ key: 'dude', frame: 7 } ],
            frameRate: 10,
            repeat: -1
        });

        this.bombs = this.physics.add.group();
        this.tilesets = this.physics.add.group()
        this.slimes = this.physics.add.group();


        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.slimes, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.Damage, null, this);
        this.physics.add.collider(this.player, this.slimes, this.Damage, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.scoreText = this.add.text(16, 16, 'money: 0', { fontSize: '32px', fill: '#000' });
        this.healthText = this.add.text(16, 40, 'health: 5', { fontSize: '32px', fill: '#000' });
    }

    update ()


{
    // used to determine which direction the player is facing


    var cursors = this.input.keyboard.createCursorKeys();

    let monsterChance = Phaser.Math.Between(1, 500000)

    if (monsterChance > 499000) {
            console.log("YOU ARE FACING: ", this.facing)
            var x = Phaser.Math.Between(0, 800);
            console.log("PUT A MONSTER HERE")

            // slimes only move on the X axis , maybe do a little bounce?

            // var slime = this.slimes.create(x, 16, 'slime');
            // slime.setCollideWorldBounds(true);
            // // ^ see what happens if this is false^
            // slime.setVelocity(Phaser.Math.Between(-200, 200), 20);

                // var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

                var slime = this.slimes.create(x, 16, 'slime');
                slime.setCollideWorldBounds(true);
                slime.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }

    // var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    //         var bomb = this.bombs.create(x, 16, 'slime');
    //         bomb.setCollideWorldBounds(true);
    //         bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);



    // to create a "hit" when standing still, check the last button pressed between left and right
    // if right hit right if left hit left


    if (cursors.left.isDown)
{
    this.facing = 'left';
    this.player.setVelocityX(-160);

    this.player.anims.play('left', true);
}
else if (cursors.right.isDown)
{
    this.facing = 'right';
    this.player.setVelocityX(160);

    this.player.anims.play('right', true);
}
else
{
    this.player.setVelocityX(0);
    if (this.facing === 'right') {
        this.player.anims.play('faceingRight', true);
    } else if (this.facing === 'left') {
        this.player.anims.play('faceingLeft', true);
    }

    // this.player.anims.play('turn');
}

if (cursors.up.isDown && this.player.body.touching.down)
{
    this.player.setVelocityY(-300);
}

if (cursors.space.isDown && !this.isHitting)
{

    // push enemy back on hit a little (depending on enemy weight)
    // hitbox above and in the direction of facing player
    console.log("punch")
    console.log("POSITION: ",this.player.body.position,"Velocity: ", this.player.body.velocity)
    console.log("you are facing", this.facing)
    this.isHitting = true;
    let hitSound = this.sound.add('hitSound')
    hitSound.play();
}

if (cursors.space.isUp)
{
    this.isHitting = false
}

}

}



const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: MyGame
};


const game = new Phaser.Game(config);
