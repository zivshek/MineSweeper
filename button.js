
class CustomButton {

    constructor(x, y, w, h, text) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
        this.backgroundColor = 'rgb(185, 229, 123)';
        this.fontColor = 'rgb(52, 66, 145)';
    }

    clicked(mx, my) {
        // since we r using rectMode(CENTER), (x, y) would be the center point of the rect
        return (mx > this.x - this.w/2 && mx < this.x + this.w/2 && my > this.y - this.h/2 && my < this.y + this.h/2);
    }

    draw() {
        rectMode(CENTER);
        fill(this.backgroundColor);
        rect(this.x, this.y, this.w, this.h);
        textSize(20);
        fill(this.fontColor);
        text(this.text, this.x, this.y + this.h/4.5);
    }
}