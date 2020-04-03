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

const log = [];

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
            .resize(500,500)
            .toFile(`./static/500_${req.file.originalname}`);

        log[log.length-1].scaledImages.push({
            originalName: `500_${req.file.originalname}`,
            imagePath: `/static/500_${req.file.originalname}`});

        //Resize 250x250
        await sharp(req.file.path)
            .resize(250,250)
            .toFile(`./static/250_${req.file.originalname}`);

        log[log.length-1].scaledImages.push({
            originalName: `250_${req.file.originalname}`,
            imagePath: `/static/250_${req.file.originalname}`});

        //Resize 100x100
        await sharp(req.file.path)
            .resize(100,100)
            .toFile(`./static/100_${req.file.originalname}`);

        log[log.length-1].scaledImages.push({
            originalName: `100_${req.file.originalname}`,
            imagePath: `/static/100_${req.file.originalname}`});



        res.json(log[log.length-1]);

        /*fs.unlink(req.file.path, () => {

        });*/

    } catch (err) {
        res.status(422).json({ err });
    }
});

app.post("/preferedSize", async function (req, res) {

try {
    await sharp(req.body.path)
        .resize(req.body.width, req.body.height)
        .toFile(`./static/${req.body.width}${req.body.height}_${req.body.name}`);

    res.json({
        originalName: `${req.body.width}${req.body.height}_${req.body.name}`,
        imagePath: `./static/${req.body.width}${req.body.height}_${req.body.name}`
    })
} catch (err){
    console.log(err);
}
});


app.listen(3000, function(){
    console.log("Example app listening on port: 3000");
});