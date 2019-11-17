const username = prompt('What is your username?');
// const mainSocket = io('http://localhost:8001'); // the / endpoint namspace
const mainSocket = io('http://localhost:8001', {
    query: {
        username
    }
}); // the / endpoint namspace
let nsSocket = ""; // global variable for namespaces
/**
 * listen for nsList, which is a list of all namespaces
 */
mainSocket.on('nsList', nsData => {
    // added each NS on the UI
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    nsData.forEach(ns => {
        namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}" /></div>`;
    });

    // add click listener for each NS
    document.querySelector('.namespaces').addEventListener('click', event => {
        const nsEndpoint = event.target.parentElement.getAttribute('ns');
        console.log('endpoint', nsEndpoint);
        joinNamespace(nsEndpoint);
    });

    joinNamespace('/wiki');
});
