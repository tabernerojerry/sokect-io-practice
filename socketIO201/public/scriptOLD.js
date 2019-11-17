const socket = io('http://localhost:8001'); // the / endpoint namspace
const socketAdmin = io('http://localhost:8001/admin'); // the /admin namspace

socket.on('connect', () => console.log(socket.id));
socketAdmin.on('connect', () => console.log(socketAdmin.id));

document.getElementById('message-form')
    .addEventListener('submit', event => {
        event.preventDefault();

        const newMessage = document.getElementById('message').value;

        socket.emit('newMessageFromClient', { message: newMessage });
    });

socket.on('messageFromClients', ({ message }) => {
    document.getElementById('messages').innerHTML += `<li class="collection-item">${message}</li>`
});

socket.on('messageFromServer', dataFromServer => {
    console.log(dataFromServer);

    socket.emit('messageFromClient', { data: 'Data from client!' });
});

socketAdmin.on('welcome', msg => console.log(msg));