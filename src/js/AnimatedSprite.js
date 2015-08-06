import GameObject from 'GameObject';

const INDEX = new WeakMap();

export default class AnimatedSprite {
    constructor(imageSet, duration) {
        this.imageSet = imageSet;
        INDEX.set(this, 0);
        setInterval(() => {
            const CURRENT_INDEX = INDEX.get(this);
            if (CURRENT_INDEX + 1 === this.imageSet.length) {
                INDEX.set(this, 0);
            } else {
                INDEX.set(this, CURRENT_INDEX + 1)
            }
        }, duration);
    }
    draw(context, x, y) {
        context.drawImage(this.imageSet[INDEX.get(this)], x, y);
    }
}
