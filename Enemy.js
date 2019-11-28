 class Enemy extends Character {
    constructor (game) {
        const height = ENEMY_HEIGHT * game.width / 100,
            width = ENEMY_WIDTH * game.width / 100,
            x = getRandomNumber(game.width - width / 2),
            y = 0,
            speed = ENEMY_SPEED,
            myImage = "assets/malo.png",
            myImageDead = "assets/malo_muerto.png";

        super(game, width, height, x, y, speed, myImage, myImageDead);
        this.direction = "R";
        setTimeout(() => this.shoot(), 1000 + getRandomNumber(2500));
    }

    shoot () {
        if (!this.dead && !this.game.ended) {
            this.game.shoot(this);
            setTimeout(() => this.shoot(), 1000 + getRandomNumber(2500));
        }
    }

    update () {
        if (!this.dead && !this.game.ended) {
            this.y += this.speed;
            if (this.y > this.game.height) {
                this.game.removeEnemy();
                document.body.removeChild(this.myImage);
            }
            if (this.direction === "R") { // Right movement
                if (this.x < this.game.width - this.width - this.speed) {
                    this.x += this.speed;
                } else {
                    this.horizontalMov = 0;
                }
            } else if (this.x > this.speed) {
                this.x -= this.speed;
            } else {
                this.horizontalMov = 0;
            }
            this.horizontalMov -= this.speed; // Update the remaining movement
            if (this.horizontalMov < this.speed) {
                this.horizontalMov = getRandomNumber(this.game.width / 2);
                this.direction = this.direction === "R" ? "L" : "R"; // Change direction
            }
        }
    }
}