export default class GameObject {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.rect = new Rectangle(this.x, this.y, this.image.width, this.image.height);
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y);
    }

    checkCollision(gameObject) {
        return this.rect.checkCollision(gameObject.rect);
    }
}