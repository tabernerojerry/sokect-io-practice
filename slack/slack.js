const path = require('path');
const express = require('express');
const socketio = require('socket.io');

const namespaces = require('./data/namespaces');

const app = express();

app.use('/static', express.static(path.join(__dirname + '/public')));

// express server
const server = app.listen(8001, () => console.log('server is running...'));

// socket.io server
const io = socketio(server);

const mainNamespace = io.of('/');

/**
 * Communicate with the Main Namespace
 * io.on = io.of('/).on = io.sockets.on
 * io.emit = io.of('/).emit = io.sockets.emit
 */
mainNamespace.on('connection', (mainSocket) => {
    // console.log(mainSocket.handshake);

    // build an array to send back with the image and endpoint of each namespace
    const nsData = namespaces.map(({ img, endpoint }) => ({ img, endpoint }));

    /**
     * send the namespace back to the client.
     * We need to use mainSocket , NOT io,
     * because we want it to go to just this client
     */
    mainSocket.emit('nsList', nsData);
});

/**
 * loop through each namespace and listen for a connection
 */
namespaces.forEach(namespace => {
    io.of(namespace.endpoint)
        .on('connection', nsSocket => {
            const username = nsSocket.handshake.query.username;

            // console.log(`${nsSocket.id} has join ${namespace.endpoint}`);

            /**
             * A socket has connected to one of our chat group namespaces
             * send that ns group info back
             */
            nsSocket.emit('nsRoomLoad', namespace.rooms);

            /**
             * listening on client which room to join
             * joinRoom is the event to listen
             * roomToJoin is the data receive from the client which the room name
             * numberOfUsersCallBack is the callback that sending the number of users join the room
             */
            nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallBack) => {
                // console.log(`${nsSocket.id} has join to room ${roomToJoin}`);

                // leave to the current room
                const roomToLeave = Object.keys(nsSocket.rooms)[1];
                nsSocket.leave(roomToLeave);
                updatesUserInRoom(namespace, roomToLeave);

                // join to room
                nsSocket.join(roomToJoin);

                /* io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
                    numberOfUsersCallBack(clients.length);
                }); */

                // chat messages history
                const nsRoom = namespace.rooms.find(room => room.roomTitle === roomToJoin);
                nsSocket.emit('historyCatchUp', nsRoom.history);

                updatesUserInRoom(namespace, roomToJoin);
            });

            nsSocket.on('newMessageFromClient', ({ message }) => {
                const fullMessage = {
                    text: message,
                    time: Date.now(),
                    username,
                    avatar: 'https://via.placeholder.com/30'
                };

                // console.log(message);
                // Send this message to ALL the sockets that are in the room that THIS Socket is in.
                // how can we find out what rooms THIS socket is in?
                // console.log(nsSocket.rooms);

                // the user will be in the 2nd room in the object list
                // this is because the socket always joins its own room on connection
                // get the keys
                const roomTitle = Object.keys(nsSocket.rooms)[1];

                // we need to find the Room object of this room
                const nsRoom = namespace.rooms.find(room => room.roomTitle === roomTitle);
                // push new message to history of current room
                nsRoom.addMessage(fullMessage);

                io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMessage);
            });
        });
});

function updatesUserInRoom(namespace, nsRoom) {
    /**
     * send back the number of users in this
     * room to ALL sockets connected to this room
     */
    io.of(namespace.endpoint).in(nsRoom).clients((error, clients) => {
        // console.log(clients.length);
        io.of(namespace.endpoint).in(nsRoom).emit('updateMembers', clients.length);
    });
}