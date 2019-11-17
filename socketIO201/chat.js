const path = require('path');
const express = require('express');
const socketio = require('socket.io');

const app = express();

app.use('/static', express.static(path.join(__dirname + '/public')));

const server = app.listen(8001);

// socket.io server
const io = socketio(server);
const mainNamespace = io.of('/');
const adminNamespace = io.of('/admin');

/**
 * Communicate with the Main Namespace
 * io.on = io.of('/).on
 */
mainNamespace.on('connection', (socket) => {
    socket.emit('messageFromMainServer', {data: 'Welcome to socket.io server' });

    socket.on('messageFromClient', message => {
        console.log(message);
    });

    socket.join('level1');
    mainNamespace.to('level1').emit('join1', `${socket.id} says, I have joined to level 1`);
});

/**
 * Communicate with the Admin Namespace
 */
adminNamespace.on('connection', (socket) => {
    console.log('Running admin...');

    adminNamespace.emit('welcome', 'Welcome to admin channel');
});