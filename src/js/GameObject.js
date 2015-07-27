import Rectangle from 'Rectangle';

export default class GameObject {
    constructor(x, y, image) {
        this.image = image;
        this.setPosition(x, y);
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y);
    }

    checkCollision(gameObject) {
        return this.rect.checkCollision(gameObject.rect);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.updateRect();
    }

    updateRect() {
        this.rect = new Rectangle(this.x, this.y, this.image.width, this.image.height);
    }
}
