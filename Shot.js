class Shot {
    constructor (game, character) {
        this.game = game;
        this.speed = 20;
        this.type = character instanceof Player ? "PLAYER" : "ENEMY";
        this.height = SHOT_HEIGHT * this.game.width / 100;
        this.width = SHOT_WIDTH * this.game.width / 100;
        this.myImage = new Image(this.width, this.height);
        this.myImage.src = this.type === "PLAYER" ? "assets/shot1.png" : "assets/shot2.png";
        this.myImage.style.position = "absolute";
        this.x = character.x;
        this.y = character.y;
        this.myImage.style.top = `${this.y}px`;
        this.myImage.style.left = `${this.x}px`;
        document.body.appendChild(this.myImage);
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

    render () {
        this.myImage.style.top = `${this.y}px`;
        this.myImage.style.left = `${this.x}px`;
    }
}