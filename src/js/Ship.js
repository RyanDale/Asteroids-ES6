import GameObject from 'GameObject';
import GameImage from 'GameImage';
import gameState from 'gameState';
import AnimatedSprite from 'AnimatedSprite';
import Cannon from 'Cannon';

const SHIP_SPRITE = new GameImage('http://i.imgur.com/sdJ891S.png').getImage(),
    AFTER_BURNER_SPRITE = [
        new GameImage('http://i.imgur.com/ndZuxve.png').getImage(),
        new GameImage('http://i.imgur.com/EHKfHxh.png').getImage(),
        new GameImage('http://i.imgur.com/mTd287E.png').getImage(),
        new GameImage('http://i.imgur.com/1jWBYrG.png').getImage(),
        new GameImage('http://i.imgur.com/nocOCWA.png').getImage()
    ];

const CANNON_DELAY = new WeakMap();

export default class Ship extends GameObject {
    constructor(x, y) {
        super(x, y, SHIP_SPRITE);
        this.afterBurners = new AnimatedSprite(AFTER_BURNER_SPRITE, 30);

        CANNON_DELAY.set(this, 0);

        document.addEventListener('keydown', (event) => {
            if (gameState.lives <= 0) {
                return;
            }
            if ((event.keyCode == 40 || event.keyCode == 83) && this.y < 536) {
                this.setPosition(this.x, this.y + 32);
            }
            else if ((event.keyCode == 38 || event.keyCode == 87) && this.y > 0) {
                this.setPosition(this.x, this.y - 32);
            } else if (event.keyCode == 27) {
                gameState.paused = !gameState.paused;
            }
        });

        document.addEventListener('keyup', (event) => {
            if ((event.keyCode == 13 || event.keyCode == 32) && CANNON_DELAY.get(this) > 7 && gameState.lives > 0) {
                CANNON_DELAY.set(this, 0);
                new Cannon(this.x + this.image.width, this.y + (this.image.height / 2));//shipTex.height / 2 - cannonTex.height / 2
            }
        });
    }

    draw(context) {
        this.afterBurners.draw(context, this.x, this.y);
        super.draw(context);
    }

    update() {
        CANNON_DELAY.set(this, CANNON_DELAY.get(this) + 1);
    }
}
