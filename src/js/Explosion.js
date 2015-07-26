import GameImage from 'GameImage';
import GameObject from 'GameObject';

const explosionSprite = new GameImage('http://i.imgur.com/J7EHN8k.png').getImage();

export default class Explosion extends GameObject {
    constructor(x, y) {
        super(x, y, explosionSprite);
    }
}