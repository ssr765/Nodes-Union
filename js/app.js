const id = Math.round(Math.random() * 10000);
const node = document.getElementById('node');
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

let windows = loadStorage();
let counter = 0;

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