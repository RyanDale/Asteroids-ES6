import GameObject from 'GameObject';
import GameImage from 'GameImage';

const shipSprite = new GameImage('http://i.imgur.com/DxukQzY.png').getImage();

export default class Ship extends GameObject {
    constructor(x, y) {
        super(x, y, shipSprite);
    }
}