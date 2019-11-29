class Shot extends Entity {
    constructor (game, character) {
        const width = SHOT_WIDTH * game.width / 100;
        const height = SHOT_HEIGHT * game.width / 100;
        const x = character.x + character.width / 2 - width / 2;
        const y = character.y + character.height - character.height / 2;
        const speed = SHOT_SPEED;
        const myImage = character.type === "PLAYER" ? "assets/shot1.png" : "assets/shot2.png";
        super(game, width, height, x, y, speed, myImage);
        this.type = character instanceof Player ? "PLAYER" : "ENEMY";
    }

    update () {
        if (this.type === "PLAYER") {
            this.y = this.y - this.speed; // Goes up
        } else {
            this.y = this.y + this.speed; // Goes down
        }
        if (this.y < 0 || this.y > this.game.height) {
            this.game.removeShot(this);
            document.body.removeChild(this.myImage);
        }
    }
}