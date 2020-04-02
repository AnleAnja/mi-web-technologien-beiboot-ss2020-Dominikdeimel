const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path  = require('path');
const sharp = require('sharp');
const fs = require('fs');

const app = express();
app.use(cors());
app.use("/static", express.static(path.join(__dirname, "static")));

const upload = multer({
    dest: './uploads/'
});

const log = [];

app.post("/images", upload.single("file"), async function (req, res) {

    try {
        await sharp(req.file.path)
            .resize(500)
            .toFile(`./static/${req.file.originalname}`);

        fs.unlink(req.file.path, () => {
            log.push({
                imageId: Math.random() * 100000,
                originalName: req.file.originalname,
                imagePath: `/static/${req.file.originalname}`
            });
            res.json(log[log.length-1]);
        });

    } catch (err) {
        res.status(422).json({ err });
    }
});



app.listen(3000, function(){
    console.log("Example app listening on port: 3000");
});