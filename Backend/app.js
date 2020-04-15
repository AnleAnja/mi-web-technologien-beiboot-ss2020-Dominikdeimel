import {Swatch} from "node-vibrant";

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const Vibrant = require('node-vibrant')
const utils = require('./Utils/Utils');


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/static", express.static(path.join(__dirname, "static")));

const upload = multer({
    dest: './uploads/'
});

let config = {};
let log = {};

async function getPrimaryColors(imagePath) {
    const palette = await Vibrant.from(imagePath).getPalette()
    console.log(palette);
    //const test = new Swatch([ 117, 123, 125 ],5)
    return palette;

}

app.post("/image", upload.single("file"), async function (req, res) {
    try {
        const imageId = utils.randomId();
        const imageName = req.file.originalName;
        const imagePath = req.file.path;

        const imageColors = getPrimaryColors(imagePath);

        await fs.mkdir(`./static/${imageId}`, err => {
            if (err) console.log(err);
        });

        await scaleImage(imageId, imagePath, 0, false);
        await scaleImage(imageId, imagePath, config.deviceSize.large, false);
        await scaleImage(imageId, imagePath, config.deviceSize.medium, false);
        await scaleImage(imageId, imagePath, config.deviceSize.small, false);
        await scaleImage(imageId, imagePath, config.deviceSize.square, true);

        log[imageId] = {
            imageId: imageId,
            originalName: imageName,
            originalPath: imagePath,
            imagePath: `./static/${imageId}/original.png`,
            scaledImages: [{
                scaleFactor: config.deviceSize.large,
                imagePath: `./static/${imageId}/${config.deviceSize.large}.png`
            },
                {
                    scaleFactor: config.deviceSize.medium,
                    imagePath: `./static/${imageId}/${config.deviceSize.medium}.png`
                },
                {
                    scaleFactor: config.deviceSize.small,
                    imagePath: `./static/${imageId}/${config.deviceSize.small}.png`
                },
                {
                    scaleFactor: config.deviceSize.square,
                    imagePath: `./static/${imageId}/${config.deviceSize.square}_square.png`
                }
            ]
        };

        res.json(log[imageId]);
        saveJson();

    } catch (err) {
        res.status(422).json({err});
    }
});

app.get("/image/all", function (req, res) {
    res.send(Object.entries(log));
});

app.get("/image", async function (req, res) {

    const imageId = req.query.id;
    const imagePath = req.query.path;
    let userWidth;
    try {
        userWidth = parseInt(req.query.width);

        if (isNaN(userWidth) || userWidth === 0) {
            res.status(400).send('Invalid width input');
            return;
        }
        await scaleImage(imageId, imagePath, userWidth, false);

        const result = {
            scaleFactor: `${userWidth}`,
            imagePath: `./static/${imageId}/${userWidth}.png`
        }
        log[imageId].scaledImages.push(result)
        res.json(result)
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete("/image/all", async function (req, res) {
    try {
        //delete imageLog.json
        if (fs.existsSync('imageLog.json')) await fs.unlink(path.join('', 'imageLog.json'), err => {
            if (err) throw err;
        });
        //reset Log
        log = {};
        //Empty static and uploads
        await fs.emptyDirSync('static');
        await fs.emptyDirSync('uploads');


        res.status(200).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

async function scaleImage(imageId, imagePath, width, isSquare) {
    if (isSquare) {
        await sharp(imagePath)
            .resize(800, 800)
            .sharpen()
            .toFile(`./static/${imageId}/${width}_square.png`)

    } else if (width === 0 && !isSquare) {
        await sharp(imagePath)
            .sharpen()
            .toFile(`./static/${imageId}/original.png`);
    } else {
        await sharp(imagePath)
            .resize(width)
            .sharpen()
            .toFile(`./static/${imageId}/${width}.png`)
    }
}

function saveJson() {
    const data = JSON.stringify(log);
    fs.writeFileSync('imageLog.json', data);
}

function readJson() {
    const rawdata = fs.readFileSync('imageLog.json');
    log = JSON.parse(rawdata);
}

app.listen(3000, function () {
    try {
        if (fs.existsSync('imageLog.json')) readJson();
        if (!fs.existsSync('static')) fs.mkdirSync(path.join(__dirname, "static"));
        config = JSON.parse(fs.readFileSync('config.json'));
    } catch (err) {
        console.log(err);
    }

    console.log("Example app listening on port: 3000");
});