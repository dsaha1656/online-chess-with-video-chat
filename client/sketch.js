var tileSize = 80;
var images = [];
// var moves = [];

function setup(){
    
    const canvas = createCanvas(8*tileSize, 8*tileSize);
    canvas.parent('sketch-holder');
    canvas.elt.style.border = "20px solid rgb(0, 0, 0, 0.5)";
    canvas.elt.style.boxShadow = "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px";


    for(let i = 1; i < 13; i++)
    {
        if(i <= 9)
            images.push(loadImage("assets/2000px-Chess_Pieces_Sprite_0" + i + ".png"));
        else 
            images.push(loadImage("assets/2000px-Chess_Pieces_Sprite_" + i + ".png"));
    }
}

//called every fps
function draw(){
    background(255);
    noStroke();

    //display the board ========================>>>>>>>>>>
    showGrid();

    if(moves.length !== 0) showPieceMoves(moves);
    
    // display the pieces ===========================================
    showAllPieces(isWhiteMove);

    
}

// ===============================================================================

function showGrid(){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if((i+j) % 2 !== 0){
                fill(whitecol.r, whitecol.g, whitecol.b);
            }else{
                fill(blackcol.r, blackcol.g, blackcol.b);
            }
            rect(i*tileSize, j*tileSize, tileSize, tileSize);
        }
    }
}

// ==============================================================================


function showAllPieces(isWhiteMove){
    if(!isWhiteMove){
        for(let i = 0; i < allChessPieces.length; i++){
            if(!allChessPieces[i].isDead) allChessPieces[i].show();
        }
    }
    else{
        for(let i = 16; i < allChessPieces.length; i++){
            if(!allChessPieces[i].isDead) allChessPieces[i].show();
        }
        for(let i = 0; i < 16; i++){
            if(!allChessPieces[i].isDead) allChessPieces[i].show();
        }
    }
}

function showPieceMoves(moves){
    // console.log('i am showing moves');
    fill(255, 255, 0);

    for(let i = 0; i < moves.length; i++){
        var x = moves[i].x;
        var y = moves[i].y;
        var t = moves[i].t;
        if(t === 0) ellipse(x*tileSize+tileSize/2, y*tileSize+tileSize/2, tileSize/4);
        else if(t === 1) rect(x*tileSize, y*tileSize, tileSize, tileSize);
    }
}
//===============================================================================
