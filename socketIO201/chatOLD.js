const path = require('path');
const express = require('express');
const socketio = require('socket.io');

const app = express();

app.use('/static', express.static(path.join(__dirname + '/public')));

const server = app.listen(8001);

// socket.io server
const io = socketio(server);

/**
 * Communicate with the Main Namespace
 */
io.on('connection', (socket) => {
    socket.emit('messageFromServer', {data: 'Welcome to socket.io server' });

    socket.on('messageFromClient', message => {
        console.log(message);
    });

    socket.on('newMessageFromClient', ({ message }) => {
        // send message to everyone on the client
        io.emit('messageFromClients', ({ message }));
    });
});

/**
 * Communicate with the Admin Namespace
 */
io.of('/admin').on('connection', (socket) => {
    console.log('Running admin...');

    io.of('/admin').emit('welcome', 'Welcome to admin channel');
});