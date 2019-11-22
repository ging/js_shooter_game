class Enemy extends Character {
    constructor (game, width, height, x, y, speed, myImage) {
        super(game, width, height, x, y, speed, myImage);
        this.direction = "R";
        setTimeout(() => this.shoot(), 1000 + getRandomNumber(2500));
    }

    shoot () {
        if (!this.dead && !this.game.ended) {
            this.game.shoot(this);
            setTimeout(() => this.shoot(), 1000 + getRandomNumber(2500));
        }
    }

    die () {
        if (!this.dead) {
            this.myImage.src = "assets/malo_muerto.png";
            this.dead = true;
            setTimeout(() => {
                    this.game.removeEnemy();
                    document.body.removeChild(this.myImage);
                }, 2000);
        }
    }

    update () {
        if (!this.dead && !this.game.ended) {
            this.y = this.y + this.speed;
            if (this.y > this.game.height) {
                this.game.removeEnemy();
                document.body.removeChild(this.myImage);
            }
            if (this.direction === "R") { // Right movement
                if (this.x < this.game.width - this.width - this.speed) {
                    this.x = this.x + this.speed;
                } else {
                    this.horizontalMov = 0;
                }
            } else if (this.x > this.speed) {
                this.x = this.x - this.speed;
            } else {
                this.horizontalMov = 0;
            }
            this.horizontalMov = this.horizontalMov - this.speed; // Update the remaining movement
            if (this.horizontalMov < this.speed) {
                this.horizontalMov = getRandomNumber(this.game.width / 2);
                this.direction = this.direction === "R" ? "L" : "R"; // Change direction
            }
        }
    }

    render () {
        this.myImage.style.top = `${this.y}px`;
        this.myImage.style.left = `${this.x}px`;
    }
}