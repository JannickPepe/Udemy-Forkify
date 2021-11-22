import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';


const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
};

export const AJAX = async function(url, uploadData = undefined) {
    try {
    const fetchPro = uploadData ? fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
    }) 
    : fetch(url);

        // Have 2 promises
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
    
        // make a window error if the fetch API is wrong
        // make the throw error into catch from models.js
        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data; // return data from this function
    }   catch (err) {
        throw err;
    }
};



/* // non refactor way
// async function that will do the fetching
export const getJSON = async function(url) {
    // eventhough there will be an error the promise of getJSON will still be forfilled and the error handling goes to model.
    try {
        const fetchPro = fetch(url);
        // Have 2 promises
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
    
        // make a window error if the fetch API is wrong
        // make the throw error into catch from models.js
        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data; // return data from this function
    }   catch (err) {
        throw err;
    }
};


export const sendJSON = async function(url, uploadData) {
    try {
        const fetchPro = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
        });

        // Have 2 promises
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
    
        // make a window error if the fetch API is wrong
        // make the throw error into catch from models.js
        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data; // return data from this function
    }   catch (err) {
        throw err;
    }
};
*/