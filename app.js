let canvasw = 900;
let canvash = 600;
let gridw = 850;
let gridh = 500;
let marginx = (canvasw - gridw) / 2;
let marginy = (canvash - gridh) / 2;
let cellw = 30;
let cols;
let rows;
let totalCells;
let grid;
let totalMines = 30;
let withdraws = 1;
let gameOver = false;

// mouse button vars
let leftClick = rightClick = false;
let mx = my = -1;

function setup() {
    createCanvas(canvasw, canvash);
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

    textAlign(CENTER);

    frameRate(10);

    //revealAll();
}

function draw() {
    background(255);
    // handle mouse evts before drawing
    mouseHandler();
    for (let i = 0; i < totalCells; i++) {
        grid[i].draw();
    }

    if (gameOver) {
        fill(185, 229, 123);
        rect(300, 200, 300, 200);
        textSize(50);
        fill(52, 66, 145);
        text("Game Over", 450, 315);
    }
}

function mousePressed() {
    if (mouseButton === LEFT) {
        leftClick = true;
    }
    if (mouseButton === RIGHT) {
        rightClick = true;
    }

    mx = mouseX - marginx;
    my = mouseY - marginy;
}

function mouseReleased() {
    if (mouseButton == LEFT)
        leftClick = false;
    if (mouseButton == RIGHT)
        rightClick = false;
}

function mouseHandler() {
    if (!gameOver) {
        if (mx > 0 && mx < gridw && my > 0 && my < gridh) {
            // floor() may lead to the wrong direction
            // thus we'r hacking by using ~~
            let c = ~~(mx / cellw);
            let r = ~~(my / cellw);
            let cell = getCell(r, c);
            if (leftClick && !rightClick) {
                cell.reveal();
            }
            else if (rightClick && !leftClick) {
                cell.mark();
            }
            else if (leftClick && rightClick) {
                let markedCount = 0;
                for (let i = 0; i < cell.neighbors.length; i++) {
                    if (cell.neighbors[i].marked) 
                        markedCount++;
                }

                // if marked count equals to the value the cell has, reveal all neighbours
                if (markedCount > 0 && markedCount === cell.value) {
                    for (let i = 0; i < cell.neighbors.length; i++) {
                        if (!cell.neighbors[i].marked) 
                            cell.neighbors[i].reveal();
                    }
                    console.log("ha");
                }
            }

            // when the evt is handled, reset mouse positions
            mx = my = -1;
        }
    }
    else {
        if (mx > 300 && mx < 600 && my > 200 && my < 400) {
            gameOver = false;
            setup();
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
