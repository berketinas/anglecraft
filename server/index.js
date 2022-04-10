const server = require('http').createServer();

const socketIO = require('socket.io')(server);
socketIO.on("connection", (socket) => {
    socket.emit("test", "hello", "from", "server");
});

const port = 1235;
server.listen(port, function(){
    console.log(`server running on port 1235`)
});
