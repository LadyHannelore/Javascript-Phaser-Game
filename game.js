class mainScene {
    preload() {
        // Loads the myne and book images.
        this.load.image('myne', 'assets/myne.png');
        this.load.image('book', 'assets/book.png');
    }

    create() {
        // Creates the myne sprite and sets its initial position.
        this.myne = this.physics.add.sprite(100, 100, 'myne');

        // Creates the book sprite and sets its initial position.
        this.book = this.physics.add.sprite(300, 300, 'book');

        // Stores the score of the myne.
        this.score = 0;

        // The style configuration for the score text.
        let style = { font: '20px Arial', fill: '#fff' };

        // Displays the score on the screen.
        this.scoreText = this.add.text(20, 20, 'score: ' + this.score, style);

        // Creates arrow keys for myne movement.
        this.arrow = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Checks if the myne is overlapping with the book.
        if (this.physics.overlap(this.myne, this.book)) {
            // Calls the hit() method when myne and book overlap.
            this.hit();
        }

        // Handles horizontal movements based on arrow key input.
        if (this.arrow.right.isDown) {
            this.myne.x += 3;
        } else if (this.arrow.left.isDown) {
            this.myne.x -= 3;
        }

        // Handles vertical movements based on arrow key input.
        if (this.arrow.down.isDown) {
            this.myne.y += 3;
        } else if (this.arrow.up.isDown) {
            this.myne.y -= 3;
        }
    }

    hit() {
        // Moves the book to a random position.
        this.book.x = Phaser.Math.Between(100, 600);
        this.book.y = Phaser.Math.Between(100, 300);

        // Increases the score by 10.
        this.score += 10;

        // Updates the score text on the screen.
        this.scoreText.setText('score: ' + this.score);

        // Creates a tween effect on the myne.
        this.tweens.add({
            targets: this.myne,
            duration: 200,
            scaleX: 1.5,
            scaleY: 1.5,
            yoyo: true,
        });
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
