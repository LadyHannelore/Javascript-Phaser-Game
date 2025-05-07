class mainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScene' });
    }

    preload() {
        this.load.image('myne', 'assets/myne.png');
        this.load.image('book', 'assets/book.png');
        this.load.image('snake', 'assets/snake.png'); // Add a snake segment image to assets
    }

    create() {
        this.myne = this.physics.add.sprite(100, 100, 'myne');
        this.book = this.physics.add.sprite(300, 300, 'book');
        this.score = 0;
        let style = { font: '20px Arial', fill: '#fff' };
        this.scoreText = this.add.text(20, 20, 'score: ' + this.score, style);
        this.arrow = this.input.keyboard.createCursorKeys();

        // Snake setup
        this.snakeLength = 8;
        this.snakeSegments = [];
        this.snakeHistory = [];
        this.snakeSpacing = 10;
        for (let i = 0; i < this.snakeLength; i++) {
            let seg = this.add.image(this.myne.x, this.myne.y, 'snake').setDepth(0);
            this.snakeSegments.push(seg);
        }

        this.gameOver = false;
        this.gameOverText = this.add.text(600, 350, '', { font: '40px Arial', fill: '#f00' }).setOrigin(0.5);
    }

    update() {
        if (this.gameOver) return;

        // Player movement
        if (this.arrow.right.isDown) this.myne.x += 3;
        else if (this.arrow.left.isDown) this.myne.x -= 3;
        if (this.arrow.down.isDown) this.myne.y += 3;
        else if (this.arrow.up.isDown) this.myne.y -= 3;

        // Book collection
        if (this.physics.overlap(this.myne, this.book)) this.hit();

        // Snake follows player
        this.snakeHistory.unshift({ x: this.myne.x, y: this.myne.y });
        if (this.snakeHistory.length > this.snakeLength * this.snakeSpacing) {
            this.snakeHistory.pop();
        }
        for (let i = 0; i < this.snakeSegments.length; i++) {
            let idx = (i + 1) * this.snakeSpacing;
            if (this.snakeHistory[idx]) {
                this.snakeSegments[i].x = this.snakeHistory[idx].x;
                this.snakeSegments[i].y = this.snakeHistory[idx].y;
            }
        }

        // Check collision with snake
        for (let seg of this.snakeSegments) {
            if (Phaser.Math.Distance.Between(this.myne.x, this.myne.y, seg.x, seg.y) < 24) {
                this.endGame();
                break;
            }
        }
    }

    hit() {
        this.book.x = Phaser.Math.Between(100, 1100);
        this.book.y = Phaser.Math.Between(100, 600);
        this.score += 10;
        this.scoreText.setText('score: ' + this.score);
        this.tweens.add({
            targets: this.myne,
            duration: 200,
            scaleX: 1.5,
            scaleY: 1.5,
            yoyo: true,
        });

        // Make snake longer every 30 points
        if (this.score % 30 === 0) {
            let lastSeg = this.snakeSegments[this.snakeSegments.length - 1];
            let seg = this.add.image(lastSeg.x, lastSeg.y, 'snake').setDepth(0);
            this.snakeSegments.push(seg);
            this.snakeLength++;
        }
    }

    endGame() {
        this.gameOver = true;
        this.gameOverText.setText('Game Over!\nScore: ' + this.score);
        this.myne.setTint(0xff0000);
    }
}

new Phaser.Game({
    width: 1200,
    height: 700,
    backgroundColor: '#659025',
    scene: mainScene,
    physics: { default: 'arcade' },
    parent: 'game',
});