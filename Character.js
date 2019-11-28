class Character extends Entity {
    constructor (game, width, height, x, y, speed, myImage, myImageDead) {
        super(game, width, height, x, y, speed, myImage, myImageDead);
        this.dead = false;
        this.myImageDead = myImageDead;
    }

    die() {
        this.myImage.src = this.myImageDead;
        this.dead = true;
        setTimeout(() => {
            document.body.removeChild(this.myImage);
        }, 2000);
    }
}

