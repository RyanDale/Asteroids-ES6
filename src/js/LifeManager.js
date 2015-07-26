import GameImage from 'GameImage';


const LIVES = new WeakMap(),
    LARGE_LIFE_SPRITE = new GameImage('http://i.imgur.com/JNfxzXr.png').getImage(),
    LIFE_SPRITE = new GameImage('http://i.imgur.com/fEONITO.png').getImage();

export default class LifeManager {
    constructor(lives=0, xPosition=0, yPosition=0) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.setLives(lives);
    }

    setLives(lives) {
        LIVES.set(this, lives);
    }

    removeLife() {
        this.setLives(this.getLives() - 1);
    }

    addLife() {
        this.setLives(this.getLives() + 1);
    }

    getLives() {
        return LIVES.get(this);
    }

    draw(context) {
        let multiplier = (LIFE_SPRITE.width / 10) + LIFE_SPRITE.width;
        _.times(this.getLives(), (index) => {
            context.drawImage(LIFE_SPRITE, this.xPosition + (index * multiplier), this.yPosition);
        });
    }
}
