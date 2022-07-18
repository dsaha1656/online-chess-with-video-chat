

var allChessPieces = [];
var isWhiteMove = null; //tels about whose current move is right now

var dictOfId = ["WK", "WQ", "WB", "WB", "WN", "WN", "WR", "WR", "WP", "WP","WP","WP","WP","WP","WP","WP", "BK", "BQ", "BB", "BB", "BN", "BN", "BR", "BR", "BP", "BP","BP","BP","BP","BP","BP","BP"];

//white below
// var fenStringWhite = "47 37 27 57 17 67 07 77 06 16 26 36 46 56 66 76 40 30 20 50 10 60 00 70 01 11 21 31 41 51 61 71";

//black below
// var fenStringBlack = "30 40 50 20 60 10 70 00 71 61 51 41 31 21 11 01 37 47 57 27 67 17 77 07 76 66 56 46 36 26 16 06";

//=============================================================================================================================

function reverseFenstring(fenString){
    //id's remain the same the col and row changes
    var arr = fenString.split(" ");
    var narr = [];
    // arr.join(' '); generates a string with spaces
    for(let i = 0; i < arr.length; i++){
        var text = arr[i];
        var c = parseInt(text[0]);
        var r = parseInt(text[1]);

        r = 7 - r;
        c = 7 - c;
        r = r.toString();
        c = c.toString();

        // console.log(r, c);
        // console.log(idx+ c+r);
        narr.push(c+r);

    }

    var fx = narr.join(' ');
    return fx;
}

// fenString2 = reverseFenstring(fenString1);
// console.log(fenString2);


//=============================================================================================================================

function intialiseBoard(fenString){
    // fenstring format ==> "XXAB XXAB XXAB XXAB ..... " => XX for idx no and A, B => col, row
    var arr = fenString.split(" ");
    for(let i = 0; i < arr.length; i++){
        var text = arr[i];
        var c = parseInt(text[0]);
        var r = parseInt(text[1]);

        var t = dictOfId[i];
        if(t[0] === 'W'){
            allChessPieces.push(new Piece(t[1], c, r, true));
        }
        else{
            allChessPieces.push(new Piece(t[1], c, r, false));
        }

    }
}

//=============================================================================================================================

// function updateBoard(fenString){
//     //only update the c nad r of pieces, will not delete any piece from the allChessPieces array
//     for(let i = 0; i < allChessPieces.length; i++){

//     }
// }

//=============================================================================================================================


function getFenStringFromBoard(allChessPieces){
    //should only give the fen of the updated pieces and not the old ones
    //and it should be reversed of the board as oppent is playing the reverse of the board
    // console.log('i am inside')
    var arr = [];
    for(let i = 0; i < allChessPieces.length; i++){
        var text = allChessPieces[i].x.toString() + allChessPieces[i].y.toString();

        // console.log(text);
        arr.push(text);
    }

    var fen = arr.join(' ');

    return reverseFenstring(fen);

}


//=============================================================================================================================
//socket-logic-initialises the game ==============================

socket.on('start-game', data => {
    var fen = data.fen;
    isWhiteMove = data.turn;
    intialiseBoard(fen);

    console.log('game-started')


})





//socket logic updates the board ====================================
socket.on('update-game', (data) => {
    var fen = data.fen;
    var turn = data.turn;

    console.log('i got the value');

    var a = fen.split(" ");
    for(let i = 0; i < allChessPieces.length; i++){
        var t = a[i];
        var c = parseInt(t[0]);
        var r = parseInt(t[1]);

        allChessPieces[i].update(c, r);
    }

    isWhiteMove = turn;
})



//=============================================================================================================================

//===================================================================

//<<<<<<=================== dont change bastard =====================>>>>>>>>

// function removeDeadPiece(id){
//     allChessPieces.splice(id, 1);
// }

//=================================================================
function getPieceAt(x, y, isWhiteMove){
    for(let i = 0; i < allChessPieces.length; i++){
        if(allChessPieces[i].x === x && allChessPieces[i].y === y){
            if(allChessPieces[i].isWhite === isWhiteMove && !allChessPieces[i].isDead){
                return i;
            }
        }
    }

    return -1;
}


function getStatus(moves, x, y){
    for(let i = 0; i < moves.length; i++){
        if(moves[i].x === x && moves[i].y === y){
            return {val: true, type: moves[i].t};
        }
    }
    return {val: false, type: -1};
}



// =====================MOVEMENT UI ==================================>>>>>>>>

var idx = -1;

var intialfen;

var moves = [];

//===================================================================
function mousePressed()
{
    var x = floor(mouseX/tileSize);
    var y = floor(mouseY/tileSize);
    
    var isMouseInside = (x >= 0 && x < 8 && y >=0 && y < 8) ? true : false;

    if(isMouseInside){
        console.log(x, y);
        idx = getPieceAt(x, y, isWhiteMove);
        // console.log(idx)
        if(idx !== -1){
            // means the piece is a valid piece
            allChessPieces[idx].isMoving = true;
            allChessPieces[idx].show();
            moves = allChessPieces[idx].showMoves();
            console.log(moves);
        }
    }

    intialfen  = getFenStringFromBoard(allChessPieces);
    // console.log(intialfen);
}

//====================================================================
function mouseReleased(){
    var x = floor(mouseX/tileSize);
    var y = floor(mouseY/tileSize);
    // console.log(x, y);

    var isMouseInside = (x >= 0 && x < 8 && y >=0 && y < 8) ? true : false;
    
    //eat opponent =enter piece specific rules here (positions that a piece can move ===>> HARD)=====================

    var obj = getStatus(moves, x, y);

    if(obj.type === 1){
        var eidx = getPieceAt(x,y, !isWhiteMove); // eidx = enemy piece
        // console.log(eidx)
        if(eidx !== -1 && idx !== -1){
            allChessPieces[eidx].isDead = true;
            allChessPieces[eidx].update(9,9);
        }
    }


    var fidx = getPieceAt(x,y, isWhiteMove); //friendly piece
    var ftrue = (fidx !== -1)
    //=================================================================================================

    if(idx !== -1)
    {   if(allChessPieces[idx].x === x && allChessPieces[idx].y === y) //check if same position as before
        {
            allChessPieces[idx].isMoving = false;
        }
        else if(ftrue){ // or if the piece is of the same side
            allChessPieces[idx].isMoving = false;
        }
        else if(!isMouseInside){ //constrain mouse within canvas
            allChessPieces[idx].isMoving = false;
        }
        else if(obj.val)
        {   console.log('inside');
            isWhiteMove = !isWhiteMove;
            allChessPieces[idx].firstMove = false;
            allChessPieces[idx].update(x, y);
            allChessPieces[idx].isMoving = false;

            //socket which emits fen string to opponent
        }else{
            allChessPieces[idx].isMoving = false;
        }

        

        var finalfen  = getFenStringFromBoard(allChessPieces);
        // console.log(finalfen);

        if(intialfen !== finalfen){
            socket.emit('update-game', ({fen : finalfen, turn: isWhiteMove}));
            // console.log('hi');
            isWhiteMove = null;
        }

        idx = -1;
        moves = [];
    }



    // if(eidx !== -1 && allChessPieces[eidx].isDead) removeDeadPiece(eidx);
}
//<<<<<<<<<<==================================================>>>>>>>>>>>>>>>>>>>>>>>>

