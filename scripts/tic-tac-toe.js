let BOXES = document.getElementsByClassName("box");

// function make_move(box, player) {

// }

function reset() {
    // RESETS THE BOARD (VISUALLY)
    for (let i=0; i < BOXES.length; i++) {
        BOXES[i].innerHTML = "";
    }
}