const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const port = 8080;

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname + '/../public')));

app.get('/', function (req, res) {
    console.log(path.join(__dirname + '/../public'));
    res.sendFile(path.join(__dirname + '/../views/index.html'));
});

app.get('/images/single', async function (req, res) {
    try {
        const result = await axios.get('https://beiboot.herokuapp.com/api/images/single', {params: req.query });
        res.send(result.data);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});