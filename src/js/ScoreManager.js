const SCORE = new WeakMap();

export default class ScoreManager {
    constructor(score=0, xPosition=0, yPosition=0) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.setScore(score);
    }

    setScore(score) {
        SCORE.set(this, score);
    }
    incrementScore(amount) {
        this.setScore(this.getScore() + amount);
    }
    getScore() {
        return SCORE.get(this);
    }
    draw(context) {
        let formattedScore = this.getScore().toLocaleString();
        context.fillText(formattedScore, this.xPosition - context.measureText(formattedScore).width, this.yPosition);
    }
}
