/**
 * Monstruo al que tenemos que destruir
 */
class Enemy extends Character {
    /**
     * @param game {Game} La instancia del juego al que pertenece el personaje
     */
    constructor (game) {
        const height = ENEMY_HEIGHT * game.width / 100,
            width = ENEMY_WIDTH * game.width / 100,
            x = getRandomNumber(game.width - width / 2),
            y = 0,
            speed = ENEMY_SPEED,
            myImage = "assets/malo.png",
            myImageDead = "assets/malo_muerto.png";

        super(game, width, height, x, y, speed, myImage, myImageDead);
        this.direction = "R"; // Dirección hacia la que se mueve el monstruo
        setTimeout(() => this.shoot(), 1000 + getRandomNumber(2500));
    }

    /**
     * Crea un nuevo disparo
     */
    shoot () {
        if (!this.dead && !this.game.ended) {
            this.game.shoot(this);
            setTimeout(() => this.shoot(), 1000 + getRandomNumber(2500));
        }
    }

    /**
     * Actualiza los atributos de posición del monstruo
     */
    update () {
        if (!this.dead && !this.game.ended) {
            this.y += this.speed;
            if (this.y > this.game.height) {
                this.y = 0;
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

    /**
     * Mata al monstruo
     */
    die() {
        
        if (!this.dead) {
            setTimeout(() => {
                this.game.removeEnemy();
            }, 2000);
            super.die();
        }

    }
}