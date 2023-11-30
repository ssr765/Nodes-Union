const id = Math.round(Math.random() * 10000);
const node = document.getElementById('node');
const secondNode = document.querySelector('#second-node');
const union = document.querySelector('.union');
console.info('WINDOW ID: ' + id);
document.title += '#' + id;

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

/**
 * Calculates the hypotenuse.
 * @param {Number} adjacent Adjacent side.
 * @param {Number} opposite Opposite side.
 * @returns The hypotenuse.
 */
function calculateHypotenuse(adjacent, opposite) {
    let hypotenuse = adjacent ** 2 + opposite ** 2;
    return Math.sqrt(hypotenuse);
}

/**
 * Calculates the angle close to the node.
 * @param {Number} opposite Opposite side.
 * @param {Number} hypotenuse Hypotenuse.
 * @returns The angle.
 */
function calculateAngle(opposite, hypotenuse) {
    let angle = opposite / hypotenuse;
    return Math.round(Math.asin(angle) * 100);
}

/**
 * Searches for the coordinates of the node.
 * @returns {Number[]} x, y coordinates of the node.
 */
function nodePosition() {
    return [window.screenX + window.innerWidth / 2, window.screenY + window.innerHeight / 2];
}

let windows = loadStorage();
let counter = 0;
let nodes = 0;

// Window initial data.
const initialData = {'runtime': counter, 'x': 0, 'y': 0, 'winX': 0, 'winY': 0};
localStorage.setItem(`ventana${id}`, JSON.stringify(initialData));

// Get the last runtime of every window. If a window is inactive, lookForDeadWindows function will
// remove the window.
setInterval(() => {
    windows = loadStorage();
}, 50)

// Update window's runtime.
setInterval(() => {
    let coords = nodePosition();
    let x = coords[0];
    let y = coords[1];
    counter++;
    let data = {'runtime': counter, 'x': x, 'y': y, 'winX': window.screenX, 'winY': window.screenY};
    localStorage.setItem(`ventana${id}`, JSON.stringify(data));
}, 5)

// Search for inactive windows.
setInterval(() => {
    lookForDeadWindows();
}, 22)

// Make the union.
draw = setInterval(() => {
    secondNode.style.display = 'block';
    nodes = localStorage.length;
    let node1;
    let node2;

    if (nodes === 2) {
        // Identify the nodes.
        for (const [key, value] of Object.entries(windows)) {
            if (key === `ventana${id}`) {
                node1 = value;
            } else {
                node2 = value;
            }
        }
        
        // Mathematic stuff.
        let [adjacent, opposite] = calculateDistance(node1, node2);
        let hypotenuse = calculateHypotenuse(adjacent, opposite);
        let rotation = calculateAngle(opposite, hypotenuse);
        
        // Info for debugging.
        console.log(node1, node2);
        console.log(adjacent, opposite, hypotenuse, rotation)

        // Draw the union.
        union.style.width = `${Math.round(hypotenuse) * 2}px`;
        union.style.top = `${node1.y - window.screenY}px`;
        if (adjacent < 0) {
            union.style.transform = `rotate(${180 - rotation / 1.75}deg) translateY(50%)`;
            // union.style.left = `${node1.x - window.screenX}px`;
            // union.style.right = 'unset';
        } else {
            union.style.transform = `rotate(${rotation / 1.75}deg) translateY(-50%)`;
            // union.style.right = `${node1.x - window.screenX}px`;
            // union.style.left = 'unset';
        }

        // Draw the other node.
        secondNode.style.top = `${node2.y - node1.winY}px`;
        secondNode.style.left = `${node2.x - node1.winX}px`;
    } else {
        union.style.width = '0px';
        secondNode.style.display = 'none';
    }

}, 50)