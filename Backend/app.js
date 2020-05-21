const express = require('express');
const cors = require('cors');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs-extra');
const Vibrant = require('node-vibrant');
const utils = require('./Utils/Utils');
const formData = require('express-form-data');

const app = express();

app.use(cors());
app.use(formData.parse());
app.use(express.static(__dirname + '/'));
let config = {};

app.post('/image', async function (req, res) {
    try {
        const imageId = utils.randomId();
        const imageName = req.files.image.name;
        const imageBuffer = req.files.image.path;

        let response = await getMainImages(imageId,imageName, imageBuffer);

        res.json(response);
    } catch (e) {
        res.status(422).send(e);
    }
});

app.get('/image/main', async function(req, res){
    const imageId = req.query.id;
    try {
        const response = await getMainImages(imageId);
        res.json(response);
    } catch (e) {
        res.status(500).send(e);
    }
});

/***
 * @param {Int} imageId
 * @param {String} imageName
 * @param {imageBuffer} imageBuffer
 * @returns {Promise<{id: *}>}
 */
async function getMainImages(imageId, imageName, imageBuffer){
    const path = `./userData/${imageId}`;
    let response = {
        id: imageId
    };

    if(await fs.pathExists(path)){
        response['original'] = `./userData/${imageId}/original`;
        response['large'] = `./userData/${imageId}/${config.deviceSize.large}`;
        response['medium'] = `./userData/${imageId}/${config.deviceSize.medium}`;
        response['small'] = `./userData/${imageId}/${config.deviceSize.small}`;
        response['square'] = `./userData/${imageId}/square`;
    } else {
        await fs.mkdir(`./userData/${imageId}`);

        response['original'] = await getImagePath(imageId, imageBuffer, 0, false, false);
        response['large'] = await getImagePath(imageId, imageBuffer, config.deviceSize.large, false, false);
        response['medium'] = await getImagePath(imageId, imageBuffer, config.deviceSize.medium, false, false);
        response['small'] = await getImagePath(imageId, imageBuffer, config.deviceSize.small, false, false);
        response['square'] = await getImagePath(imageId, imageBuffer, config.deviceSize.square, true, false);

        await fs.outputJson(`./userData/${imageId}/imageParam.json`, {id: imageId, name: imageName, primaryColors: undefined});
    }
    return response;
}

app.get('/image', async function (req, res) {
    const imageId = req.query.id;
    const greyscale = req.query.grey || false;
    const size = parseInt(req.query.size) || 0;

    try {
        const originalPath = `./userData/${imageId}/original`;
        const result = await getImagePath(imageId, originalPath, size, false, greyscale);
        res.send(result);
    }catch (err) {
        res.status(500).send(err);
    }
});

/***
 * @param {Int} imageId
 * @param {String} originalPath
 * @param {Int} size
 * @param {Boolean} square
 * @param {Boolean} greyscale
 * @returns {Promise<string>}
 */
async function getImagePath(imageId, originalPath,  size, square, greyscale){
    let path = `userData/${imageId}/`;

    if(square) path += `square${greyscale ? '-grey' : ''}`;
    else if (size === 0 || size === undefined && !square) path += `original${greyscale ? '-grey' : ''}`;
    else path += `${size}${greyscale ? '-grey' : ''}`;

    const exists = await fs.pathExists(path);
    if(!exists) {
        const buffer = await scaleImage(imageId, originalPath, path, size, square,greyscale);
        await fs.writeFile(path, buffer);
    }
    return path;
}

/***
 * @param{Int} imageId
 * @param {String} originalPath
 * @param {String} pathToWrite
 * @param {Int} size
 * @param {Boolean}square
 * @param {Boolean} greyscale
 * @returns {Promise<void>}
 */
async function scaleImage (imageId, originalPath, pathToWrite, size, square, greyscale) {
    let buffer;
    if (square) {
        size = config.deviceSize.square;
        buffer = await sharp(originalPath)
            .resize(size, size)
            .sharpen()
            .greyscale(greyscale)
            .toFormat('png', {quality: 100})
            .toBuffer();
    } else if (size === 0 || size === undefined && !square) {
        buffer = await sharp(originalPath)
            .greyscale(greyscale)
            .toFormat('png', {quality: 100})
            .toBuffer();
    } else {
        buffer = await sharp(originalPath)
            .resize(size)
            .sharpen()
            .greyscale(greyscale)
            .toFormat('png', {quality: 100})
            .toBuffer();
    }
    return buffer;
}

app.get('/image/all', async function (req, res) {
    try {
        const directoryList = await fs.readdir('userData');
        let response = {};

        for (const dir of directoryList) {
            const imageParams = JSON.parse(await fs.readFile(`./userData/${dir}/imageParam.json`));
            response[`${dir}`] = {
                id: dir,
                name: imageParams.name,
                path: `userData/${dir}/original`
            };
        }
        res.send(Object.entries(response));

    } catch (e) {
        res.status(500).send(e);
    }
});

app.delete('/image/all', async function (req, res) {
    try {
        await fs.emptyDir('userData');

        res.status(200).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

/***
 * @param {Int} imageId
 * @returns {Promise<[]>}
 */
async function getPrimaryColors (imageId) {
    const imagePath =  `./userData/${imageId}/original`;
    const swatches = await Vibrant.from(imagePath).getSwatches();
    let primaryImageColors = [];

    for (swatch in swatches) {
        primaryImageColors.push({
            name: swatch,
            color: swatches[swatch].getHex(),
            population: swatches[swatch].getPopulation()
        });
    }
    primaryImageColors.sort((a, b) => (b.population - a.population));

    return primaryImageColors;
}

app.get('/image/colors', async function (req, res) {
    const imageId = req.query.id;
    const imageParam = JSON.parse(await fs.readFile(`./userData/${imageId}/imageParam.json`));
    let primaryColors;
    if(imageParam.primaryColors === undefined){
        primaryColors = await getPrimaryColors(imageId);
        await fs.outputJson(`./userData/${imageId}/imageParam.json`, imageParam);
    } else {
        primaryColors = imageParam.primaryColors;
    }
    res.json(primaryColors);
});

app.listen(3000, function () {
    try {
        if (!fs.existsSync('userData')) fs.mkdirSync(path.join(__dirname, 'userData'));
        config = JSON.parse(fs.readFileSync('config.json'));
    } catch (err) {
        console.log(err);
    }

    console.log('Example app listening on port: 3000');
});
