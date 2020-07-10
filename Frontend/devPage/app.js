const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const port = 8080;

const app = express();
app.use(cors())

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});
app.get('/collection', async function (req, res) {
    try {
        const result = await axios.get('http://backend:3000/api/images/collection?sortBy=color&imageCount=3&sortOrder=ascending')
        res.send(result.data);
    } catch (e) {
        res.send(e);
    }
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});