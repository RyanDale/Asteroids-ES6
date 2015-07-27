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
import Ship from 'Ship';

let backgroundTex = new GameImage('http://i.imgur.com/31uPjb0.png').getImage(),
    primaryBackground = new GameImage('http://i.imgur.com/CVcWgas.png').getImage(),
    parallaxBackground = new GameImage('http://i.imgur.com/REMZBAf.png').getImage();

const _DRAW = new WeakMap(),
    _UPDATE = new WeakMap(),
    GAME_OVER = new WeakMap();

let primaryScroll = 0,
    primaryScroll2 = 1920,
    parallaxScroll = 0,
    parallaxScroll2 = 1680,
    gameReset = 0;

export default class AsteroidGame {
    constructor() {
        this.asteroids = [];
        this.canvas = canvasManager('canvas');
        this.context = this.canvas.getContext('2d');
        this.explosion = null;
        console.log(this.canvas.height);
        this.ship = new Ship(64, this.canvas.height / 2); //-height/2

        gameState.score = 0;
        gameState.lives = 3;

        GAME_OVER.set(this, false);

        this.context.fillStyle = "yellow";
        this.context.font = "bold 64px Arial";

        //_DRAW.set(this, setInterval(this.draw, 10));
        //_UPDATE.set(this, setInterval(this.update, 10));
        setInterval(this.draw.bind(this), 10);
        setInterval(this.update.bind(this), 10);

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

        _.each(Cannon.getCannons(), (cannon) => cannon.draw(this.context));
        _.each(this.asteroids, (asteroid) => asteroid.draw(this.context));

        this.ship.draw(this.context);
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

        _.each(this.asteroids, (asteroid) => {
            asteroid.update();
            if (this.ship.checkCollision(asteroid)) {
                gameState.lives--;//LIVES.set(this, LIVES.get(this) - 1);// flash=true;//alert("GAME OVER");
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
        });

        _.each(Cannon.getCannons(), (cannon) => cannon.update());
        this.ship.update();

        if (this.explosion) {
            this.explosion.setPosition(this.ship.x, this.ship.y);
        }
    }
}
