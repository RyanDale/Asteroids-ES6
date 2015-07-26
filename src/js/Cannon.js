import Rectangle from 'Rectangle';
import gameState from 'gameState';
import canvasManager from 'canvasManager';

var cannon_tex = new Image();
cannon_tex.src = "http://i.imgur.com/VETLA6c.png";//"cannon.png";
const COL = new WeakMap(),
    SPEED = new WeakMap(),
    MAX_DISTANCE = canvasManager('canvas').width;

export default class Cannon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.rect = new Rectangle(this.x, this.y, cannon_tex.width, cannon_tex.height);
        SPEED.set(this, Math.floor(Math.random() * 2) + 5);
        COL.set(this, false);
    }

    draw(context) {
        context.drawImage(cannon_tex, this.x, this.y);
    }

    getCol() {
        return COL.get(this);
    }

    setCol(col) {
        return COL.set(this, col);
    }

    getSpeed() {
        return SPEED.get(this);
    }

    update(gameObject) {
        this.x += this.getSpeed();

        if (this.x > MAX_DISTANCE) {
            this.x = MAX_DISTANCE;
            this.y = -100;
        }

        this.rect = new Rectangle(this.x, this.y, cannon_tex.width, cannon_tex.height);
    }
}
