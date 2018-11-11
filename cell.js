class Cell {

    constructor(r, c, w, mrgx, mrgy, rows, cols, grid, p5) {
        //this.mine = random() < 0.5 ? true : false;
        this.mine = false;
        this.revealed = false;
        this.marked = false;
        this.r = r;
        this.c = c;
        this.x = c * w + mrgx;
        this.y = r * w + mrgy;
        this.width = w;
        this.value = -1;

        this.rs = rows;
        this.cs = cols;
        this.grid = grid;

        this.neighbors = [];
        this.p5 = p5;
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
                    if (tempR >= 0 && tempR < this.rs && tempC >= 0 && tempC < this.cs) {
                        this.neighbors.push(this.grid[tempC + tempR * this.cs]);
                    }
                }
            }
        }
    }

    reveal() {
        if (this.revealed === false) {
            this.revealed = true;
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
        this.p5.rectMode(this.p5.CORNER);
        // draw this grid lines
        this.p5.stroke(180, 187, 198);
        if (!this.revealed) {
            // draw a white rect if not revealed
            this.p5.fill(255);
            this.p5.rect(this.x, this.y, this.width, this.width);

            // draw a triangle as a marker
            if (this.marked) {
                this.p5.fill(255, 255, 0);
                this.p5.triangle(this.x + 7, this.y + 5, this.x + 7, this.y + 25, this.x + 25, this.y + this.width / 2);
            }
        }
        else{
            // if it is revealed, draw a background first
            this.p5.fill(209, 211, 214);
            this.p5.rect(this.x, this.y, this.width, this.width);
            if (this.mine) {
                // draw a red circle if it's mine
                this.p5.fill(255, 0, 0);
                this.p5.ellipse(this.x + this.width / 2, this.y + this.width / 2, this.width / 2);
            }
            else {
                switch(this.value) {
                    // draw nothing if 0
                    case 0:
                        break;
                    default:
                    {
                        // draw the value
                        this.p5.textSize(20);
                        this.p5.fill(0);
                        this.p5.text(this.value, this.x + this.width / 2, this.y + this.width / 2 + 8);
                    }
                }
                
            }
        }
    }
}