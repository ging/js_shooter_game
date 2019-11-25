class Player extends Character {
    constructor (game, width, height, x, y, speed, myImage) {
        super(game, width, height, x, y, speed, myImage);
    }

    die () {
        if (!this.dead) {
            this.myImage.src = "assets/bueno_muerto.png";
            this.dead = true;
            setTimeout(() => {
                    this.game.endGame();
                    document.body.removeChild(this.myImage);
                }, 2000
            );
        }
    }
    update () {
        if (!this.dead) {
            switch (this.game.keyPressed) {
            case KEY_LEFT:
                if (this.x > this.speed) {
                    this.x = this.x - this.speed;
                }
                break;
            case KEY_RIGHT:
                if (this.x < this.game.width - this.width - this.speed) {
                    this.x = this.x + this.speed;
                }
                break;
            case KEY_SHOOT:
                this.game.shoot(this);
                break;
            }
        }
    }
}