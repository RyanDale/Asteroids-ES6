const IMAGE = new WeakMap();

export default class GameImage {
    constructor(src='', onload=null) {
        let image = new Image();
        image.src = src;
        if (onload) {
            image.onload = onload;
        }
        IMAGE.set(this, image);
    }

    getImage() {
        return IMAGE.get(this);
    }
}
