const ENEMY_HEIGHT = 5,
    ENEMY_SPEED = 5,
    ENEMY_WIDTH = 10,
    KEY_LEFT = "LEFT", // Percentage of screen width
    KEY_RIGHT = "RIGHT", // Percentage of screen height
    KEY_SHOOT = "SHOOT",
    MIN_TOUCHMOVE = 30,
    PLAYER_HEIGHT = 5,
    PLAYER_SPEED = 20,
    PLAYER_WIDTH = 10,
    SHOT_HEIGHT = 3,
    SHOT_WIDTH = 3;

function getRandomNumber (range) {
    return Math.floor(Math.random() * range);
}

function collision (div1, div2) {
    const a = div1.getBoundingClientRect(),
        b = div2.getBoundingClientRect();
    return !(a.bottom < b.top || a.top > b.bottom || a.right < b.left || a.left > b.right);

}

document.addEventListener("DOMContentLoaded", () => {
        const game = new Game();
        game.start();
    }
);