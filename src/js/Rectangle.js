export default class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    checkCollision(rect) {
        return !(this.y + this.h < rect.y || this.y > rect.y + rect.h || this.x + this.w < rect.x || this.x > rect.x + rect.w);
    }
}