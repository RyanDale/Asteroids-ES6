import _ from 'lodash';
import Asteroid from 'Asteroid';
import Cannon from 'Cannon';
import GameImage from 'GameImage';
import gameState from 'gameState';
import Rectangle from 'Rectangle';
import LifeManager from 'LifeManager';
import ScoreManager from 'ScoreManager';
import canvasManager from 'canvasManager';

var canvas = canvasManager('canvas');
var context = canvas.getContext("2d");
var asteroids = [],
    cannons = [];


let backgroundTex = new GameImage('http://i.imgur.com/31uPjb0.png').getImage(),
    explosionTex = new GameImage('http://i.imgur.com/J7EHN8k.png').getImage(),
    shipTex = new GameImage('http://i.imgur.com/DxukQzY.png').getImage(),
    cannonTex = new GameImage('http://i.imgur.com/VETLA6c.png').getImage(),
    primaryBackground = new GameImage('http://i.imgur.com/CVcWgas.png').getImage(),
    parallaxBackground = new GameImage('http://i.imgur.com/REMZBAf.png').getImage(),
    asteroidTex = new GameImage('http://i.imgur.com/Sm5IM46.png', () => {
        for (var i = 0; i < 10; i++) {
            if (i < 5) {
                asteroids.push(new Asteroid(canvas.width, Math.floor(Math.random() * canvas.height)));
            } else {
                asteroids.push(new Asteroid((3 * canvas.width) / 2 + Math.floor(Math.random() * (canvas.width / 2)), Math.floor(Math.random() * canvas.height)));
            }
        }
    }).getImage();

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
        gameState.score = 0;
        gameState.lives = 3;

        /* Initialize private variables */
        GAME_OVER.set(this, false);
        SHIP_Y.set(this, 360 - shipTex.width / 2);
        CANNON_DELAY.set(this, 0);

        context.fillStyle = "yellow";
        context.font = "bold 64px Arial";

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
                cannons[cannons.length] = new Cannon(shipTex.width + 64, SHIP_Y.get(this) + shipTex.height / 2 - cannonTex.height / 2);
            }
        });

        this.lifeManager = new LifeManager(3, 10, 10);
        this.scoreManger = new ScoreManager(0, canvas.width - 10, 60);
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
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(backgroundTex, 0, 0);
        context.drawImage(primaryBackground, primaryScroll, 0);
        context.drawImage(primaryBackground, primaryScroll2, 0);
        context.drawImage(parallaxBackground, parallaxScroll, 120);
        context.drawImage(parallaxBackground, parallaxScroll2, 120);
        if (shipHit < 20) {
            context.drawImage(explosionTex, 64, SHIP_Y.get(this));
        }
        _.each(asteroids, (asteroid) => asteroid.draw(context));
        _.each(cannons, (cannon) => cannon.draw(context));
        context.drawImage(shipTex, 64, SHIP_Y.get(this));
        if (GAME_OVER.get(this)) {
            let gameOverText = 'GAMEOVER',
                formattedScore = `SCORE: ${gameState.score.toLocaleString()}`;
            context.fillText(gameOverText, canvas.width / 2 - (context.measureText(gameOverText).width / 2), 200);
            context.fillText(formattedScore, canvas.width / 2 - (context.measureText(formattedScore).width / 2), 400);
        } else {
            this.scoreManger.draw(context);
        }
        this.lifeManager.draw(context);
    }

    update() {
        if (gameState.paused) {
            return;
        }

        if (shipHit != 20) {
            shipHit++;
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
        if (primaryScroll <= -canvas.width) {
            primaryScroll = primaryScroll2 + canvas.width;
        }
        if (primaryScroll2 <= -canvas.width) {
            primaryScroll2 = primaryScroll + canvas.width;
        }
        if (parallaxScroll <= -1680) {
            parallaxScroll = parallaxScroll2 + 1680;
        }
        if (parallaxScroll2 <= -1680) {
            parallaxScroll2 = parallaxScroll + 1680;
        }
        CANNON_DELAY.set(this, CANNON_DELAY.get(this) + 1);
        _.each(asteroids, (asteroid) => {
            asteroid.update();
            if (new Rectangle(64, SHIP_Y.get(this), shipTex.width * 3 / 4, shipTex.height).checkCollision(asteroid.rect)) {
                gameState.lives--;//LIVES.set(this, LIVES.get(this) - 1);// flash=true;//alert("GAME OVER");
                this.lifeManager.removeLife();
                asteroid.destroyAsteroid();
                shipHit = 0;
            }

            let cannon = _.find(cannons, (cannon) => asteroid.rect.checkCollision(cannon.rect));

            if (cannon) {
                asteroid.destroyAsteroid();
                cannon.y = -100;
                cannon.setCol(true);
                gameState.score += 100;
                this.scoreManger.incrementScore(100);
            }
        });

        let gameObject = {
            asteroids: asteroids,
            score: gameState.score//SCORE.get(this)
        };
        _.each(cannons, (cannon) => cannon.update(gameObject));
    }
}