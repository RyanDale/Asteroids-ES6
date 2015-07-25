import _ from '_';
import Asteroid from 'Asteroid';
import Cannon from 'Cannon';
import gameState from 'gameState';
import Rectangle from 'Rectangle';

var gameOver = false;
var canvas = document.getElementById("canvas1");
var context = canvas.getContext("2d");
var asteroids = [],
    cannons = [];

var background_tex = new Image();
background_tex.src = "http://i.imgur.com/31uPjb0.png";//"background.png";

var explosion_tex = new Image();
explosion_tex.src = "http://i.imgur.com/J7EHN8k.png";//"explosion.png";

var ship_tex = new Image();
ship_tex.src = "http://i.imgur.com/DxukQzY.png";//"ship.png";

var cannon_tex = new Image();
cannon_tex.src = "http://i.imgur.com/VETLA6c.png";//"cannon.png";

var pri_bg = new Image();
pri_bg.src = "http://i.imgur.com/CVcWgas.png";//"PrimaryBackground.png";

var par_bg = new Image();
par_bg.src = "http://i.imgur.com/REMZBAf.png";//"ParallaxStars.png";


var asteroid_tex = new Image();
asteroid_tex.src = "http://i.imgur.com/Sm5IM46.png";//asteroid.png";

const _DRAW = new WeakMap(),
    _UPDATE = new WeakMap(),
    SHIP_Y = new WeakMap(),
    CANNON_DELAY = new WeakMap();

asteroid_tex.onload = function () {
    for (var i = 0; i < 5; i++) {
        asteroids[i] = new Asteroid(1200, Math.floor(Math.random() * 720));
    }
    for (var i = 0; i < 5; i++) {
        asteroids[i + 5] = new Asteroid(1500 + Math.floor(Math.random() * 500), Math.floor(Math.random() * 720));
    }
};

let ship_hit = 20,
    pri_scroll = 0,
    pri_scroll_2 = 1920,
    par_scroll = 0,
    par_scroll_2 = 1680,
    game_reset = 0;

export default class AsteroidGame {
    constructor() {
        gameState.score = 0;
        gameState.lives = 3;
        SHIP_Y.set(this, 360 - ship_tex.width / 2);
        CANNON_DELAY.set(this, 0);
        context.fillStyle = "yellow";
        context.font = "bold 64px Arial";

        //_DRAW.set(this, setInterval(this.draw, 10));
        //_UPDATE.set(this, setInterval(this.update, 10));
        setInterval(this.draw.bind(this), 10);
        setInterval(this.update.bind(this), 10);

        document.addEventListener('keydown', (event) => {
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
            if ((event.keyCode == 13 || event.keyCode == 32) && CANNON_DELAY.get(this) > 7 && !gameOver) {
                CANNON_DELAY.set(this, 0);
                cannons[cannons.length] = new Cannon(ship_tex.width + 64, SHIP_Y.get(this) + ship_tex.height / 2 - cannon_tex.height / 2);
            }
        });
    }

    getGameOver() {
        if (gameOver && game_reset > 10) {
            window.clearInterval(_DRAW.get(this));
            window.clearInterval(_UPDATE.get(this));
        }
        return gameOver;
    }

    draw() {
        if (gameState.paused) {
            return;
        }
        context.clearRect(0, 0, 1280, 720);
        context.drawImage(background_tex, 0, 0);
        context.drawImage(pri_bg, pri_scroll, 0);
        context.drawImage(pri_bg, pri_scroll_2, 0);
        context.drawImage(par_bg, par_scroll, 120);
        context.drawImage(par_bg, par_scroll_2, 120);
        if (ship_hit < 20) {
            context.drawImage(explosion_tex, 64, SHIP_Y.get(this));
        }
        _.each(asteroids, (asteroid) => asteroid.draw(context));
        _.each(cannons, (cannon) => cannon.draw(context));
        context.drawImage(ship_tex, 64, SHIP_Y.get(this));
        if (gameOver) {
            context.fillText('GAMEOVER', 400, 200);
            context.fillText(`SCORE: ${gameState.score}`, 430, 400);
        } else {
            context.fillText(`SCORE: ${gameState.score}`, 200, 100);
            context.fillText(`LIVES: ${gameState.lives}`, 750, 100);
        }
    }

    update() {
        if (gameState.paused) {
            return;
        }

        if (ship_hit != 20) {
            ship_hit++;
        }

        if (gameState.lives <= 0) {
            game_reset++;
            gameOver = true;
            return;
        }
        pri_scroll--;
        pri_scroll_2--;
        par_scroll -= 2;
        par_scroll_2 -= 2;
        if (pri_scroll <= -1920) {
            pri_scroll = pri_scroll_2 + 1920;
        }
        if (pri_scroll_2 <= -1920) {
            pri_scroll_2 = pri_scroll + 1920;
        }
        if (par_scroll <= -1680) {
            par_scroll = par_scroll_2 + 1680;
        }
        if (par_scroll_2 <= -1680) {
            par_scroll_2 = par_scroll + 1680;
        }
        CANNON_DELAY.set(this, CANNON_DELAY.get(this) + 1);
        _.each(asteroids, (asteroid) => {
            asteroid.update();
            if (new Rectangle(64, SHIP_Y.get(this), ship_tex.width * 3 / 4, ship_tex.height).checkCollision(asteroid.rect)) {
                gameState.lives--;//LIVES.set(this, LIVES.get(this) - 1);// flash=true;//alert("GAME OVER");
                asteroid.destroyAsteroid();
                ship_hit = 0;
            }
        });

        let gameObject = {
            asteroids: asteroids,
            score: gameState.score//SCORE.get(this)
        };
        _.each(cannons, (cannon) => cannon.update(gameObject));
    }
}