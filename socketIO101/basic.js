const http = require('http');
const socketio = require('socket.io');

/**
 * Make HTTP server with NODE
 */
const server = http.createServer((req, res) => {
    res.end('Hello World');
});

const io = socketio(server);

io.on('connection', (socket, req) => {
    // sending message on the UI
    socket.emit('welcome', 'Welcome to socket io.');

    // listening message on the UI
    socket.on('message', (message) => {
        console.log(msg);
    })
})


server.listen(8000, () => console.log(`server is running on port: 8000`));
