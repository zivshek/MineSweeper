let canvasw = 900;
let canvash = 600;

let minesweeper = function(p) {
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
    
    p.setup = function() {
        p.createCanvas(canvasw, canvash);
        cols = p.floor(gridw / cellw);
        rows = p.floor(gridh / cellw);
        totalCells = cols * rows;
    
        // 1D array
        grid = new Array(totalCells);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                grid[c + r * cols] = new Cell(r, c, cellw, marginx, marginy, rows, cols, grid, p);
            }
        }
    
        // generate certain nums of mines
        for (let i = 0; i < totalMines; i++) {
            let ran = -1;
            // keep generating a random index if the cell at that index is already a mine
            // this might be very inefficient if mines are more than half of number of cells
            do {
                ran = p.int(p.random(0, totalCells - 1));
            } while (grid[ran].mine);
    
            grid[ran].mine = true;
        }
    
        for (let i = 0; i < totalCells; i++) {
            grid[i].countMines();
        }
    
        // create the toggle mode button and game over button
        gameOverButton = new CustomButton(canvasw/2, canvash - marginy, 150, 35, "Game Over", p);
        gameWinButton = new CustomButton(canvasw/2, canvash - marginy, 150, 35, "You Win!!", p);
        toggleModeButton = new CustomButton(canvasw - 150/2 - marginx - 10, marginy/2, 150, 35, "Mark Mode Off", p);
        toggleModeButton.backgroundColor = toggleOffColor;
    
        mx = my = -1;
    
        p.textAlign(p.CENTER);
    
        p.frameRate(10);
    
        //revealAll();
    }
    
    p.draw = function() {
        p.background(255);
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
    
    p.mouseClicked = function() {
        if (p.mouseButton === p.LEFT) {
            singleClick = true;
        }
    
        mx = p.mouseX - marginx;
        my = p.mouseY - marginy;
        p.mouseHandler();
        // reset the flag after the click's handled
        singleClick = false;
    }
    
    p.doubleClicked = function() {
        if (p.mouseButton === p.LEFT) {
            doubleClick = true;
        }
    
        mx = p.mouseX - marginx;
        my = p.mouseY - marginy;
    
        p.mouseHandler();
    
        doubleClick = false;
    }
    
    p.keyPressed = function() {
        if (p.key == 't') 
            p.toggleMode();
    }
    
    p.toggleMode = function() {
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
    
    p.mouseHandler = function() {
        if (!gameOver && !gameWin) {
            if (mx > 0 && mx < gridw && my > 0 && my < gridh) {
                // floor() may lead to the wrong direction
                // thus we'r hacking by using ~~
                let c = ~~(mx / cellw);
                let r = ~~(my / cellw);
                let cell = p.getCell(r, c);
    
                if (singleClick) {
                    if (!markMode) {
                        cell.reveal();
                        if (cell.mine) {
                            gameOver = true;
                        }
                    }
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
                            if (!cell.neighbors[i].marked) {
                                cell.neighbors[i].reveal();
                                if (cell.neighbors[i].mine) {
                                    gameOver = true;
                                }
                            }
                        }
                    }
                }
                // when the evt is handled, reset mouse positions
                mx = my = -1;
    
                if (p.winCheck())
                    gameWin = true;
            }
            // handle UI button clicks
            else {
                if (toggleModeButton.clicked(p.mouseX, p.mouseY)) {
                    p.toggleMode();
                }
            }
        }
        else if (gameOver) {
            // use mouse positions here directly instead of mx, my      
            if (gameOverButton.clicked(p.mouseX, p.mouseY)) {
                gameOver = false;
                p.setup();
            }
        }
        else if (gameWin) {
            if (gameWinButton.clicked(p.mouseX, p.mouseY)) {
                gameWin = false;
                p.setup();
            }
        }
    }
    
    p.getCell = function(x, y) {
        return grid[y + x * cols];
    }
    
    p.winCheck = function() {
        let win = true;
        for (let i = 0; i < totalCells; i++) {
            if (!grid[i].mine && !grid[i].revealed) {
                win = false;
                break;
            }
        }
        return win;
    }
    
    p.revealAll = function() {
        for (let i = 0; i < totalCells; i++) {
            grid[i].reveal();
        }
    }
};

let minesweeperp5 = new p5(minesweeper, window.document.getElementById('container'));
