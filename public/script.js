//=================================================================================================
const socket = io(window.location.host, {transports: ['websocket', 'polling', 'flashsocket']});
//=================================================================================================

socket.on('connection')

var whitecol = {r:0, g: 118, b: 118};
var blackcol = {r: 165, g: 227, b: 227};


function myclick(){
    var name = document.getElementById('name').value;
    var room = document.getElementById('room').value;

    console.log(name, room);
    
    if(name.length != 0 && room.length != 0){
        socket.emit('join-room', {name, room});

        document.getElementById('f3').innerHTML = "Waiting for your opponent to join ... <br>Ask your friend to join the room<br>🢂  " + room + "  🢀";

        const element = document.getElementById('myform');
        element.remove();
    }
    // document.getElementById('sec').display = block;

}





function mycolor(color){
    if(color == 'Classic'){
        whitecol = {r: 35, g: 35, b: 35};
        blackcol = {r:201, g: 201, b: 201};
    }
    else if(color == 'Blue'){
        whitecol = {r: 11, g: 83, b: 148};  //55, 153, 255
        blackcol = {r:111, g: 168, b: 220}; //0, 26, 153    111 168 220
    }
    else if(color == 'Wood'){
        whitecol = {r:125, g: 66, b: 4}; //(147,92,35)
        blackcol = {r: 190, g: 157, b: 123}; //((190,157,123)
    }
    else if(color == 'Teal'){
        whitecol = {r:0, g: 118, b: 118};
        blackcol = {r: 165, g: 207, b: 227};
    }
}

//=================================== LEAVE MECHANISM ===============================================================

socket.on('leave-accepted', () => {
    location.reload();
})


// leave by leave button =======================
var btn = document.createElement('button');
btn.innerHTML = "LEAVE ➥";

btn.addEventListener("click", function() {
    socket.emit('leave');
});


// var plbtn = document.createElement('button');
// plbtn.innerHTML = 'Play Again ⭯';



// socket disconnect event is added to the server which handles all mechanisms like tab closing, window closing, refreshing , just evry thing
//==================================================================================================================

socket.on('message', (data) => {
    // var msg = document.getElementById('message').value;
    var user = data.name;
    var oppid = data.peerid;

    document.getElementById('f1').innerHTML = "Your opponent, " + user;
    document.getElementById('f2').innerHTML = "YOU"
    // const element = document.getElementById('one');
    // element.remove();

    document.getElementById('one').style.display = 'none';
    
    document.getElementById('leave-btn').append(btn);
    // document.getElementById('play-again').append(plbtn);

    document.getElementById('sec').style.visibility = 'visible';


    // ===================================VIDEO CHATTING =>> PEER IDS ============================================

    console.log(socket.id);

    const myPeer = new Peer(socket.id);
    

    // adds your own video stream to the html
    var myvideo = document.createElement('video');
    myvideo.muted = true;

    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
        
        addVideoStream(myvideo, stream, 'f2-vid');

        myPeer.on('call', call =>{
            call.answer(stream);
            var vid = document.createElement('video');
            call.on('stream', otherStream => {
                addVideoStream(vid, otherStream, 'f1-vid');
            })
        })

        var call = myPeer.call(oppid, stream);
        var vid = document.createElement('video');
        call.on('stream', otherStream => {
            addVideoStream(vid, otherStream, 'f1-vid')
        })
        call.on('close', () =>{
            vid.remove();
            
        })

    })

});


function addVideoStream(video, stream, val){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    // .add(video);
    document.getElementById(val).appendChild(video);
}

// ===========================================================================================================


/*

colors =====================================
color       dark                dimm
black       0                    255        ===> Classic
blue    0, 114, 181         204, 236, 255   ===> good to eyes
red     255, 10, 102         255, 239, 249  ===> Okayish
brown   165, 80, 80         221, 156, 156   ===> POOR
teal    0, 118, 118         165, 207, 227   ==> BEST


*/