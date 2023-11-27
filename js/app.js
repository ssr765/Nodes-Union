const id = Math.round(Math.random() * 10000);
const node = document.getElementById('node');

if (typeof(Storage) === 'undefined') {
    console.log("❌ No LocalStorage");
}

localStorage.setItem(`ventana${id}`, true)

function loadkeys() {
    for (var i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let item = localStorage.getItem(localStorage.key(i));
        if (key.startsWith('ventana')) {
            console.log(key + ' - ' + item);
        }
    }
}

loadkeys();