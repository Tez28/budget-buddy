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
                    console.log('file has not been cached, fetching : ' + e.request.url);
                    return fetch(e.request)
                }
    
            })
        )
    });
};

function uploadTransaction() {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_transaction');
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    // open one more transaction
                    const transaction = db.transaction(['new_transaction'], 'readwrite')
                    // accesses the new transaction object
                    const budgetObjectStore = transaction.objectStore('new_transaction');
                    // clears all items in store
                    budgetObjectStore.clear();

                    alert('All saved transactions have been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}