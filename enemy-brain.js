//display variables
const tictacButtons = Array.prototype.slice.call(document.getElementsByClassName("container container__tictactoetile"));
const startButton = document.getElementById("startButton");
const outcomeLabel = document.getElementById("outcome-text");

//help variables
let tempPos = {}; //this is used when converting from an index to a position, to hold returned position object.
let gameGoing = false;

//brains variables
let turnCount = 0;
let winReadyAt = -1;
let forcedTile = -1;

startButton.addEventListener('click', () => {
    //start the game.
    tictacButtons.forEach(button => {
        button.innerHTML = "";
    });
    outcomeLabel.innerHTML = "";
    winReadyAt = -1;
    forcedTile = -1;
    turnCount = 0;
    makeAMove();
})

console.log(tictacButtons);
tictacButtons.forEach(button => {
    button.onclick = () => {
        if(event.target.innerHTML == ""){
            event.target.style.color = "green";
            event.target.innerHTML = 'O';
            makeAMove();
        }
    }
});


/*button array location
 0 1 2
 3 4 5
 6 7 8
*/
const makeAMove = () => {
    console.log("TURN START");
    console.log("turn: " + turnCount + "::winReadyAt: " + winReadyAt);
    if(winReadyAt != -1){
        if(tictacButtons[winReadyAt].innerHTML == ""){
            playAt(winReadyAt);
            aiWon();
            return;
        }
        else{
            winReadyAt = -1;
        }
    }
    switch (turnCount){
        case 0:
            playAt(0);
        break;
        case 1: case 2:
            //check for a 'forced tile' one that I have to play or lose.
            forcedTile = checkForcedTiles();
            if(forcedTile != -1){
                playAt(forcedTile);
                break;
            }

            if(laneAvailable(0)){ playAt({x:0, y:2}); winReadyAt = 1;}
            else if(laneAvailable(2)){ playAt({x: 2, y: 0}); winReadyAt = 3;}
            else if(laneAvailable(1)){ playAt({x:2, y:2}); winReadyAt = 4;}
        break;
        case 3: case 4:
            winReadyAt = checkForWins();//check to see if there's any wins available
            if(winReadyAt != -1){
                playAt(winReadyAt);
                aiWon();
                break;
            }
            //check for a 'forced tile' one that I have to play or lose.
            forcedTile = checkForcedTiles();
            if(forcedTile != -1){
                playAt(forcedTile);
                break;
            }
            else{
                if(tictacButtons[8].innerHTML == ""){
                    playAt(8);//the last possible tile they may not have played.
                }
                else if(tictacButtons[4].innerHTML == ""){
                    playAt(4);
                    aiWon();
                }
                else if(tictacButtons[6].innerHTML == ""){
                    playAt(6);
                }
            }
            break;
    }
    let k = 0;
    tictacButtons.forEach(button => {
        if(button.innerHTML != "")k++;
    })
    if(k == 9 && outcomeLabel.innerHTML == ""){
        outcomeLabel.style.color = "orange";
        outcomeLabel.innerHTML = "Draw!";
    }
    turnCount++;
}

const playAt = (position) => {
    console.log("PLAYING AT: " + position);
    if(typeof(position) == "number"){
        tictacButtons[position].style.color = "blue";
        tictacButtons[position].innerHTML = "X";
    }
    else if(typeof(position) == "object"){
        let index = posToIndex(position);
        tictacButtons[index].style.color = "blue";
        tictacButtons[index].innerHTML = "X";
    }
}


//AI HELP FUNCTIONS::

const checkForWins = () => {
    myTiles = []//Array of the indexes of tiles I've played.
    emptySides = []//empty side tiles (not corners)
    tictacButtons.forEach((button, index) => {
        if(index % 2 == 0 && index != 4 && button.innerHTML == "X") myTiles += (""+index)
        if(index % 2 != 0 && button.innerHTML == "") emptySides += (""+index);
    })
    console.log("myTiles: " + myTiles);
    console.log("emptyTiles: " + emptySides);
    if(emptySides.includes(1)){
        if(tictacButtons[0].innerHTML == "X" && tictacButtons[2].innerHTML == "X"){
            return 1;
        }
    }
    if(emptySides.includes(3)){
        if(tictacButtons[0].innerHTML == "X" && tictacButtons[6].innerHTML == "X"){
            return 3;
        }
    }
    if(emptySides.includes(5)){
        if(tictacButtons[2].innerHTML == "X" && tictacButtons[8].innerHTML == "X"){
            return 5;
        }
    }
    if(emptySides.includes(7)){
        if(tictacButtons[6].innerHTML == "X" && tictacButtons[8].innerHTML == "X"){
            return 7;
        }
    }
    return -1;
}




/*
    ex: l0 is lane 0
 [0,0] l 0
 l   l
 2     1
*/
const laneAvailable = (laneIndex) => {
    switch(laneIndex){
        case 0:
            if(tictacButtons[1].innerHTML == "" && tictacButtons[2].innerHTML == ""){
                return true;
            }
            else return false;
        case 1:
            if(tictacButtons[4].innerHTML == "" && tictacButtons[8].innerHTML == ""){
                return true;
            }
            else return false;
        case 2:
            if(tictacButtons[3].innerHTML == "" && tictacButtons[6].innerHTML == ""){
                return true;
            }
            else return false;

    }
}
const posToIndex = (pos) => {
    const x = pos.x;
    const y = pos.y;
    console.log("posToIndex: " + (x * 3 + y));
    return (x * 3 + y);
}
const indexToPos = (index) => {
    let pos = {
        x: 0,
        y: 0
    }
    if(index < 3){
        pos.x = 0;
        pos.y = index;
        console.log("indexToPos: " + pos);
        return pos;
    }
    //else
    pos.x = Math.floor(index / 3);
    pos.y = index % 3;
    console.log("indexToPos: " + pos);
    return pos;
}
const checkForcedTiles = () => {
    //check if we have to play that tile:
    if(tictacButtons[4].innerHTML == "O"){
        if(tictacButtons[1].innerHTML == "O" && tictacButtons[7].innerHTML == ""){
            return 7;//play at 7 to prevent losing.
        }
        else if(tictacButtons[3].innerHTML == "O" && tictacButtons[5].innerHTML == ""){
            return 5;//play at 5 to prevent losing.
        }
        else if(tictacButtons[5].innerHTML == "O" && tictacButtons[3].innerHTML == ""){
            return 3;//play at 3 to prevent losing.
        }
    }
    return -1;
}

const aiWon = () => {
    outcomeLabel.style.color = "red";
    outcomeLabel.innerHTML = "You lost!";
}