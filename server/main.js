// Init
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
// console.log(moment().format('YYYY MM DD'));
const app = express();
const APP_PORT = process.env.PORT || 3001;

const cartDataArray = [];

// app.use(bodyParser.json({limit: '50mb'}));

// Initialize static content
app.use(express.static(path.join(__dirname, '../', 'dist', 'day14workshop')));

// bodyParser
app.use(bodyParser.json());
// !!! Take out for now
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded());

// CORS
app.use(cors());


app.post('/api/cart', (req,res,next) => {
    const cartData = req.body;
    // Find if username exists in cartDataArray
    const userIndex = cartDataArray.findIndex((value) => value.name === cartData.name);
    // Checks
    if ((cartData.content.length < 1) || (cartData.name === null) || (cartData.name === "")) {
        // If content length is less than 1 or name is empty, return status 409
        res.status(409);
        res.format({
            html: () => { res.send('Cannot save data!') },
            json: () => { res.json({ status: 'Cannot save data!' })}
        })
    } else if (userIndex === -1) {
        // If username does not exist in cartDataArray, add it in as new user
        // Return status 201
        cartData.saved = moment().unix();
        console.log('New entry has been received, and saved at time: ', moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
        cartDataArray.push(cartData);
        res.status(201);
        res.format({
            html: () => { res.send('html, data received and new resource created') },
            json: () => { res.json({ status: 'json, data received and new resource created' })}
        })
    } else {
        // Username exists in cartDataArray, replace entry in array with new updated info
        // Return status 200
        cartData.saved = moment().unix();
        cartDataArray[userIndex] = cartData;
        res.status(200);
        res.format({
            html: () => { res.send('user found in database, entry updated') },
            json: () => { res.json({ status: 'user found in database, entry updated' })}
        })
    }
});

app.get('/api/cart', (req,res,next) => {
    const queryName = req.query.name;
    const userIndex = cartDataArray.findIndex((value) => value.name === queryName);
    // If statement to handle missing username params and username
    if ((userIndex === -1) || (queryName === null)) {
        // If username does not exist, return status 404
        res.status(404);
        res.format({
            html: () => { res.send('Not found!') },
            json: () => { res.json({ status: 'Not found!' })}
        })
    } else {
        // If username exists, return status 201 and username + items
        res.status(201);
        res.format({
            html: () => { res.send('HTML format not supported') },
            json: () => { res.json(cartDataArray[userIndex])}
        })
    }
});

// !!! Rmb to add error.html to dist folder
// Catch-all
app.use((req, res, next) => {
    res.redirect('/error.html');
});

// Logs the port that is used
app.listen(APP_PORT, () => {
    console.info(`Webserver at port ${APP_PORT}`);
});
