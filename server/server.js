const express = require('express');
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());


app.get('/', (req, res) => {
    res.status(200).send('<h1>Server is fucked up ❤️</h1>');
    // res.redirect(`/${uuidV4()}`);
});


const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

//==================socket logic============================
var fenStringWhite = "47 37 27 57 17 67 07 77 06 16 26 36 46 56 66 76 40 30 20 50 10 60 00 70 01 11 21 31 41 51 61 71";
var fenStringBlack = "30 40 50 20 60 10 70 00 71 61 51 41 31 21 11 01 37 47 57 27 67 17 77 07 76 66 56 46 36 26 16 06";

io.on('connection', (socket) => {
    console.log("User connected :", socket.id);

        socket.on('join-room', ({name, room}) => {
            var x = getUsersInRoom(room);
            // console.log(x);
            if(x.length < 2){
                const user = addUser({ id: socket.id, name, room });// here id is an socket id

                // if(error) return callback(error);
                //otherwise join the user to the room
                socket.join(user.room);

                var y = getUsersInRoom(room);
                // console.log(y);

                // console.log(getUser(socket.id), ' its me')
                
                if(y.length === 2){

                    socket.emit('message',{ name : y[0].name, peerid: y[0].id });
                    //now to alert all other users present in the room that a new user has joined we use broadcast

                    socket.broadcast.to(y[0].id).emit('message', { name : y[1].name, peerid: y[1].id });
            
                    
                    var fen1 = null;
                    var fen2 = null;
                    var t1 = null;
                    var t2 = null;
                    var rand = Math.random();
                    // console.log(rand);
                    
                    if(rand <= 0.5){
                        fen1 = fenStringWhite;
                        fen2 = fenStringBlack;
                        t1 = true;
                    }else{
                        fen1 = fenStringBlack;
                        fen2 = fenStringWhite;
                        t2 = true;
                    }

                    //exchanging of first fen strings will occur here

                    socket.emit('start-game', {fen : fen1, turn: t1});
                    socket.broadcast.to(y[0].id).emit('start-game', {fen : fen2, turn: t2});
                    
                    console.log('join-room, done, game-started');

                    
                    
                }
        
            }
        })

        socket.on('update-game', ({fen, turn}) => {

            var id = socket.id;
            const x = getUser(id);

            var room = x.room

            // console.log(fen, turn);

            var y = getUsersInRoom(room);
            // console.log(y);

            // console.log(id == y[0].id);
            // console.log(id == y[1].id);

            if(id == y[0].id){
                socket.broadcast.to(y[1].id).emit('update-game', ({fen, turn}));
            }else{
                socket.broadcast.to(y[0].id).emit('update-game', ({fen, turn}));
            }
        });

        socket.on('leave', () => {
            var x = getUser(socket.id);
            // console.log(x);
            //check if the user pressed leave button even before joining

            if(x !== undefined){
                var room = x.room;

                var y = getUsersInRoom(room);
                // console.log(y);
                var own = socket.id;
                var opp;

                if(y[0].id == own){
                    opp = (y.length === 2) ? y[1].id : null;
                }else{
                    opp = y[0].id;
                }
                

                socket.emit('leave-accepted');
                socket.broadcast.to(opp).emit('leave-accepted');

                let i = removeUser(own);
                let j = (opp != null) ? removeUser(y[1].id) : null;

            }
        })

        //write discoonet function =>>>>>>>>> MUST
        socket.on('disconnect', () => {
            var x = getUser(socket.id);
            // console.log(x);
            //check if the user pressed leave button even before joining

            if(x !== undefined){
                var room = x.room;

                var y = getUsersInRoom(room);
                // console.log(y);
                
                var own = socket.id;
                var opp;

                if(y[0].id == own){
                    opp = (y.length === 2) ? y[1].id : null;
                }else{
                    opp = y[0].id;
                }
                

                socket.emit('leave-accepted');
                socket.broadcast.to(opp).emit('leave-accepted');

                let i = removeUser(own);
                let j = (opp != null) ? removeUser(y[1].id) : null;

            }
        })


});

//==============================================

server.listen(port, (err) => {
    if(err) console.log(err);
    console.log(`Server started on ${port} ..`);
});

