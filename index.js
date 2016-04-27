var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.send('<h1>Welcome Realtime Server</h1>');
});

var onlineUsers = {};
var onlineCount = 0;

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('login', function (obj) {
        socket.name = obj.userId;

        if (!onlineUsers.hasOwnProperty(obj.userName)) {
            onlineUsers[obj.userId] = obj.userName;
            onlineCount++;
        }
        io.emit('login', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj });
        console.log(obj.userName + ' join in the chat');
    });
    socket.on('disconnect', function () {
        if (onlineUsers.hasOwnProperty(socket.name)) {
            var obj = { userId: socket.name, userName: onlineUsers[socket.name] };
            delete onlineUsers[socket.name];
            onlineCount--;
            io.emit('logout', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj });
            console.log(obj.userName + ' has left the chat');
        }
    });
    socket.on('message', function (obj) {
        io.emit('message', obj);
        console.log(obj.userName + ' said :' + obj.content);
    })
})

http.listen(80, function () {
    console.log('listening on * : 80');
});