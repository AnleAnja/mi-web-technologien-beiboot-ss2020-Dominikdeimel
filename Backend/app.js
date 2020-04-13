const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const utils = require('./Utils/Utils');


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/static", express.static(path.join(__dirname, "static")));

const upload = multer({
    dest: './uploads/'
});

let log = {};

app.post("/image", upload.single("file"), async function (req, res) {
    try {
        const imageId = utils.randomId();

        await fs.mkdir(`./static/${imageId}`, err => {
            if (err) console.log(err);
        });

        await sharp(req.file.path).toFile(`./static/${imageId}/original.png`);

        log[imageId] = {
            imageId: imageId,
            originalName: req.file.originalname,
            originalPath: req.file.path,
            imagePath: `./static/${imageId}/original.png`,
            scaledImages: []
        };


        //Resize 800x800
        await sharp(req.file.path)
            .resize(800)
            .toFile(`./static/${imageId}/800.png`);

        log[imageId].scaledImages.push({
            scaleFactor: "800",
            imagePath: `./static/${imageId}/800.png`
        });

        //Resize 500x500
        await sharp(req.file.path)
            .resize(500)
            .toFile(`./static/${imageId}/500.png`);

        log[imageId].scaledImages.push({
            scaleFactor: "500",
            imagePath: `./static/${imageId}/500.png`
        });

        //Resize 300x300
        await sharp(req.file.path)
            .resize(300)
            .toFile(`./static/${imageId}/300.png`);

        log[imageId].scaledImages.push({
            scaleFactor: "300",
            imagePath: `./static/${imageId}/300.png`
        });

        //Square
        await sharp(req.file.path)
            .resize(800, 800)
            .toFile(`./static/${imageId}/square.png`);

        log[imageId].scaledImages.push({
            scaleFactor: "800",
            imagePath: `./static/${imageId}/square.png`
        });

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

        if(isNaN(userWidth) || userWidth === 0){
            res.status(400).send('Invalid width input');
            return;
        }
        await sharp(imagePath)
            .resize(userWidth)
            .toFile(`./static/${imageId}/${userWidth}.png`);

        res.json({
            scaleFactor: `${userWidth}`,
            imagePath: `./static/${imageId}/${userWidth}.png`
        })
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete("/reset", async function (req, res) {
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

function saveJson() {
    let data = JSON.stringify(log);
    fs.writeFileSync('imageLog.json', data);
}

function readJson() {
    let rawdata = fs.readFileSync('imageLog.json');
    log = JSON.parse(rawdata);
}

app.listen(3000, function () {
    try {
        if (fs.existsSync('imageLog.json')) readJson();
        if (!fs.existsSync('static')) fs.mkdirSync(path.join(__dirname, "static"));
    } catch (err) {
        console.log(err);
    }

    console.log("Example app listening on port: 3000");
});