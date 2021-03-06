const express = require("express");
const app = express();
var server = require('http').Server(app);


const io = require('socket.io').listen(server)
// const server = require("server");
var http = require('http');

const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true,
})

const users = {

}





app.set('view engine', 'ejs');




app.use(express.static('public'))


app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
    // res.status(200).send("hello world");
    res.send(`http://localhost:8000/${uuidv4()}`)
    // console.log(roomId)
})
// app.get('/participants.ejs', (req, res) => {
//     // res.status(200).send("hello world");
//     // res.send(`http://localhost:8000/${uuidv4()}`)
//     res.render('participants.ejs');
//     // console.log(roomId)
// })





app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
    // console.log(roomId)
})


io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log("we have joined the room");
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        })
    });
    socket.on('new- user-joined', username => {
        users[socket.id] = username;
        console.log("new user", username)
        socket.broadcast.emit('user-joined', username);
    })



})


server.listen(8000, function () {
    console.log('VideoCall server running');
});