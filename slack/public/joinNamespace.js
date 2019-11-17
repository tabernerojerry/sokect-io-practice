/**
 * Namespace Socket
 * endpoint: string (eg: /wiki)
 */
function joinNamespace(endpoint) {

    /**
     * check to see if nsSocket is actually a socket
     * then close the connection when leave the namespace
     */
    if(nsSocket) {
        nsSocket.close();

        // remove event form listener before it's added again
        document.querySelector('#user-input')
            .removeEventListener('submit', submitForm);
    }

    nsSocket = io(`http://localhost:8001${endpoint}`);

    /**
     * Load all available namespace rooms
     */
    nsSocket.on('nsRoomLoad', nsRooms => {
        // console.log(nsRooms);
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = "";
        nsRooms.forEach(room => {
            const glyph = room.privateRoom ? 'lock' : 'globe';
            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
        });

        // add click listener to each room
        roomList.addEventListener('click', event => {
            console.log(event.target.innerText);
            joinRoom(event.target.innerText)
        });

        // add room automatically... first time here
        const topRoom = document.querySelector('.room');
        const topRoomName = topRoom.innerText;
        joinRoom(topRoomName);
    });

    /**
     * Chat messages
     */
    nsSocket.on('messageToClients', message => {
        // console.log(message);
        const newMessage = buildHTML(message);
        document.querySelector('#messages').innerHTML += newMessage;
    })

    /**
     * Message Form
     */
    document.querySelector('#user-input')
        .addEventListener('submit', submitForm);
}

/**
 * Submit Chat message form
 * @param event: submit form event
 */
function submitForm(event) {
    event.preventDefault();

    const newMessage = document.getElementById('user-message').value;
    console.log(newMessage)
    nsSocket.emit('newMessageFromClient', { message: newMessage });
}

/**
 * LI element message
 * @param message: object
 */
function buildHTML(message) {
    const formatDate = new Date(message.time).toLocaleString();
    const newHTML = `
        <li>
            <div class="user-image">
                <img src="${message.avatar}" />
            </div>
            <div class="user-message">
                <div class="user-name-time">${message.username} <span>${formatDate}</span></div>
                <div class="message-text">${message.text}</div>
            </div>
        </li>
        `

    return newHTML;
}
