import _ from '_';
import Asteroid from 'Asteroid';
import Cannon from 'Cannon';
import Rectangle from 'Rectangle';

export default function game() {
    var game_reset = 0;
    var asteroids_game = function () {

        var gameOver = false;
        var canvas = document.getElementById("canvas1");
        var context = canvas.getContext("2d");
        var asteroids = [],
            cannons = [];
        var lives = 3,
            score = 0;
        var _draw = setInterval(draw, 10);
        var _update = setInterval(update, 10);
        var paused;
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

        context.fillStyle = "yellow";
        context.font = "bold 64px Arial";


        var asteroid_tex = new Image();
        asteroid_tex.src = "http://i.imgur.com/Sm5IM46.png";//asteroid.png";
        var cannon_delay = 0;
        var shipY = 360 - ship_tex.width / 2;
        this.getGameOver = function () {
            if (gameOver && game_reset > 10) {
                window.clearInterval(_draw);
                window.clearInterval(_update);
            }
            return gameOver;
        };

        asteroid_tex.onload = function () {
            for (var i = 0; i < 5; i++)
                asteroids[i] = new Asteroid(1200, Math.floor(Math.random() * 720));
            for (var i = 0; i < 5; i++)
                asteroids[i + 5] = new Asteroid(1500 + Math.floor(Math.random() * 500), Math.floor(Math.random() * 720));
        };

        this.removeObjects = function () {
            asteroids = [];
            cannons = [];
        };

        document.addEventListener('keydown', (event) => {
            if ((event.keyCode == 40 || event.keyCode == 83) && shipY < 720 - 184) {
                shipY += 32;
            }
            else if ((event.keyCode == 38 || event.keyCode == 87) && shipY > 0) {
                shipY -= 32;
            } else if (event.keyCode == 27) {
                paused = !paused;
            }
        });
        document.addEventListener('keyup', (event) => {
            if ((event.keyCode == 13 || event.keyCode == 32) && cannon_delay > 7 && !gameOver) {
                cannon_delay = 0;
                cannons[cannons.length] = new Cannon(ship_tex.width + 64, shipY + ship_tex.height / 2 - cannon_tex.height / 2);
            }
        });

        let ship_hit = 20,
            pri_scroll = 0,
            pri_scroll_2 = 1920,
            par_scroll = 0,
            par_scroll_2 = 1680;

        function draw() {
            if (paused) {
                return;
            }
            context.clearRect(0, 0, 1280, 720);
            context.drawImage(background_tex, 0, 0);
            context.drawImage(pri_bg, pri_scroll, 0);
            context.drawImage(pri_bg, pri_scroll_2, 0);
            context.drawImage(par_bg, par_scroll, 120);
            context.drawImage(par_bg, par_scroll_2, 120);
            if (ship_hit < 20) {
                context.drawImage(explosion_tex, 64, shipY);
            }
            _.each(asteroids, (asteroid) => asteroid.draw(context));
            _.each(cannons, (cannon) => cannon.draw(context));
            context.drawImage(ship_tex, 64, shipY);
            if (gameOver) {
                context.fillText('GAMEOVER', 400, 200);
                context.fillText(`SCORE: ${score}`, 430, 400);
            } else {
                context.fillText(`SCORE: ${score}`, 200, 100);
                context.fillText(`LIVES: ${lives}`, 750, 100);
            }
        }

        function update() {
            if (ship_hit != 20) {
                ship_hit++;
            }
            if (paused) {
                return;
            }
            if (lives <= 0) {
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
            cannon_delay++;
            _.each(asteroids, (asteroid) => {
                asteroid.update();
                if (new Rectangle(64, shipY, ship_tex.width * 3 / 4, ship_tex.height).checkCollision(asteroid.rect)) {
                    lives--;// flash=true;//alert("GAME OVER");
                    asteroid.destroyAsteroid();
                    ship_hit = 0;
                }
            });

            let gameObject = {
                asteroids: asteroids,
                score: score
            };
            _.each(cannons, (cannon) => cannon.update(gameObject));
        }
    };

    let game = {};

    document.addEventListener('keydown', () => {
        if (game.getGameOver() && game_reset > 10) {
            game = new asteroids_game();
            game_reset = 0;
        }
    });

    return {
        initialize: () => {
            game = new asteroids_game();
        }
    }
};