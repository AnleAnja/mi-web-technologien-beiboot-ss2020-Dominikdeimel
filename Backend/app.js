const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path  = require('path');
const sharp = require('sharp');
const fs = require('fs');
const bodyParser = require('body-parser');


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/static", express.static(path.join(__dirname, "static")));

const upload = multer({
    dest: './uploads/'
});

let log = [];

app.post("/images", upload.single("file"), async function (req, res) {
    try {
        await sharp(req.file.path).toFile(`./static/${req.file.originalname}`);

        log.push({
            originalName: req.file.originalname,
            originalPath: req.file.path,
            imagePath: `/static/${req.file.originalname}`,
            scaledImages: []
        });

        //Resize 500x500
        await sharp(req.file.path)
            .resize(500)
            .toFile(`./static/500_${req.file.originalname}`);

        log[log.length-1].scaledImages.push({
            originalName: `500_${req.file.originalname}`,
            scaleFactor: "500",
            imagePath: `/static/500_${req.file.originalname}`});

        //Resize 250x250
        await sharp(req.file.path)
            .resize(250)
            .toFile(`./static/250_${req.file.originalname}`);

        log[log.length-1].scaledImages.push({
            originalName: `250_${req.file.originalname}`,
            scaleFactor: "250",
            imagePath: `/static/250_${req.file.originalname}`});

        //Resize 100x100
        await sharp(req.file.path)
            .resize(100)
            .toFile(`./static/100_${req.file.originalname}`);

        log[log.length-1].scaledImages.push({
            originalName: `100_${req.file.originalname}`,
            scaleFactor: "100",
            imagePath: `/static/100_${req.file.originalname}`});

        res.json(log[log.length-1]);
        saveJson();

    } catch (err) {
        res.status(422).json({ err });
    }
});

app.post("/preferedSize", async function (req, res) {

try {
    await sharp(req.body.path)
        .resize(req.body.width)
        .toFile(`./static/${req.body.width}_${req.body.name}`);

    res.json({
        originalName: `${req.body.width}_${req.body.name}`,
        imagePath: `./static/${req.body.width}_${req.body.name}`
    })
} catch (err){
    console.log(err);
}
});

app.get("/allImages", function (req, res) {
    const temp = [];
    log.forEach(it => {
        temp.push( {
            "originalName": it.originalName,
                "imagePath": it.imagePath
        });
    });
    res.json(temp);
});

app.delete("/reset", function (req, res){
        //delete static
        fs.readdir('static', (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join('static', file), err => {
                    if (err) throw err;
                });
            }
        });
        //delete uploads
        fs.readdir('uploads', (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join('uploads', file), err => {
                    if (err) throw err;
                });
            }
        });
        //delete imageLog.json
        fs.unlink(path.join('', 'imageLog.json'), err => {
            if (err) throw err;
        });
        //reset Log
        log = [];

    res.status(200).send();
});

function saveJson(){
    let data = JSON.stringify(log);
    fs.writeFileSync('imageLog.json', data);
}
function readJson(){
    let rawdata = fs.readFileSync('imageLog.json');
    log = JSON.parse(rawdata);

}


app.listen(3000, function(){
    try {
        if (fs.existsSync('imageLog.json')) readJson();
    } catch (err){
        console.log(err);
    }

    console.log("Example app listening on port: 3000");
});