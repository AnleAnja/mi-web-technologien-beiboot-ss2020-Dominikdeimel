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

let config = {};


async function getPrimaryColors (imagePath) {
    return await Vibrant.from(imagePath).getSwatches();
}

app.get('/image/colors', async function (req, res) {
    const imagePath = req.query.path;
    const imageId = req.query.id;
    let imageColors = [];

    if (log[imageId].colorPalette.length > 0) {
        imageColors = log[imageId].colorPalette;
    } else {
        const swatches = await getPrimaryColors(imagePath);

        for (swatch in swatches) {
            imageColors.push({
                name: swatch,
                color: swatches[swatch].getHex(),
                population: swatches[swatch].getPopulation()
            });
        }
        imageColors.sort((a, b) => (b.population - a.population));
        log[imageId].colorPalette = imageColors;
    }
    res.json(imageColors);
});
//, upload.single('file')
app.post('/image', async function (req, res) {
    try {
        const imageId = utils.randomId();
        const imageName = req.files.file.originalFileName;
        const imageBuffer = req.files.file.path;
        let response = {
            id: imageId
        };
        await fs.mkdir(`./userData/${imageId}`);

        response['original'] = await getImagePath(imageId, imageBuffer, 0, false, false);
        response['large'] = await getImagePath(imageId, imageBuffer, config.deviceSize.large, false, false);
        response['medium'] = await getImagePath(imageId, imageBuffer, config.deviceSize.medium, false, false);
        response['small'] = await getImagePath(imageId, imageBuffer, config.deviceSize.small, false, false);
        response['square'] = await getImagePath(imageId, imageBuffer, config.deviceSize.square, true, false);

        await fs.outputJson(`./userData/${imageId}/imageParams.json`, {name: imageName});

        res.json(response);
    } catch (err) {
        res.status(422).json({ err });
    }
});

app.get('/image/all', function (req, res) {
    res.send(Object.entries(log));
});

app.get('/image', async function (req, res) {
    const imageId = req.query.id;
    const greyscale = req.query.grey;
    const square = req.query.square;
    const size = req.query.size;

    try {
        const originalPath = `/userData/${imageId}/original.png`;
        const result = await getImagePath(imageId, originalPath, size, square, greyscale);
        res.send(result);
    }catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/image/all', async function (req, res) {
    try {
    // delete imageLog.json
        if (fs.existsSync('/userData/imageLog.json')) {
            await fs.unlink(path.join('', '/userData/imageLog.json'), err => {
                if (err) throw err;
            });
        }
        // reset Log
        log = {};
        // Empty static and uploads
        await fs.emptyDirSync('userData/static');
        await fs.emptyDirSync('userData/uploads');

        res.status(200).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

/***
 *
 * @param {Int} imageId
 * @param {String} originalPath
 * @param {Int} size
 * @param {Boolean} square
 * @param {Boolean} greyscale
 * @returns {Promise<string>}
 */
async function getImagePath(imageId, originalPath,  size, square, greyscale){
    let path = `userData/${imageId}/`;

    if(square) path += `square${greyscale ? '-grey' : ''}.png`;
    else if (size === 0 && !square) path += `original${greyscale ? '-grey' : ''}.png`;
    else path += `${size}${greyscale ? '-grey' : ''}.png`;

    const exists = await fs.pathExists(path);
    if(!exists) {
        await scaleImage(imageId, originalPath, path, size, square,greyscale);
    }
    return path;
}
/***
 *
 * @param{Int} imageId
 * @param {String} originalPath
 * @param {String} pathToWrite
 * @param {Int} size
 * @param {Boolean}square
 * @param {Boolean} greyscale
 * @returns {Promise<void>}
 */
async function scaleImage (imageId, originalPath, pathToWrite, size, square, greyscale) {
    if (square) {
        size = config.deviceSize.square;
        await sharp(originalPath)
            .resize(size, size)
            .sharpen()
            .greyscale(greyscale)
            .toFile(pathToWrite);
    } else if (size === 0 && !square) {
        await sharp(originalPath)
            .greyscale(greyscale)
            .toFile(pathToWrite);
    } else {
        await sharp(originalPath)
            .resize(size)
            .sharpen()
            .greyscale(greyscale)
            .toFile(pathToWrite);
    }
}
app.listen(3000, function () {
    try {
        if (!fs.existsSync('userData')) fs.mkdirSync(path.join(__dirname, 'userData'));
        config = JSON.parse(fs.readFileSync('config.json'));
    } catch (err) {
        console.log(err);
    }

    console.log('Example app listening on port: 3000');
});
