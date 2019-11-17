const mainSocket = io('http://localhost:8001'); // the / endpoint namspace
const adminSocket = io('http://localhost:8001/admin'); // the /admin namspace

mainSocket.on('messageFromMainServer', msg => {
    console.log(msg);
})

adminSocket.on('welcome', msg => console.log(msg));

mainSocket.on('join1', msg => console.log(msg));

document.getElementById('message-form')
    .addEventListener('submit', event => {
        event.preventDefault();

        const newMessage = document.getElementById('message').value;

        mainSocket.emit('newMessageFromClient', { message: newMessage });
    });
