class Entity {
    constructor (game, width, height, x, y, speed, myImage) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.myImage = new Image(this.width, this.height);
        this.myImage.src = myImage;
        this.myImage.style.position = "absolute";
        this.myImage.style.top = `${this.y}px`;
        this.myImage.style.left = `${this.x}px`;
        document.body.appendChild(this.myImage);
    }

    render () {
        this.myImage.style.top = `${this.y}px`;
        this.myImage.style.left = `${this.x}px`;
    }
}