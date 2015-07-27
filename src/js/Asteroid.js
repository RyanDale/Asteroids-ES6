import GameObject from 'GameObject';
import Rectangle from 'Rectangle';
import GameImage from 'GameImage';
import canvasManager from 'canvasManager';

const asteroidSprite = new GameImage('http://i.imgur.com/Sm5IM46.png').getImage();

export default class Asteroid extends GameObject {
    constructor(x = 0, y = 0) {
        super(x, y, asteroidSprite);
        this.speed = Math.floor(Math.random() * 3) + 1;
        this.rotation = Math.floor(Math.random() * 360);
    }

    //Draws the Asteroid to the screen.
    draw(context) {
        let widthHalf = Math.floor(asteroidSprite.width / 2),
            heightHalf = Math.floor(asteroidSprite.height / 2);

        context.save();

        context.translate(this.x, this.y);
        context.translate(widthHalf, heightHalf);
        context.rotate(( Math.PI / 180 ) * this.rotation);
        context.drawImage(asteroidSprite, -widthHalf, -heightHalf);
        context.restore();
    }

    //Updates the asteroids location, resets it if it has gone off the screen.
    update() {
        this.rotation++;
        if (this.rotation >= 360) {
            this.rotation = 0;
        }
        this.setPosition(this.x - this.speed, this.y);
        if (this.x < -asteroidSprite.width / 2) {
            this.destroyAsteroid();
        }
    }

    destroyAsteroid() {
        this.setPosition(canvasManager('canvas').width + asteroidSprite.width / 2, Math.floor(Math.random() * (canvasManager('canvas').height - asteroidSprite.height)));
    }
}
