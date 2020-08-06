const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const fs = require('fs').promises;
const fs_extra = require('fs-extra');
const sizeOf = require('image-size');
const path = require('path');
const Vibrant = require('node-vibrant');
const utils = require('../Utils/Utils');

const config = JSON.parse(fs_extra.readFileSync('config.json'));
const backendUrl = 'http//:localhost:3000';


router.post('/', async function (req, res) {
    try {
        const imageId = utils.randomId();
        const imageName = req.files.image.name;
        const imageBuffer = req.files.image.path;

        let response = await getMainImages(imageId, imageName, imageBuffer);

        res.json(response);
    } catch (e) {
        res.status(422).send(e);
    }
});

router.get('/main', async function (req, res) {
    const imageId = req.query.id;
    try {
        const response = await getMainImages(imageId);
        res.json(response);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/', async function (req, res) {
    const imageId = req.query.id;
    const greyscale = req.query.grey || false;
    const size = parseInt(req.query.size) || 0;

    try {
        const originalPath = path.join(__dirname,`../userData/${imageId}/original`);
        const result = await getImagePath(imageId, originalPath, size, false, greyscale);
        res.send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/all', async function (req, res) {
    try {
        const directoryList = await fs_extra.readdir(path.join(__dirname, '../userData'));
        let response = {};

        for (const dir of directoryList) {
            const imageParams = JSON.parse(await fs_extra.readFile(path.join(__dirname, `../userData/${dir}/imageParam.json`)));
            response[`${dir}`] = {
                id: dir,
                name: imageParams.name,
                path: `userData/${dir}/original`
            };
        }
        res.send(Object.entries(response));

    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.delete('/all', async function (req, res) {
    try {
        await fs_extra.emptyDir(path.join(__dirname, '../userData'));

        res.status(200).send();
    } catch (err) {
        res.status(500).send(err);
    }
});


router.get('/colors', async function (req, res) {
    const imageId = req.query.id;
    const imageParam = JSON.parse(await fs_extra.readFile(path.join(__dirname, `../userData/${imageId}/imageParam.json`)));

    res.json(imageParam.primaryColors);
});

function getImageDimensions(imagePath){
    try {
        const dimensions = sizeOf(path.join(__dirname, imagePath));
        let format;

        if (dimensions.height > dimensions.width) {
            format = 'portait';
        } else if (dimensions.height < dimensions.width) {
            format = 'landscape';
        } else format = 'square';

        dimensions['format'] = format;

        return dimensions;
    } catch (e) {
        console.log(e);
    }
}

/***
 * @param {Int} imageId
 * @param {String} imageName
 * @param {imageBuffer} imageBuffer
 * @returns {Promise<{id: *}>}
 */
async function getMainImages(imageId, imageName, imageBuffer) {
    const imagePath = `../userData/${imageId}`;
    let response = {
        id: imageId
    };

    if (await fs_extra.pathExists(path.join(__dirname, imagePath))) {
        response['original'] = `./userData/${imageId}/original`;
        response['large'] = `./userData/${imageId}/${config.deviceSize.large}`;
        response['medium'] = `./userData/${imageId}/${config.deviceSize.medium}`;
        response['small'] = `./userData/${imageId}/${config.deviceSize.small}`;
        response['square'] = `./userData/${imageId}/square`;
    } else {
        await fs_extra.mkdir(path.join(__dirname, imagePath));

        response['original'] = await getImagePath(imageId, imageBuffer, 0, false, false);
        response['large'] = await getImagePath(imageId, imageBuffer, config.deviceSize.large, false, false);
        response['medium'] = await getImagePath(imageId, imageBuffer, config.deviceSize.medium, false, false);
        response['small'] = await getImagePath(imageId, imageBuffer, config.deviceSize.small, false, false);
        response['square'] = await getImagePath(imageId, imageBuffer, config.deviceSize.square, true, false);

        await fs_extra.outputJson(path.join(__dirname, `../userData/${imageId}/imageParam.json`), {
            id: imageId,
            name: imageName,
            imagePath: `${backendUrl}/userData/${imageId}/original`,
            imageDimensions: getImageDimensions(`../userData/${imageId}/original`),
            imageStats: await getImageStats(imageId),
            primaryColors: await getPrimaryColors(imageId)
        });
    }
    return response;
}

/***
 * @param {Int} imageId
 * @param {String} originalPath
 * @param {Int} size
 * @param {Boolean} square
 * @param {Boolean} greyscale
 * @returns {Promise<string>}
 */
async function getImagePath(imageId, originalPath, size, square, greyscale) {
    let imagePath = `../userData/${imageId}/`;

    if (square) imagePath += `square${greyscale ? '-grey' : ''}`;
    else if (size === 0 || size === undefined && !square) imagePath += `original${greyscale ? '-grey' : ''}`;
    else imagePath += `${size}${greyscale ? '-grey' : ''}`;

    const exists = await fs_extra.pathExists(path.join(__dirname, imagePath));
    if (!exists) {
        const buffer = await scaleImage(imageId, originalPath, size, square, greyscale);
        await fs_extra.writeFile(path.join(__dirname, imagePath), buffer);
    }
    return imagePath;
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
async function scaleImage(imageId, originalPath, size, square, greyscale) {
    let buffer;
    try {
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
    } catch (e) {
        console.log(e);
    }
    return buffer;
}

async function getImageStats(imageId) {
    try {
        const buffer = await fs.open(path.join(__dirname, `../userData/${imageId}/original`), 'r');
        const bufferStats = await buffer.stat();
        await buffer.close();

        const imageStats = {
            birthTime: bufferStats.birthtime,
            birthTimeMs: bufferStats.birthtimeMs,
            size: bufferStats.size
        };
        return imageStats;
    } catch (e) {
        console.log(e);
    }
}

/***
 * @param {Int} imageId
 * @returns {Promise<[]>}
 */
async function getPrimaryColors(imageId) {
    try {
        const imagePath = path.join(__dirname,`../userData/${imageId}/original`);
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
    } catch (e) {
        console.log(e);
    }



}

module.exports = router;
