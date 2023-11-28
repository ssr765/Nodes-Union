const id = Math.round(Math.random() * 10000);
const node = document.getElementById('node');
const union = document.querySelector('.union');
console.info('WINDOW ID: ' + id);

// Check if localStorage available.
if (typeof(Storage) === 'undefined') {
    console.error("❌ No LocalStorage");
}

/**
 * Gets the windows from localStorage.
 * @returns {object} An object with all the windows objects.
 */
function loadStorage() {
    let windows = {};

    for (var i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let item = localStorage.getItem(localStorage.key(i));

        if (key.startsWith('ventana')) {
            windows[key] = JSON.parse(item);
        }
    }

    return windows;
}

/**
 * Checks if there are some inactive windows.
 */
function lookForDeadWindows() {
    for (var i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let item = localStorage.getItem(localStorage.key(i));

        if (key.startsWith('ventana')) {
            let ventana = JSON.parse(item);
            // Delete if window's runtime is no longer being updated.
            if (windows[key] !== undefined && windows[key].runtime === ventana.runtime) {
                console.warn('[!] Removing inactive window: ' + key);
                localStorage.removeItem(key);
            }
        }
    }
}

/**
 * Calculates the distance between nodes.
 * @param {object} n1 This window node.
 * @param {object} n2 Second window node.
 * @returns {Number[]} The horizontal and vertical distance.
 */
function calculateDistance(n1, n2) {
    return [n1.x - n2.x, n1.y - n2.y];
}

function calculateHipotenusa(adjacent, opposite) {
    let hipotenusa = adjacent ** 2 + opposite ** 2;
    return Math.sqrt(hipotenusa);
}

function calculateAngle(opposite, hipotenusa) {
    let angle = opposite / hipotenusa;
    return Math.round(Math.asin(angle) * 100);
}

let windows = loadStorage();
let counter = 0;
let nodes = 0;

// Window initial data.
const initialData = {'runtime': counter, 'x': 0, 'y': 0};
localStorage.setItem(`ventana${id}`, JSON.stringify(initialData));

/**
 * Searches for the coordinates of the node.
 * @returns {Number[]} x, y coordinates of the node.
 */
function nodePosition() {
    return [window.screenX + window.innerWidth / 2, window.screenY + window.innerHeight / 2];
}

// Get the last runtime of every window. If a window is inactive, lookForDeadWindows function will
// remove the window.
setInterval(() => {
    windows = loadStorage();
}, 1000)

// Update window's runtime.
setInterval(() => {
    let coords = nodePosition();
    let x = coords[0];
    let y = coords[1];
    counter++;
    let data = {'runtime': counter, 'x': x, 'y': y};
    localStorage.setItem(`ventana${id}`, JSON.stringify(data));
}, 100)

// Search for inactive windows.
setInterval(() => {
    lookForDeadWindows();
}, 499)

// Make the union.
setInterval(() => {
    nodes = localStorage.length;
    let node1;
    let node2;

    if (nodes === 2) {
        
        for (const [key, value] of Object.entries(windows)) {
            if (key === `ventana${id}`) {
                node1 = value;
            } else {
                node2 = value;
            }
        }
        console.log(node1, node2);
        let [adjacent, opposite] = calculateDistance(node1, node2);
        let hipotenusa = calculateHipotenusa(adjacent, opposite);
        let rotation = calculateAngle(opposite, hipotenusa);

        console.log('top: ' + (node1.y - window.screenY));
        console.log('left: ' + (node1.x - window.screenX));
        union.style.width = `${Math.round(hipotenusa)}px`;
        union.style.top = `${node1.y - window.screenY}px`;
        union.style.left = `${node2.x - window.screenX}px`;
        union.style.transform = `rotate(${rotation}deg)`

    }

}, 50)