import AsteroidGame from 'AsteroidGame';

const GAME = new WeakMap();
const GAME_RESET = new WeakMap();

export default class Game {
    constructor() {
        document.addEventListener('keydown', () => {
            if (GAME.get(this).getGameOver() && GAME_RESET.get(this) > 10) {
                this.initialize();
            }
        });
    }

    initialize() {
        let game = new AsteroidGame();
        GAME.set(this, game);
        GAME_RESET.set(this, 0);
    }
}