import canvasManager from 'canvasManager';
import GameImage from 'GameImage';

const BACKGROUND_SPRITE = new GameImage('http://i.imgur.com/31uPjb0.png').getImage(),
    PRIMARY_BACKGROUND_SPRITE = new GameImage('http://i.imgur.com/CVcWgas.png').getImage(),
    PARALLAX_BACKGROUND = new GameImage('http://i.imgur.com/REMZBAf.png').getImage();

export default class ParallaxBackground {
    constructor() {
        this.primaryScroll = 0;
        this.primaryScroll2 = 1920;
        this.parallaxScroll = 0;
        this.parallaxScroll2 = 1680;
        this.canvas = canvasManager('canvas');
    }

    draw(context) {
        context.drawImage(BACKGROUND_SPRITE, 0, 0);
        context.drawImage(PRIMARY_BACKGROUND_SPRITE, this.primaryScroll, 0);
        context.drawImage(PRIMARY_BACKGROUND_SPRITE, this.primaryScroll2, 0);
        context.drawImage(PARALLAX_BACKGROUND, this.parallaxScroll, 120);
        context.drawImage(PARALLAX_BACKGROUND, this.parallaxScroll2, 120);
    }

    update() {
        this.primaryScroll--;
        this.primaryScroll2--;
        this.parallaxScroll -= 2;
        this.parallaxScroll2 -= 2;
        if (this.primaryScroll <= -this.canvas.width) {
            this.primaryScroll = this.primaryScroll2 + this.canvas.width;
        }
        if (this.primaryScroll2 <= -this.canvas.width) {
            this.primaryScroll2 = this.primaryScroll + this.canvas.width;
        }
        if (this.parallaxScroll <= -1680) {
            this.parallaxScroll = this.parallaxScroll2 + 1680;
        }
        if (this.parallaxScroll2 <= -1680) {
            this.parallaxScroll2 = this.parallaxScroll + 1680;
        }
    }
}
