const NUM_ROWS = 9;
const NUM_COLS = 9;
const NUM_MINES = 9;

let board = [];

function initializeBoard() {
    for (let row = 0; row < NUM_ROWS; ++row) {
        board[row] = [];
        for (let col = 0; col < NUM_COLS; ++col) {
            board[row][col] = {
                isMine: false,
                isRevealed: false,
                count: 0
            };
        }
    }
    
    // Mine the board randomly
    let mines = 0;
    while (mines < NUM_MINES) {
        const randomRow = Math.floor(Math.random() * NUM_ROWS);
        const randomCol = Math.floor(Math.random() * NUM_COLS);
        if (!board[randomRow][randomCol].isMine) {
            board[randomRow][randomCol].isMine = true;
            mines++;
        }
    }

    // Calculate adjacent mine counts
    for (let row = 0; row < NUM_ROWS; ++row) {
        for (let col = 0; col < NUM_COLS; ++col) {
            if (!board[row][col].isMine) {
                let count = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const iLoc = row + dx;
                        const jLoc = col + dy;
                        if (
                            iLoc >= 0 &&
                            iLoc < NUM_ROWS &&
                            jLoc >= 0 &&
                            jLoc < NUM_COLS &&
                            board[iLoc][jLoc].isMine
                        ) count++;
                    }
                }
                board[row][col].count = count;
            }
        }
    }
}

const gameBoard = document.getElementById("game-board");

function renderBoard() {
    gameBoard.innerHTML = "";
    for (let row = 0; row < NUM_ROWS; ++row) {
        for (let col = 0; col < NUM_COLS; ++col) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            if (board[row][col].isRevealed) {
                tile.classList.add('revealed');
                if (board[row][col].isMine) {
                    tile.classList.add('bomb');
                    tile.innerText = '💣';
                } else if (board[row][col].count > 0) {
                    tile.innerText = board[row][col].count;
                }
            }
            tile.addEventListener('click', () => revealTile(row, col));
            gameBoard.appendChild(tile);
        }
        gameBoard.appendChild(document.createElement('br'));
    }
}

function revealTile(row, col) {
    if (board[row][col].isRevealed) return;
    board[row][col].isRevealed = true;
    if (board[row][col].isMine) {
        // Game over logic can be added here
        alert('Game Over! You stepped on mine.');
    } else if (board[row][col].count === 0) {
        // Reveal surrounding tiles if this tile has no adjacent mines
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const iLoc = row + dx;
                const jLoc = col + dy;
                if (
                    iLoc >= 0 &&
                    iLoc < NUM_ROWS &&
                    jLoc >= 0 &&
                    jLoc < NUM_COLS &&
                    !board[iLoc][jLoc].isRevealed
                ) {
                    revealTile(iLoc, jLoc);
                }
            }
        }
    }
    renderBoard();
}

initializeBoard();
renderBoard();
console.log(board);
