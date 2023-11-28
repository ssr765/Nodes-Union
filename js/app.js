const id = Math.round(Math.random() * 10000);
const node = document.getElementById('node');
let counter = 0;

if (typeof(Storage) === 'undefined') {
    console.log("❌ No LocalStorage");
}

const initialData = {'runtime': counter, 'x': 0, 'y': 0};
localStorage.setItem(`ventana${id}`, JSON.stringify(initialData));


/**
 * Searches for the coordinates of the node.
 * @returns {Number[]} x, y coordinates of the node.
 */
function nodePosition() {
    return [window.screenX + window.innerWidth / 2, window.screenY + window.innerHeight / 2];
}


setInterval(() => {
    let coords = nodePosition();
    let x = coords[0];
    let y = coords[1];
    counter++;
    let data = {'runtime': counter, 'x': x, 'y': y};
    localStorage.setItem(`ventana${id}`, JSON.stringify(data));
}, 100)