import Rectangle from 'Rectangle';
import gameState from 'gameState';
import canvasManager from 'canvasManager';
import GameObject from 'GameObject';
import GameImage from 'GameImage';

const cannonSprite = new GameImage('http://i.imgur.com/VETLA6c.png').getImage(),
    COL = new WeakMap(),
    SPEED = new WeakMap(),
    MAX_DISTANCE = canvasManager('canvas').width;

let cannons = [];

export default class Cannon extends GameObject {
    constructor(x, y) {
        super(x, y, cannonSprite);
        SPEED.set(this, Math.floor(Math.random() * 2) + 5);
        COL.set(this, false);
        cannons.push(this);
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

    update() {
        this.x += this.getSpeed();

        if (this.x > MAX_DISTANCE) {
            this.setPosition(MAX_DISTANCE, -100);
        } else {
            this.setPosition(this.x, this.y);
        }
    }
    static getCannons() {
        return cannons;
    }
}
