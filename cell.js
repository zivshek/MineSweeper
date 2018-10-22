class Cell {

    constructor(x, y, w) {
        //this.mine = random() < 0.5 ? true : false;
        this.mine = false;
        this.revealed = false;
        this.marked = false;

        this.x = x;
        this.y = y;
        this.width = w;
        this.value = -1;
    }

    reveal() {
        this.revealed = true;
    }

    mark() {
        this.marked = true;
    }

    countMines() {
        let count = 0;
        if (!this.mine) {

        }
        return this.value;
    }

    getNeighbors() {

    }

    draw() {
        // draw this grid lines
        stroke(180, 187, 198);
        if (!this.revealed) {
            // draw a white rect if not revealed
            fill(255);
            rect(this.x, this.y, this.width, this.width);

            if (this.marked) {
                fill(255, 255, 0);
                triangle(this.x + 7, this.y + 5, this.x + 7, this.y + 25, this.x + 25, this.y + this.width / 2);
            }
        }
        else{
            // if it is revealed, draw a background first
            fill(209, 211, 214);
            rect(this.x, this.y, this.width, this.width);
            if (this.mine) {
                // draw a red circle if it's mine
                fill(255, 0, 0);
                ellipse(this.x + this.width / 2, this.y + this.width / 2, this.width / 2);
            }
            else {
                switch(this.value) {
                    // draw nothing if 0
                    case 0:
                        break;
                    default:
                    {
                        // draw the value
                        fill(0);
                        text(this.value, this.x + this.width / 2, this.y + this.width / 2 + 8);
                    }
                }
                
            }
        }
    }
}