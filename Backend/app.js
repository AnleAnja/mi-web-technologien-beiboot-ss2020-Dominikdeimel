const express = require('express');
const cors = require('cors');
const path = require('path');
const fs_extra = require('fs-extra');
const formData = require('express-form-data');

const apiRouter = require('./route/api');
const imageRouter = require('./route/image');

const app = express();

app.use(cors());
app.use(formData.parse());
app.use(express.static(__dirname + '/'));

app.use('/api', apiRouter);
app.use('/image', imageRouter);

app.listen(3000, function () {
    try {
        if (!fs_extra.existsSync('userData')) fs_extra.mkdirSync(path.join(__dirname, 'userData'));
    } catch (err) {
        console.log(err);
    }
    console.log('Example app listening on port: 3000');
});
