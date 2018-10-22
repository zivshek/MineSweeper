let gridw = 900;
let gridh = 600;
let cellw = 30;
let cols;
let rows;
let totalCells;
let grid;
let totalMines = 100;
let withdraws = 1;

function setup() {
    createCanvas(gridw + 1, gridh + 1);
    cols = floor(gridw / cellw);
    rows = floor(gridh / cellw);
    totalCells = cols * rows;

    // 1D array
    grid = new Array(totalCells);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            grid[c + r * cols] = new Cell(r, c, cellw);
        }
    }

    // generate certain nums of mines
    for (let i = 0; i < totalMines; i++) {
        let ran = -1;
        // keep generating a random index if the cell at that index is already a mine
        // this might be very inefficient if mines are more than half of number of cells
        do {
            ran = int(random(0, totalCells - 1))
        } while (grid[ran].mine);

        grid[ran].mine = true;
    }

    for (let i = 0; i < totalCells; i++) {
        grid[i].countMines();
    }

    textSize(20);
    textAlign(CENTER);

    frameRate(10);

    //revealAll();
}

function draw() {
    background(255);
    for (let i = 0; i < totalCells; i++) {
        grid[i].draw();
    }
}

function mousePressed() {
    // floor will lead to the wrong direction
    if (mouseX > 0 && mouseX < gridw && mouseY > 0 && mouseY < gridh) {
        let c = ~~(mouseX / cellw);
        let r = ~~(mouseY / cellw);
        if (mouseButton == LEFT) {
            getCell(r, c).reveal();
        }
        else if (mouseButton == RIGHT) {
            getCell(r, c).mark();
        }
    }
}

function getCell(x, y) {
    return grid[y + x * cols];
}

function revealAll() {
    for (let i = 0; i < totalCells; i++) {
        grid[i].reveal();
    }
}
