import _ from 'lodash';
import Asteroid from 'Asteroid';
import Cannon from 'Cannon';
import gameState from 'gameState';
import LifeManager from 'LifeManager';
import ScoreManager from 'ScoreManager';
import canvasManager from 'canvasManager';
import Explosion from 'Explosion';
import Ship from 'Ship';
import ParallaxBackground from 'ParallaxBackground';

const DRAW = new WeakMap(),
    UPDATE = new WeakMap(),
    GAME_OVER = new WeakMap();

let gameReset = 0;

export default class AsteroidGame {
    constructor() {
        this.asteroids = [];
        this.canvas = canvasManager('canvas');
        this.context = this.canvas.getContext('2d');
        this.explosion = null;
        this.ship = new Ship(64, this.canvas.height / 2);
        this.parallaxBackground = new ParallaxBackground();

        gameState.score = 0;
        gameState.lives = 3;

        GAME_OVER.set(this, false);

        this.context.fillStyle = "yellow";
        this.context.font = "bold 64px Arial";
        this.lifeManager = new LifeManager(3, 10, 10);
        this.scoreManger = new ScoreManager(0, this.canvas.width - 10, 60);

        _.times(10, (index) => {
            if (index < 5) {
                this.asteroids.push(new Asteroid(this.canvas.width, Math.floor(Math.random() * this.canvas.height)));
            } else {
                this.asteroids.push(new Asteroid((3 * this.canvas.width) / 2 + Math.floor(Math.random() * (this.canvas.width / 2)), Math.floor(Math.random() * this.canvas.height)));
            }
        });

        setInterval(this.draw.bind(this), 10);
        setInterval(this.update.bind(this), 10);
    }

    getGameOver() {
        if (GAME_OVER.get(this) && gameReset > 10) {
            window.clearInterval(DRAW.get(this));
            window.clearInterval(UPDATE.get(this));
        }
        return GAME_OVER.get(this);
    }

    draw() {
        if (gameState.paused) {
            return;
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.parallaxBackground.draw(this.context);

        if (this.explosion) {
            this.explosion.draw(this.context);
        }

        _.each(Cannon.getCannons(), (cannon) => cannon.draw(this.context));
        _.each(this.asteroids, (asteroid) => asteroid.draw(this.context));

        this.ship.draw(this.context);
        if (GAME_OVER.get(this)) {
            const GAME_OVER_TEXT = 'GAMEOVER',
                FORMATTED_SCORE = `SCORE: ${gameState.score.toLocaleString()}`;
            this.context.fillText(GAME_OVER_TEXT, this.canvas.width / 2 - (this.context.measureText(GAME_OVER_TEXT).width / 2), 200);
            this.context.fillText(FORMATTED_SCORE, this.canvas.width / 2 - (this.context.measureText(FORMATTED_SCORE).width / 2), 400);
        } else {
            this.scoreManger.draw(this.context);
        }
        this.lifeManager.draw(this.context);
    }

    update() {
        if (gameState.paused) {
            return;
        }

        if (gameState.lives <= 0) {
            gameReset++;
            GAME_OVER.set(this, true);
            return;
        }

        this.parallaxBackground.update();
        _.each(this.asteroids, this.checkAsteroidCollision.bind(this));
        _.each(Cannon.getCannons(), (cannon) => cannon.update());
        this.ship.update();

        if (this.explosion) {
            this.explosion.setPosition(this.ship.x, this.ship.y);
        }
    }

    checkAsteroidCollision(asteroid) {
        asteroid.update();

        if (this.ship.checkCollision(asteroid)) {
            gameState.lives--;
            this.lifeManager.removeLife();
            asteroid.destroyAsteroid();
            this.explosion = new Explosion(this.ship.x, this.ship.y);
            setTimeout(()=> {
                this.explosion = null;
            }, 250)
        }

        let cannon = _.find(Cannon.getCannons(), (cannon) => asteroid.checkCollision(cannon));

        if (cannon) {
            asteroid.destroyAsteroid();
            cannon.y = -100;
            cannon.setCol(true);
            gameState.score += 100;
            this.scoreManger.incrementScore(100);
        }
    }
}
