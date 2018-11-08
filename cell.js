class Cell {

    constructor(r, c, w) {
        //this.mine = random() < 0.5 ? true : false;
        this.mine = false;
        this.revealed = false;
        this.marked = false;
        this.r = r;
        this.c = c;
        this.x = c * w + marginx;
        this.y = r * w + marginy;
        this.width = w;
        this.value = -1;

        this.neighbors = [];
    }

    mark() {
        this.marked = !this.marked;
    }

    countMines() {
        this.getNeighbors();
        let count = 0;
        for (let i = 0; i < this.neighbors.length; i++) {
            if (this.neighbors[i].mine) {
                count++;
            }
        }
        this.value = count;
    }

    // later we may need to reveal all neigbours
    // so I'll just store them
    getNeighbors() {
        if (!this.mine) {
            for (let i = -1; i <= 1; i++ ) {
                for (let j = -1; j <= 1; j++) {
                    let tempR = this.r + i;
                    let tempC = this.c + j;
                    if (tempR >= 0 && tempR < rows && tempC >= 0 && tempC < cols) {
                        this.neighbors.push(grid[tempC + tempR * cols]);
                    }
                }
            }
        }
    }

    reveal() {
        if (this.revealed === false) {
            this.revealed = true;
            if (this.mine) {
                gameOver = true;
            }
        }

        if (this.value === 0) {
            for (let i = 0; i < this.neighbors.length; i++) {
                // do not reveal those are already revealed
                // otherwise inifite loop
                if (!this.neighbors[i].revealed)
                    this.neighbors[i].reveal();
            }
        }
    }

    draw() {
        rectMode(CORNER);
        // draw this grid lines
        stroke(180, 187, 198);
        if (!this.revealed) {
            // draw a white rect if not revealed
            fill(255);
            rect(this.x, this.y, this.width, this.width);

            // draw a triangle as a marker
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
                        textSize(20);
                        fill(0);
                        text(this.value, this.x + this.width / 2, this.y + this.width / 2 + 8);
                    }
                }
                
            }
        }
    }
}