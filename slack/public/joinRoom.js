/**
 * Room Name Socket
 * @param {string} roomName
 */
function joinRoom(roomName) {
    /**
     * Send room name to the server
     * joinRoom is the event
     * roomName is data
     * newNumberOfMembers is a callback function
     */
    nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span></span>`
    });

    /**
     * Listening to
     * Chat Message History
     */
    nsSocket.on('historyCatchUp', messageHistory => {
        console.log(messageHistory);
        const messageUL = document.querySelector('#messages');
        messageUL.innerHTML = "";

        messageHistory.forEach(message => {
            const newMessage = buildHTML(message);
            messageUL.innerHTML += newMessage;
        })

        // scroll to the bottom of the chat message
        messageUL.scrollTo(0, messageUL.scrollHeight);
    })

    /**
     * Updates Number of Members joined or leave to chat room
     */
    nsSocket.on('updateMembers', numberOfMembers => {
        document.querySelector('.curr-room-num-users').innerHTML = `${numberOfMembers} <span class="glyphicon glyphicon-user"></span></span>`
        document.querySelector('.curr-room-text').innerText = `${roomName}`;
    })

    const searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input', event => {
        console.log(event.target.value);

        const messages = Array.from(document.getElementsByClassName('message-text'));
        console.log(messages);
        messages.forEach(message => {
            if (message.innerText.toLowerCase().indexOf(event.target.value.trim().toLowerCase()) === -1) {
                // the message does not container the user search term
                message.style.display = "none";
            } else {
                message.style.display = "block";
            }
        })
    })
}
