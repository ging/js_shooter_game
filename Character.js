class Character {
    constructor (game, width, height, x, y, speed, myImage) {
        this.dead = false;
        this.game = game;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.myImage = myImage;
        this.myImage.style.position = "absolute";
        this.myImage.style.top = `${this.y}px`;
        this.myImage.style.left = `${this.x}px`;
        document.body.appendChild(this.myImage);
    }
}