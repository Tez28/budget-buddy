// insert variables
// db connection
let db;
// connection to indexed database
const request = indexedDB.open('budget_buddy', 1);

// if the database version changes
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true });
};

// upon a successful
request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
    }
};

request.onerror = function(event) {
    // logs error 
    console.log(event.target.errorCode);
};

// will be executed if we attempt to submit a new transaction and there's no internet connection
function saveRecord(record) {

    // opens a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    self.addEventListener('fetch', function (e) {
        console.log('fetch request : ' + e.request.url);
        e.respondWith(
            caches.match(e.request).then(function (request) {
                if (request) { 
                    console.log('responding with cache : ' + e.request.url);
                    return request
                } else {
                    console.log('file is not cached, fetching : ' + e.request.url);
                    return fetch(e.request)
                }
    
            })
        )
    });
}