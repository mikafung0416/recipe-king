const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// let ejs = require('ejs');

app.set('view engine', 'ejs');


app.listen(4000, () => {
    console.log('listening to 4000');
})
