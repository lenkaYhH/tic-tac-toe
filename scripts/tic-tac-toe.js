// USEFUL CONTSTANTS -------------------------------
// html elements on the page (names ending with el)
let BOXESel = document.getElementsByClassName("box");
let WIN_COUNTERel = document.getElementById("win-counter");
let STATUSel = document.getElementById("status");

// for computational purposes
let CUR_PLAYER;
const PLAYER_NAME = ['computer', 'player'];

let BOARD = [null, null, null, null, null, null, null, null, null];

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

    CUR_PLAYER = (-1) ** Math.floor(Math.random()*3); /* generates a random number either player -1 or player 1 */
    console.log(`Starting player: ${CUR_PLAYER}`);
    // console.log(`CUR PLAYER: ${CUR_PLAYER}`);

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
    // BOXESel[box_index].innerHTML = `<img src="/images/tic-tac-toe/player${player}.jpg">`;
    BOXESel[box_index].innerHTML = `${player}`;

    // updates the computating board

    BOARD[box_index] = player;

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
            CUR_PLAYER = -1;
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
    BOARD = [null, null, null, null, null, null, null, null, null];

    CUR_PLAYER = (-1) ** Math.floor(Math.random()*3); /* generates a random number either player -1 or player 1 */
}

function compute_winner(board) {
    // returns the winner, if any

    for (let i=0; i<3; i++) {
        // tests the horizontal
        // 0 1 2, 3 4 5, 6 7 8
        if (board[3*i] !== null && board[3*i] == board[3*i+1] && board[3*i+1] == board[3*i+2]) {
            return board[3*i];
        }

        // tests the vertical
        // 0 3 6, 1 4 7, 2 5 8
        if (board[i] !== null && board[i] == board[3+i] && board[3+i] == board[6+i]) {
            return board[i];
        }
    }

    // tests the diagonals
    // 0 4 8 or 2 4 6
    if (board[0] !== null && board[0] == board[4] && board[4] == board[8]) {

        return board[4];

    } else if (board[2] !== null && board[2] == board[4] && board[4] == board[6]) {
        return board[4];
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
    full = 0;

    for (let i=0; i<9; i++) {
        if (board[i] !== null) {
            full += 1;
        }
    }

    return full === 9;
}

function return_all_valid_moves(board) {
    // returns a list of possible moves

    valid_moves = [];

    for (let i=0; i<9; i++) {

        if (board[i] === null) {
            valid_moves.push(i);
        }
        
    }

    console.log()
    return valid_moves
}

function computer_move() {
    // turns off player clicking
    remove_boxes_clickable();

    // doing random moves
    valid_moves = return_all_valid_moves(BOARD);
    let move = valid_moves[Math.floor(Math.random() * valid_moves.length)]; 

    // smart computer :)
    // let move = minimax(BOARD, -1);

    place_player(move, -1);
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
        STATUSel.innerHTML = `${winner} wins!!`;

        // update local storage values if player wins
        if (winner === 1) {
            localStorage.setItem('win-counter', parseInt(localStorage.getItem('win-counter'))+1);
        }

    } else if (game_ends(BOARD) === true && winner !== null) {
        STATUSel.innerHTML = `You tied!`;
    }
}

// FANCY SMART COMPUTER STUFF (yes the ones that take a long time) ------------------------------------------------
function result(board, move, player) {
    // returns the board state after making move

    // makes a DEEP copy of the board (avoids changing original); ... only workds for 1D arrays!
    // let new_board = JSON.parse(JSON.stringify(board));
    new_board = [...board];

    new_board[move] = player;

    return new_board;
}

function utility(board) {
    // returns 1 if player 1 (human) won the game, 0 for none and -1 for player 0 (computer)
    // ik this function feels kinda useless but trust me it's so essential to the calculations (and keeping it neat)
    if (compute_winner(board) !== null) {
        return compute_winner(board);

    } else {
        return 0;

    }
}

// where the magic happens --------------------------

function minimax(board, player) {
    // returns the optimal action for the player
    console.log("running through all the possibilities...");

    let optimal_action;
    let val;

    // computer wants the points to be as little/as negative as possibke while humans' best moves are when it gives them the largest positive score
    if (player === -1) {
        console.log("part 1")
       val = 100000000;

        // valid_actions = return_all_valid_moves(board);

        for (let action in return_all_valid_moves(board)) {

            let m = max_value(result(board, action))

            if (m <= val) {
                console.log(`Optimal action changed to ${action} with val ${m}`);
                optimal_action = action;
                val = m;
            } 

        }

    } else {
        console.log("here");

        val = -100000000;

        // valid_actions = return_all_valid_moves(board);

        for (let action in return_all_valid_moves(board)) {

            let m = min_value(result(board, action))

            if (m >= val) {
                console.log(`Optimal action changed to ${action} with val ${m}`);
                optimal_action = action;
                val = m;
            } 

        }
    }

    console.log(`best move found as: ${optimal_action} with ${val}`);
    return optimal_action;

}

// the funky recursion stuff (may bugs never find this place) ---------------------------
// basically what these functions do is that they run through all the possible moves
// each function here "models" a player, one tries to maximize the score as much as possible and another tries to minimize it
// these following functions, for each possible move, calls on the other function and tries to see which move gives the best score for themselves

function max_value(board) {

    // if the game has ended, give the points on which player wins
    if (game_ends(board)) {
        return utility(board)
    }

    // if there is no winner yet, run thru the possibilities
    let v = -10000;

    let va = return_all_valid_moves(board);

    for (let i=0; i<va.length; i++) {
        
        if (va[i] === undefined) {
            console.log(i);
            console.log(va);
            alert("undefined!")
        }

        v = Math.max(v, min_value(result(board, va[i])));
    }
    
    return v

}

function min_value(board) {

    if (game_ends(board)) {
        return utility(board);
    }

    let v = 10000;

    let va = return_all_valid_moves(board);

    for (let i=0; i<va.length; i++) {
        if (va[i] === undefined) {
            console.log(i);
            console.log(va);
            alert("undefined!")
        }
        
        v = Math.min(v, max_value(result(board, va[i])));
    }
    
    return v
}

// LET THE GAME BEGIN!!!! --------------------------------------

reset();

