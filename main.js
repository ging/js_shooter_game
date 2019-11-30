const ENEMY_HEIGHT = 5,
    ENEMY_SPEED = 5,
    ENEMY_WIDTH = 10,
    KEY_LEFT = "LEFT",
    KEY_RIGHT = "RIGHT",
    KEY_SHOOT = "SHOOT",
    MIN_TOUCHMOVE = 20,
    PLAYER_HEIGHT = 6.6,
    PLAYER_SPEED = 20,
    PLAYER_WIDTH = 5.6,
    SHOT_HEIGHT = 3,
    SHOT_SPEED = 20,
    SHOT_WIDTH = 3;

function getRandomNumber (range) {
    return Math.floor(Math.random() * range);
}

function collision (div1, div2) {
    const a = div1.getBoundingClientRect(),
        b = div2.getBoundingClientRect();
    return !(a.bottom < b.top || a.top > b.bottom || a.right < b.left || a.left > b.right);

}
var game;
document.addEventListener("DOMContentLoaded", () => {
        game = new Game();
        game.start();
    }
);