// USEFUL CONTSTANTS -------------------------------
// html elements on the page (names ending with el)
let BOXESel = document.getElementsByClassName("box");
let WIN_COUNTERel = document.getElementById("win-counter");
let STATUSel = document.getElementById("status");

// for computational purposes
let CUR_PLAYER = Math.floor(Math.random()*2); /* generates a random number either player 0 or player 1 */
const PLAYER_NAME = ['computer', 'player']

let BOARD = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
]

// ON STARTUP --------------------------------------------

// sets wins in local storage to 0 if it doesn't exist yet
if (localStorage.getItem('wins-counter') === null) {
    localStorage.setItem('wins-counter', 0);
}

// HTML/CSS STUFF -----------------------------------
function reset_board_visually() {
    // resets the boxes back to blank
    for (let i=0; i < BOXESel.length; i++) {
        BOXESel[i].innerHTML = "";
    }

    // start game setup
    WIN_COUNTERel.innerHTML = `Wins: ${localStorage.getItem('wins-counter')}`;
    STATUSel.innerHTML = `${PLAYER_NAME[CUR_PLAYER]}'s turn`;
}

function set_boxes_clickable() {
    for (let i=0; i<BOXEelS.length; i++) {
        BOXESel[i].setAttribute("onclick", box_clicked(i));
    }
}

function remove_boxes_clickable() {
    for (let i=0; i<BOXEelS.length; i++) {
        BOXESel[i].removeAttribute("onclick");
    }
}

// GENERAL FUNCTIONS ------------------------------
function reset() {
    reset_board_visually();
    reset_computations();
}

function box_clicked(box_index) {
    
}

function place_player(box_index, player) {
    // visuall updates the board    
    BOXESel[box_index].innerHTML = `<div class="box"><img src="/images/tic-tac-toe/player${player}.jpg"></div>`;

    // updates the comutating board
    BOARD[Math.floor(box_index/3)][box_index%3] = player;
}

function next_player() {
    // updates the current player to the next player
    if (CUR_PLAYER === 1) {
        CUR_PLAYER = 0;
    } else {
        CUR_PLAYER = 1;
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
        if (board[i][0] === board[i][1] === board[i][2]) {
            return board[i][0];
        }

        // tests the vertical
        if (board[0][i] === board[1][i] === board[2][i]) {
            return board[0][i];
        }
    }

    // tests the diagonals
    if (board[1][1] !== null && board[0][0] === board[1][1] === board[2][2]) {
        return board[1][1];

    } else if (board[1][1] !== null && board[0][2] === board[1][1] === board[2][0]) {
        return board[1][1];
    }

    // last case: no winner
    return null

}

// LET THE GAME BEGIN!!!! ------------------------------

// while there is no winner
while (compute_winner(BOARD) === null) {

    // player turn

    // computer turn


}

// once there is a winner
