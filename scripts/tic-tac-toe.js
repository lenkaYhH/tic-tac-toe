// USEFUL CONTSTANTS -------------------------------
// html elements on the page (names ending with el)
let BOXESel = document.getElementsByClassName("box");
let WIN_COUNTERel = document.getElementById("win-counter");
let STATUSel = document.getElementById("status");

// for computational purposes
let CUR_PLAYER = Math.floor(Math.random()*2); /* generates a random number either player 0 or player 1 */
const PLAYER_NAME = ['computer', 'player'];

let BOARD = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
]

// ON STARTUP --------------------------------------------

// sets wins in local storage to 0 if it doesn't exist yet
if (localStorage.getItem('win-counter') === null) {
    localStorage.setItem('win-counter', 0);
}

// HTML/CSS STUFF -----------------------------------
function reset_board_visually() {
    // resets the boxes back to blank
    for (let i=0; i < BOXESel.length; i++) {
        BOXESel[i].innerHTML = "";
    }

    // start game setup
    WIN_COUNTERel.innerHTML = `Wins: ${localStorage.getItem('win-counter')}`;
    STATUSel.innerHTML = `${PLAYER_NAME[CUR_PLAYER]} starts!`;
}

function set_boxes_clickable() {
    for (let i=0; i<BOXESel.length; i++) {
        BOXESel[i].onclick = function() {
            box_clicked(i);
        };
    }
}

function remove_boxes_clickable() {
    for (let i=0; i<BOXESel.length; i++) {
        BOXESel[i].onclick = 'void(0);';
    }
}

// GENERAL FUNCTIONS ------------------------------
function reset() {
    console.log("GAME RESET...")
    reset_board_visually();
    reset_computations();

    if (CUR_PLAYER === 1) {
        player_move();
    
    } else {
        computer_move();
    }
}

function box_clicked(box_index) {
    // player clicks the box

    // if move valid
    if (return_all_valid_moves(BOARD).includes(box_index)) {
        place_player(box_index, 1);

        next_player();
    }
    
}

function place_player(box_index, player) {
    // visuall updates the board
    BOXESel[box_index].innerHTML = `<img src="/images/tic-tac-toe/player${player}.jpg">`;

    // updates the computating board

    BOARD[Math.floor(box_index/3)][box_index%3] = player;

}

function next_player() {
    // test winner
    if (game_ends(BOARD)) {
        finish();

    } else {
        // updates the current player to the next player
        // updates info text
        // cues next player's function

        if (CUR_PLAYER === 1) {
            CUR_PLAYER = 0;
            computer_move();

        } else {
            CUR_PLAYER = 1;
            STATUSel.innerHTML = "Your turn!";
            player_move();
        }
    }
    
}

// COMPUTATION --------------------------------------- 
function reset_computations() {
    BOARD = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]

    CUR_PLAYER = Math.floor(Math.random()*2); /* generates a random number either player 0 or player 1 */
}

function compute_winner(board) {
    // returns the winner, if any

    for (let i=0; i<3; i++) {
        // thank gods 0 === null is false lol

        // tests the horizontal
        if (board[i][0] !== null && board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
            return board[i][0];
        }

        // tests the vertical
        if (board[0][i] !== null && board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
            return board[0][i];
        }
    }

    // tests the diagonals
    if (board[1][1] !== null && board[0][0] == board[1][1] && board[1][1] == board[2][2]) {

        return board[1][1];

    } else if (board[1][1] !== null && board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
        return board[1][1];
    }

    // last case: no winner
    return null

}

function game_ends(board) {
    // returns true if game is finished, false otherwise
    if (compute_winner(board) !== null) {
        return true
    } 

    // checks if the whole board is already full
    full_rows = 0;

    for (let row=0; row<3; row++) {
        full_col = 0;

        for (let col=0; col<3; col++) {

            if (board[row][col] !== null) {
                full_col += 1;
            }
        }

        full_rows += Math.floor(full_col/3);
    }
    return full_rows === 3
}

function return_all_valid_moves(board) {
    // returns a list of possible moves

    valid_moves = [];

    for (let r=0; r<3; r++) {

        for (let c=0; c<3; c++) {
            if (board[r][c] === null) {
                valid_moves.push(r*3+c);
            }
        }
    }

    return valid_moves
}

function computer_move() {
    // turns off player clicking
    remove_boxes_clickable();

    // for now does random moves
    valid_moves = return_all_valid_moves(BOARD);

    let move = valid_moves[0]; 

    place_player(move, 0);
    next_player();
}

function player_move() {
    // player turn
    set_boxes_clickable();

    // followed by box-clicked once a move is made
}

function finish() {
    // remove boxes clickable
    remove_boxes_clickable();
    
    winner = compute_winner(BOARD);
    if (game_ends(BOARD) === true && winner !== null) {
        STATUSel.innerHTML = `${PLAYER_NAME[winner]} wins!!`;

        // update local storage values if player wins
        if (winner === 1) {
            localStorage.setItem('win-counter', parseInt(localStorage.getItem('win-counter'))+1);
        }

    } else if (game_ends(BOARD) === true && winner !== null) {
        STATUSel.innerHTML = `You tied!`;
    }
}

// LET THE GAME BEGIN!!!! --------------------------------------

reset();

