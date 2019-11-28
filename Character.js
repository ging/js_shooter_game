class Character extends Entity {
    constructor (game, width, height, x, y, speed, myImage, myImageDead) {
        super(game, width, height, x, y, speed, myImage, myImageDead);
        this.dead = false;
        this.myImageDead = myImageDead;
    }

    die() {
        if (!this.dead) {
            this.myImage.src = this.myImageDead;
            this.dead = true;
            setTimeout(() => {
                console.log(this, typeof this)
                if (this instanceof Player) {
                    this.game.endGame();
                } else {
                    this.game.removeEnemy();
                }
                document.body.removeChild(this.myImage);
            }, 2000);
        }
    }
}

