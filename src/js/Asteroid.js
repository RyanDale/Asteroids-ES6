import Rectangle from 'Rectangle';

let asteroid_tex = new Image();
asteroid_tex.src = "http://i.imgur.com/Sm5IM46.png";//asteroid.png";

export default class Asteroid {
    constructor(x = 0, y = 0) {
        super(x, y, asteroid_tex);

        this.speed = Math.floor(Math.random() * 3) + 1;
        this.rotation = Math.floor(Math.random() * 360);
    }

    //Draws the Asteroid to the screen.
    draw(context) {
        let widthHalf = Math.floor(asteroid_tex.width / 2),
            heightHalf = Math.floor(asteroid_tex.height / 2);

        context.save();

        context.translate(this.x, this.y);
        context.translate(widthHalf, heightHalf);
        context.rotate(( Math.PI / 180 ) * this.rotation);
        context.drawImage(asteroid_tex, -widthHalf, -heightHalf);
        context.restore();
    }

    //Updates the asteroids location, resets it if it has gone off the screen.
    update() {
        this.rotation++;
        if (this.rotation >= 360) {
            this.rotation = 0;
        }
        this.x -= this.speed;
        if (this.x < -asteroid_tex.width / 2) {
            this.destroyAsteroid();
        }
        this.rect = new Rectangle(this.x, this.y, this.w, this.h);
    }

    destroyAsteroid() {
        this.x = 1200 + asteroid_tex.width / 2;
        this.y = Math.floor(Math.random() * (720 - asteroid_tex.height));
        this.rect = new Rectangle(this.x, this.y, this.w, this.h);
    }
}