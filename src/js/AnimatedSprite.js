import GameObject from 'GameObject';

const INDEX = new WeakMap();

export default class AnimatedSprite {
    constructor(imageSet, duration) {
        this.imageSet = imageSet;
        INDEX.set(this, 0);
        setInterval(() => {
            let currentIndex = INDEX.get(this);
            if (currentIndex + 1 === this.imageSet.length) {
                INDEX.set(this, 0);
            } else {
                INDEX.set(this, currentIndex + 1)
            }
        }, duration);
    }
    draw(context, x, y) {
        context.drawImage(this.imageSet[INDEX.get(this)], x, y);
    }
}
