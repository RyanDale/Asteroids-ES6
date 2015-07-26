import _ from 'lodash';
import Asteroid from 'Asteroid';
import Cannon from 'Cannon';
import GameImage from 'GameImage';
import gameState from 'gameState';
import Rectangle from 'Rectangle';
import LifeManager from 'LifeManager';
import ScoreManager from 'ScoreManager';
import canvasManager from 'canvasManager';
import Explosion from 'Explosion';

let backgroundTex = new GameImage('http://i.imgur.com/31uPjb0.png').getImage(),
    shipTex = new GameImage('http://i.imgur.com/DxukQzY.png').getImage(),
    cannonTex = new GameImage('http://i.imgur.com/VETLA6c.png').getImage(),
    primaryBackground = new GameImage('http://i.imgur.com/CVcWgas.png').getImage(),
    parallaxBackground = new GameImage('http://i.imgur.com/REMZBAf.png').getImage();

const _DRAW = new WeakMap(),
    _UPDATE = new WeakMap(),
    SHIP_Y = new WeakMap(),
    CANNON_DELAY = new WeakMap(),
    GAME_OVER = new WeakMap();

let shipHit = 20,
    primaryScroll = 0,
    primaryScroll2 = 1920,
    parallaxScroll = 0,
    parallaxScroll2 = 1680,
    gameReset = 0;

export default class AsteroidGame {
    constructor() {
        this.asteroids = [];
        this.cannons = [];
        this.canvas = canvasManager('canvas');
        this.context = this.canvas.getContext('2d');
        this.explosion = null;

        gameState.score = 0;
        gameState.lives = 3;

        /* Initialize private variables */
        GAME_OVER.set(this, false);
        SHIP_Y.set(this, 360 - shipTex.width / 2);
        CANNON_DELAY.set(this, 0);

        this.context.fillStyle = "yellow";
        this.context.font = "bold 64px Arial";

        //_DRAW.set(this, setInterval(this.draw, 10));
        //_UPDATE.set(this, setInterval(this.update, 10));
        setInterval(this.draw.bind(this), 10);
        setInterval(this.update.bind(this), 10);

        document.addEventListener('keydown', (event) => {
            if (this.getGameOver()) {
                return;
            }
            if ((event.keyCode == 40 || event.keyCode == 83) && SHIP_Y.get(this) < 536) {
                SHIP_Y.set(this, SHIP_Y.get(this) + 32);
            }
            else if ((event.keyCode == 38 || event.keyCode == 87) && SHIP_Y.get(this) > 0) {
                SHIP_Y.set(this, SHIP_Y.get(this) - 32);
            } else if (event.keyCode == 27) {
                gameState.paused = !gameState.paused;
            }
        });
        document.addEventListener('keyup', (event) => {
            if ((event.keyCode == 13 || event.keyCode == 32) && CANNON_DELAY.get(this) > 7 && !this.getGameOver()) {
                CANNON_DELAY.set(this, 0);
                let c = new Cannon(shipTex.width + 64, SHIP_Y.get(this) + shipTex.height / 2 - cannonTex.height / 2);
                this.cannons.push(c);
            }
        });

        this.lifeManager = new LifeManager(3, 10, 10);
        this.scoreManger = new ScoreManager(0, this.canvas.width - 10, 60);

        _.times(10, (index) => {
            if (index < 5) {
                this.asteroids.push(new Asteroid(this.canvas.width, Math.floor(Math.random() * this.canvas.height)));
            } else {
                this.asteroids.push(new Asteroid((3 * this.canvas.width) / 2 + Math.floor(Math.random() * (this.canvas.width / 2)), Math.floor(Math.random() * this.canvas.height)));
            }
        });
    }

    getGameOver() {
        if (GAME_OVER.get(this) && gameReset > 10) {
            window.clearInterval(_DRAW.get(this));
            window.clearInterval(_UPDATE.get(this));
        }
        return GAME_OVER.get(this);
    }

    draw() {
        if (gameState.paused) {
            return;
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(backgroundTex, 0, 0);
        this.context.drawImage(primaryBackground, primaryScroll, 0);
        this.context.drawImage(primaryBackground, primaryScroll2, 0);
        this.context.drawImage(parallaxBackground, parallaxScroll, 120);
        this.context.drawImage(parallaxBackground, parallaxScroll2, 120);

        if (this.explosion) {
            this.explosion.draw(this.context);
        }

        _.each(this.asteroids, (asteroid) => asteroid.draw(this.context));
        _.each(this.cannons, (cannon) => cannon.draw(this.context));
        this.context.drawImage(shipTex, 64, SHIP_Y.get(this));
        if (GAME_OVER.get(this)) {
            let gameOverText = 'GAMEOVER',
                formattedScore = `SCORE: ${gameState.score.toLocaleString()}`;
            this.context.fillText(gameOverText, this.canvas.width / 2 - (this.context.measureText(gameOverText).width / 2), 200);
            this.context.fillText(formattedScore, this.canvas.width / 2 - (this.context.measureText(formattedScore).width / 2), 400);
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
        primaryScroll--;
        primaryScroll2--;
        parallaxScroll -= 2;
        parallaxScroll2 -= 2;
        if (primaryScroll <= -this.canvas.width) {
            primaryScroll = primaryScroll2 + this.canvas.width;
        }
        if (primaryScroll2 <= -this.canvas.width) {
            primaryScroll2 = primaryScroll + this.canvas.width;
        }
        if (parallaxScroll <= -1680) {
            parallaxScroll = parallaxScroll2 + 1680;
        }
        if (parallaxScroll2 <= -1680) {
            parallaxScroll2 = parallaxScroll + 1680;
        }
        CANNON_DELAY.set(this, CANNON_DELAY.get(this) + 1);
        _.each(this.asteroids, (asteroid) => {
            asteroid.update();
            if (new Rectangle(64, SHIP_Y.get(this), shipTex.width * 3 / 4, shipTex.height).checkCollision(asteroid.rect)) {
                gameState.lives--;//LIVES.set(this, LIVES.get(this) - 1);// flash=true;//alert("GAME OVER");
                this.lifeManager.removeLife();
                asteroid.destroyAsteroid();
                shipHit = 0;
                this.explosion = new Explosion(64, SHIP_Y);
                setTimeout(()=> {
                    this.explosion = null;
                }, 250)
            }

            let cannon = _.find(this.cannons, (cannon) => asteroid.checkCollision(cannon));

            if (cannon) {
                asteroid.destroyAsteroid();
                cannon.y = -100;
                cannon.setCol(true);
                gameState.score += 100;
                this.scoreManger.incrementScore(100);
            }
        });

        _.each(this.cannons, (cannon) => cannon.update());

        if (this.explosion) {
            this.explosion.setPosition(64, SHIP_Y.get(this));
        }
    }
}
