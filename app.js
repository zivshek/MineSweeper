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
let gameWin = false;
let gameWinButton;
let gameOver = false;
let gameOverButton;
let markMode = false;
let toggleModeButton;
let toggleOnColor = 'rgb(255, 204, 0)';
let toggleOffColor = 'rgb(255, 102, 102)';
// mouse button vars
let singleClick = doubleClick = false;
let mx, my;

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

    // create the toggle mode button and game over button
    gameOverButton = new CustomButton(canvasw/2, canvash - marginy, 150, 35, "Game Over");
    gameWinButton = new CustomButton(canvasw/2, canvash - marginy, 150, 35, "You Win!!");
    toggleModeButton = new CustomButton(canvasw - 150/2 - marginx - 10, marginy/2, 150, 35, "Mark Mode Off");
    toggleModeButton.backgroundColor = toggleOffColor;

    mx = my = -1;

    textAlign(CENTER);

    frameRate(10);

    //revealAll();
}

function draw() {
    background(255);
    // handle mouse evts before drawing
    for (let i = 0; i < totalCells; i++) {
        grid[i].draw();
    }

    toggleModeButton.draw();

    if (gameOver) {
        gameOverButton.draw();
    }
    else if (gameWin)
    {
        gameWinButton.draw();
    }
}

function mouseClicked() {
    if (mouseButton === LEFT) {
        singleClick = true;
    }

    mx = mouseX - marginx;
    my = mouseY - marginy;
    mouseHandler();
    // reset the flag after the click's handled
    singleClick = false;
}

function doubleClicked() {
    if (mouseButton === LEFT) {
        doubleClick = true;
    }

    mx = mouseX - marginx;
    my = mouseY - marginy;

    mouseHandler();

    doubleClick = false;
}

function keyPressed() {
    if (key == 't') 
        toggleMode();
}

function toggleMode() {
    markMode = !markMode;
    if (markMode) {
        toggleModeButton.backgroundColor = toggleOnColor;
        toggleModeButton.text = 'Mark Mode On';
    }
    else {
        toggleModeButton.backgroundColor = toggleOffColor;
        toggleModeButton.text = 'Mark Mode Off';
    }
}

function mouseHandler() {
    if (!gameOver && !gameWin) {
        if (mx > 0 && mx < gridw && my > 0 && my < gridh) {
            // floor() may lead to the wrong direction
            // thus we'r hacking by using ~~
            let c = ~~(mx / cellw);
            let r = ~~(my / cellw);
            let cell = getCell(r, c);

            if (singleClick) {
                if (!markMode)
                    cell.reveal();
                else
                    cell.mark();
            }
            else if (doubleClick) {
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
                }
            }
            // when the evt is handled, reset mouse positions
            mx = my = -1;

            if (winCheck())
                gameWin = true;
        }
        // handle UI button clicks
        else {
            if (toggleModeButton.clicked(mouseX, mouseY)) {
                toggleMode();
            }
        }
    }
    else if (gameOver) {
        // use mouse positions here directly instead of mx, my      
        if (gameOverButton.clicked(mouseX, mouseY)) {
            gameOver = false;
            setup();
        }
    }
    else if (gameWin) {
        if (gameWinButton.clicked(mouseX, mouseY)) {
            gameWin = false;
            setup();
        }
    }
}

function getCell(x, y) {
    return grid[y + x * cols];
}

function winCheck() {
    let win = true;
    for (let i = 0; i < totalCells; i++) {
        if (!grid[i].mine && !grid[i].revealed) {
            win = false;
            break;
        }
    }
    return win;
}

function revealAll() {
    for (let i = 0; i < totalCells; i++) {
        grid[i].reveal();
    }
}
