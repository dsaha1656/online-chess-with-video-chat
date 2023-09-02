class Piece{
    constructor(type, x, y, isWhite, id){
        this.type = type;
        this.x = x;
        this.y = y;
        this.isWhite = isWhite;

        this.id = id;
        
        this.isMoving = false;
        this.dead = false;
        this.firstMove = true;
    }

    show(){
        //shows the piece on the board
        var img;

        if(this.type === "K")
            img = this.isWhite ? images[0] : images[6]
        else if(this.type === "Q")
            img = this.isWhite ? images[1] : images[7]
        else if(this.type === "B")
            img = this.isWhite ? images[2] : images[8]
        else if(this.type === "N")
            img = this.isWhite ? images[3] : images[9]
        else if(this.type === "R")
            img = this.isWhite ? images[4] : images[10]
        else if(this.type === "P")
            img = this.isWhite ? images[5] : images[11]

        if(!this.dead){
            if(!this.isMoving)
                image(img, this.x*tileSize, this.y*tileSize, tileSize, tileSize);
            else{
                image(img, floor(mouseX/tileSize) * tileSize - tileSize/5, floor(mouseY/tileSize) * tileSize - tileSize/5, tileSize*1.5, tileSize*1.5);
            }
        }

    }

    update(x, y){
        //updates the location of the piece
        this.x = x;
        this.y = y;
        if(this.type === "P" && this.y === 0){
            this.type = "Q";
        }

    }

    getPieceAtBoard(x, y, color){

        if(x >= 0 && x < 8 && y >= 0 && y < 8){
            for(let i = 0; i < allChessPieces.length; i++){
                if(allChessPieces[i].x === x && allChessPieces[i].y === y && !allChessPieces[i].isdead){
                    if(allChessPieces[i].isWhite === !color) return true;
                    else return false;
                }
            }

            return null;
        }

    }



    showMoves(){
        //rules shown according to piece
        var moves = [];

        if(this.type === "K"){
            this.rulesOfKing(moves);
        }
        else if(this.type === "Q"){
            this.rulesOfQueen(moves);
        }
        else if(this.type === "B"){
            this.rulesOfBishop(moves);
        }
        else if(this.type === "N"){
            this.rulesOfKnight(moves);
        }
        else if(this.type === "R"){
            this.rulesOfRook(moves);
        }
        else if(this.type === "P"){
            this.rulesOfPawn(moves);
        }

        return moves;
    }

    
    //individual rules of pieces

    // king moves ================================================================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    rulesOfKing(moves){
        var dir = [{i: 1, j: 1}, {i: 1, j: -1}, {i: -1, j: -1},{i: -1, j: 1},{i: -1, j: 0},{i: 1, j: 0},{i: 0, j: -1},{i: 0, j: 1}];
        for(let d = 0; d < 8; d++){
            var id = this.getPieceAtBoard(this.x+dir[d].i, this.y+dir[d].j, this.isWhite);
            if(id === null || id === true) moves.push({x: this.x+dir[d].i, y: this.y+dir[d].j, t: (id === null)?0:1 })
        }
    }


    // queen moves ================================================================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    rulesOfQueen(moves){

        //top right moves
        for(let i =1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x+i, this.y-i, this.isWhite)
            if(id === null) moves.push({x: this.x + i, y: this.y-i, t: 0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x + i, y: this.y-i, t: 1}); break; }
        }

        //top left
        for(let i=1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x-i, this.y-i, this.isWhite)
            if(id === null) moves.push({x: this.x - i, y: this.y-i, t:0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x - i, y: this.y-i, t:1}); break; }
        }

        //bottom left
        for(let i=1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x-i, this.y+i, this.isWhite)
            if(id === null) moves.push({x: this.x-i, y: this.y+i,t: 0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x-i, y: this.y+i, t: 1}); break; }
        }

        //bottom right
        for(let i=1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x+i, this.y+i, this.isWhite)
            if(id === null) moves.push({x: this.x+i, y: this.y+i, t: 0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x+i, y: this.y+i,t:1}); break; }
        }

        //right moves
        for(let i =1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x+i, this.y, this.isWhite)
            if(id === null) moves.push({x: this.x + i, y: this.y, t: 0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x + i, y: this.y, t: 1}); break; }
        }

        //left
        for(let i=1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x-i, this.y, this.isWhite)
            if(id === null) moves.push({x: this.x - i, y: this.y, t:0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x - i, y: this.y, t:1}); break; }
        }

        //down
        for(let i=1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x, this.y+i, this.isWhite)
            if(id === null) moves.push({x: this.x, y: this.y+i,t: 0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x, y: this.y+i, t: 1}); break; }
        }

        //up
        for(let i=1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x, this.y-i, this.isWhite)
            if(id === null) moves.push({x: this.x, y: this.y-i, t: 0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x, y: this.y-i,t:1}); break; }
        }

    }


    // bishop moves ================================================================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    rulesOfBishop(moves){

        //top right moves
        for(let i =1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x+i, this.y-i, this.isWhite)
            if(id === null) moves.push({x: this.x + i, y: this.y-i, t: 0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x + i, y: this.y-i, t: 1}); break; }
        }

        //top left
        for(let i=1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x-i, this.y-i, this.isWhite)
            if(id === null) moves.push({x: this.x - i, y: this.y-i, t:0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x - i, y: this.y-i, t:1}); break; }
        }

        //bottom left
        for(let i=1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x-i, this.y+i, this.isWhite)
            if(id === null) moves.push({x: this.x-i, y: this.y+i,t: 0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x-i, y: this.y+i, t: 1}); break; }
        }

        //bottom right
        for(let i=1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x+i, this.y+i, this.isWhite)
            if(id === null) moves.push({x: this.x+i, y: this.y+i, t: 0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x+i, y: this.y+i,t:1}); break; }
        }
    }


    // knight moves ================================================================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    rulesOfKnight(moves){
        var dir = [{i: 1, j: 2}, {i: 2, j: -1}, {i: -1, j: -2},{i: -2, j: 1},{i: -1, j: 2},{i: 2, j: 1},{i: 1, j: -2},{i: -2, j: -1}];
        for(let d = 0; d < 8; d++){
            var id = this.getPieceAtBoard(this.x+dir[d].i, this.y+dir[d].j, this.isWhite);
            if(id === null || id === true) moves.push({x: this.x+dir[d].i, y: this.y+dir[d].j, t: (id === null)?0:1 })
        }
    }

    // rook moves ================================================================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    rulesOfRook(moves){

        //right moves
        for(let i =1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x+i, this.y, this.isWhite)
            if(id === null) moves.push({x: this.x + i, y: this.y, t: 0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x + i, y: this.y, t: 1}); break; }
        }

        //left
        for(let i=1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x-i, this.y, this.isWhite)
            if(id === null) moves.push({x: this.x - i, y: this.y, t:0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x - i, y: this.y, t:1}); break; }
        }

        //down
        for(let i=1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x, this.y+i, this.isWhite)
            if(id === null) moves.push({x: this.x, y: this.y+i,t: 0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x, y: this.y+i, t: 1}); break; }
        }

        //up
        for(let i=1; i < 8; i++){
            var id = this.getPieceAtBoard(this.x, this.y-i, this.isWhite)
            if(id === null) moves.push({x: this.x, y: this.y-i, t: 0});
            else if(id === false) break;
            else if(id === true) { moves.push({x: this.x, y: this.y-i,t:1}); break; }
        }

    }

    //pawn moves ==================================================================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    rulesOfPawn(moves){

        // enemy pos
        for(let i = -1; i <= 1; i+=2){
            var id = this.getPieceAtBoard(this.x+i, this.y-1, this.isWhite)
            if(id === true) moves.push({x: this.x+i, y: this.y-1,t:1}); 
        }

        //forward move
        var xid = this.getPieceAtBoard(this.x, this.y-1, this.isWhite)
        if(xid === null) moves.push({x: this.x, y: this.y-1,t: 0}); 

        if(this.firstMove){
            var id = this.getPieceAtBoard(this.x, this.y-2, this.isWhite)
            if(id === null && xid === null) moves.push({x: this.x, y: this.y-2,t:0});
        }
    }
}

// taking pos info as an object is best for calc
// need to change that