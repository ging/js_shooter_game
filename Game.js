class Game {
    constructor () {
        this.started = false;
        this.ended = false;
        this.keyPressed = undefined;
        this.width = 0;
        this.height = 0;
        this.player = undefined;
        this.playerShots = [];
        this.enemy = undefined;
        this.enemyShots = [];
        this.xDown = null; // For touch events
    }

    start () {
        if (!this.started) {
            // requestAnimationFrame(this.update());
            window.addEventListener("keydown", (e) => this.checkKey(e, true));
            window.addEventListener("keyup", (e) => this.checkKey(e, false));
            window.addEventListener("touchstart", (e) => this.handleTouchStart(e, true));
            window.addEventListener("touchmove", (e) => this.handleTouchMove(e, false));
            this.started = true;
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            const height = PLAYER_HEIGHT * this.width / 100,
                width = PLAYER_WIDTH * this.width / 100,
                x = this.width / 2 - width,
                y = this.height - height,
                myImage = new Image(width, height);

            myImage.src = "assets/bueno.png";
            this.player = new Player(this, width, height, x, y, PLAYER_SPEED, myImage);
            setInterval(() => this.update(), 50);
        }
    }

    shoot (character) {
        const arrayShots = character instanceof Player ? this.playerShots : this.enemyShots;
        arrayShots.push(new Shot(this, character));
        this.keyPressed = undefined;
    }

    removeShot (shot) {
        const shotsArray = shot.type === "PLAYER" ? this.playerShots : this.enemyShots,
            index = shotsArray.indexOf(shot);
        if (index > -1) {
            shotsArray.splice(index, 1);
        }
    }
    removeEnemy () {
        this.enemy = undefined;
    }

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

    getTouches (evt) {
        return evt.touches || evt.originalEvent.touches;
    }

    handleTouchStart (evt) {
        const firstTouch = this.getTouches(evt)[0];
        this.xDown = firstTouch.clientX;
        this.keyPressed = KEY_SHOOT;
    }

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

    endGame () {
        this.ended = true;
        this.myImage = new Image(this.width / 2, this.height / 2);
        this.myImage.src = "assets/game_over.jpg";
        this.myImage.style.position = "absolute";
        this.myImage.style.top = `${this.height / 4}px`;
        this.myImage.style.left = `${this.width / 4}px`;
        document.body.appendChild(this.myImage);
    }

    update () {
        if (!this.ended) {
            this.player.update();
            if (this.enemy === undefined) {
                const height = ENEMY_HEIGHT * this.width / 100,
                    width = ENEMY_WIDTH * this.width / 100,
                    x = getRandomNumber(this.width - width),
                    y = 0,
                    myImage = new Image(width, height);
                myImage.src = "assets/malo.png";
                this.enemy = new Enemy(this, width, height, x, y, ENEMY_SPEED, myImage);
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