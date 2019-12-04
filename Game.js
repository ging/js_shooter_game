/**
 * El propio juego
 */
class Game {
    /**
     * Inicializa un juego
     */
    constructor () {
        this.started = false; // Indica si el juego ha comenzado o no
        this.ended = false; // Indica si el juego ha terminado o no
        this.keyPressed = undefined; // Indica la tecla que está pulsando el usuario
        this.width = 0; // Ancho de la pantalla del juego
        this.height = 0; // Alto de la pantalla del juego
        this.player = undefined; // Instancia del personaje principal del juego
        this.playerShots = []; // Disparos del personaje principal
        this.enemy = undefined; // Instancia del monstruo del juego
        this.enemyShots = []; // Disparos del monstruo
        this.xDown = null; //  Posición en la que el usuario ha tocado la pantalla
    }

    /**
     * Da comienzo a la partida
     */
    start () {
        if (!this.started) {
            // RequestAnimationFrame(this.update());
            window.addEventListener("keydown", (e) => this.checkKey(e, true));
            window.addEventListener("keyup", (e) => this.checkKey(e, false));
            window.addEventListener("touchstart", (e) => this.handleTouchStart(e, true));
            window.addEventListener("touchmove", (e) => this.handleTouchMove(e, false));
            this.started = true;
            this.width = window.innerWidth;
            this.height = window.innerHeight; 

            this.player = new Player(this);
            setInterval(() => this.update(), 50);
        }
    }

    /**
     * Añade un nuevo disparo al juego, ya sea del monstruo o del personaje principal
     * @param character {Character} Personaje que dispara
     */
    shoot (character) {
        const arrayShots = character instanceof Player ? this.playerShots : this.enemyShots;

        arrayShots.push(new Shot(this, character));
        this.keyPressed = undefined;
    }

    /**
     * Elimina un disparo del juego cuando se sale de la pantalla o el juego se acaba
     * @param shot {Shot} Disparo que se quiere eliminar
     */
    removeShot (shot) {
        const shotsArray = shot.type === "PLAYER" ? this.playerShots : this.enemyShots,
            index = shotsArray.indexOf(shot);

        if (index > -1) {
            shotsArray.splice(index, 1);
        }
    }

    /**
     * Elimina al monstruo del juego
     */
    removeEnemy () {
        this.enemy = undefined;
    }

    /**
     * Comprueba la tecla que está pulsando el usuario
     * @param event {Event} Evento de tecla levantada/pulsada
     * @param isKeyDown {Boolean} Indica si la tecla está pulsada (true) o no (false)
     */
    checkKey (event, isKeyDown) {
        if (!isKeyDown) {
            this.keyPressed = undefined;
        } else {
            switch (event.keyCode) {
            case 37: // Left arrow
                this.keyPressed = KEY_LEFT;
                break;
            case 32: // Spacebar
                this.keyPressed = KEY_SHOOT;
                break;
            case 39: // Right arrow
                this.keyPressed = KEY_RIGHT;
                break;
            }
        }
    }

    /**
     * Comprueba la posición de la pantalla que está tocando el usuario
     * @param evt {Event} Evento de tocar la pantalla
     * @returns {*} Posición de la pantalla que está tocando el usuario
     */
    getTouches (evt) {
        return evt.touches || evt.originalEvent.touches;
    }

    /**
     * Maneja el evento de tocar sobre la pantalla
     * @param evt {Event} Evento de tocar la pantalla
     */
    handleTouchStart (evt) {
        const firstTouch = this.getTouches(evt)[0];

        this.xDown = firstTouch.clientX;
        this.keyPressed = KEY_SHOOT;
    }

    /**
     * Maneja el evento de arrastrar el dedo sobre la pantalla
     * @param evt {Event} Evento de arrastrar el dedo sobre la pantalla
     */
    handleTouchMove (evt) {
        if (!this.xDown) {
            return;
        }
        const xUp = evt.touches[0].clientX,
            xDiff = this.xDown - xUp;

        if (xDiff > MIN_TOUCHMOVE) { /* Left swipe */
            this.keyPressed = KEY_LEFT;
        } else if (xDiff < -MIN_TOUCHMOVE) { /* Right swipe */
            this.keyPressed = KEY_RIGHT;
        } else {
            this.keyPressed = KEY_SHOOT;
        }
        this.xDown = null; /* Reset values */
    }

    /**
     * Comrpueba si el personaje principal y el monstruo se han chocado entre sí o con los disparos haciendo uso del método hasCollision
     */
    checkCollisions () {
        // Player can collide with enemy or shots
        let impact = false;

        for (let i = 0; i < this.enemyShots.length; i++) {
            impact = impact || this.hasCollision(this.player, this.enemyShots[i]);
        }
        if (impact || this.hasCollision(this.player, this.enemy)) {
            this.player.die();
        }
        let killed = false;

        for (let i = 0; i < this.playerShots.length; i++) {
            killed = killed || this.hasCollision(this.enemy, this.playerShots[i]);
        }
        if (killed) {
            this.enemy.die();
        }
    }

    /**
     * Comprueba si dos elementos del juego se están chocando
     * @param item1 {Entity} Elemento del juego 1
     * @param item2 {Entity} Elemento del juego 2
     * @returns {boolean} Devuelve true si se están chocando y false si no.
     */
    hasCollision (item1, item2) {
        if (item2 === undefined) {
            return false; // When enemy is undefined, there is no collision
        }
        const b1 = item1.y + item1.height,
            r1 = item1.x + item1.width,
            b2 = item2.y + item2.height,
            r2 = item2.x + item2.width;

        if (b1 < item2.y || item1.y > b2 || r1 < item2.x || item1.x > r2) {
            return false;
        }

        return true;
    }

    /**
     * Termina el juego
     */
    endGame () {
        this.ended = true;
        let gameOver = new Entity(this, this.width / 2, "auto", this.width / 4, this.height / 4, 0, GAME_OVER_PICTURE)
        gameOver.render();
    }

    /**
     * Actualiza los elementos del juego
     */
    update () {
        if (!this.ended) {
            this.player.update();
            if (this.enemy === undefined) {
                this.enemy = new Enemy(this);
            }
            this.enemy.update();
            this.playerShots.forEach((shot) => {
                shot.update();
            });
            this.enemyShots.forEach((shot) => {
                shot.update();
            });
            this.checkCollisions();
            this.render();
        }
    }

    /**
     * Muestra todos los elementos del juego en la pantalla
     */
    render () {
        this.player.render();
        if (this.enemy !== undefined) {
            this.enemy.render();
        }
        this.playerShots.forEach((shot) => {
            shot.render();
        });
        this.enemyShots.forEach((shot) => {
            shot.render();
        });
    }
}
