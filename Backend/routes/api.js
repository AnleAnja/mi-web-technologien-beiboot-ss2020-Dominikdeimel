const express = require('express');
const router = express.Router();
const fs_extra = require('fs-extra');
const path = require('path');
const sort = require('../Utils/Sort');

router.get('/images/single', async function (req, res) {
    const format = req.query.format || 'portrait';
    const imageListInFormat = await getImageListInFormat(format);
    const randomImage = imageListInFormat[Math.floor(Math.random()*imageListInFormat.length)];

    res.status(200).send(randomImage);
});

router.get('/images/collection', async function (req, res) {
    const sortOrder = req.query.sortOrder || 'ascending';
    const sortBy = req.query.sortBy || 'alphabetical';
    let preferredImageCount = req.query.preferredImageCount || 0 ;
    let from = req.query.from || 0;

    if (!sort.sortOptions.includes(sortBy)) {
        res.status(500).send('Invalid sort type given!');
    } else {
        try {
            const sortedImageList = await getSortedImagesList(sortBy);

            if(sortOrder === 'descending') sortedImageList.reverse();
            if(preferredImageCount < 1 || preferredImageCount > sortedImageList.length) preferredImageCount = sortedImageList.length;
            if(from > sortedImageList.length) from = 0;

            const imageCollection = getImageCollection(preferredImageCount, from,  sortedImageList);

            const result = {
                sortBy: sortBy,
                sortOrder: sortOrder,
                imageCount: imageCollection.length,
                from: from,
                imageCollection: imageCollection
            };

            res.send(result);
        } catch (e) {
            res.status(500).send(e);
        }
    }
});

async function getImageListInFormat(format){
    const directoryList = await fs_extra.readdir(path.join(__dirname, '../userData'));
    let imageList = [];

    for (let i = 0; i < directoryList.length; i++) {
        const imageParam = JSON.parse(await fs_extra.readFile(path.join(__dirname, `../userData/${directoryList[i]}/imageParam.json`)));
        if(imageParam.imageDimensions.format === format){
            imageList.push(imageParam);
        }
    }
    return imageList;
}

function getImageCollection(preferredImageCount, from, sortedImageList) {
    const imageCollection = [];
    let i = from;

    while(imageCollection.length < preferredImageCount){
        imageCollection.push(sortedImageList[i]);
        i++;
    }

    return imageCollection;
}

async function getSortedImagesList(sortBy) {
    try {
        const directoryList = await fs_extra.readdir(path.join(__dirname, '../userData'));
        let imageList = [];

        for (let i = 0; i < directoryList.length; i++) {
            const imageParam = JSON.parse(await fs_extra.readFile(path.join(__dirname, `../userData/${directoryList[i]}/imageParam.json`)));
            imageList.push(imageParam);
        }
        switch(sortBy){
        case 'alphabetical' : imageList.sort(sort.sortByNames); break;
        case 'birthTime'  : imageList.sort(sort.sortByBirthName); break;
        case 'random'     : imageList = sort.shuffle(imageList); break;
        case 'color'      : imageList = sort.sortByColors(imageList); break;
        }

        return imageList;

    } catch (e) {
        console.log(e);
    }
}
module.exports = router;
