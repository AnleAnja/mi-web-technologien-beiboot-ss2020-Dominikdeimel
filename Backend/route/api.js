const express = require('express');
const router = express.Router();
const fs_extra = require('fs-extra');
const path = require('path');
const sort = require('../Utils/Sort');


router.get('/images/collection', async function (req, res) {
    const preferredImageCount = req.query.preferredImageCount || 0 ;
    const sortBy = req.query.sortBy;

    if (sortBy === undefined || sortBy === '') {
        res.status(500).send('No sort type given!');
    } else {
        try {
            const sortedImageList = await getSortedImagesList(sortBy);
            const imageCollection = getImageCollection(preferredImageCount, sortedImageList);

            const result = {
                sortBy: sortBy,
                imageCount: imageCollection.length,
                imageCollection: imageCollection
            };

            res.send(result);
        } catch (e) {
            res.status(500).send(e);
        }
    }
});

function getImageCollection(preferredImageCount, sortedImageList) {
    const imageCollection = [];
    if(preferredImageCount < 1 || preferredImageCount > sortedImageList.length) preferredImageCount = sortedImageList.length;

    for(let i = 0; i < preferredImageCount; i++){
        imageCollection.push(sortedImageList[i]);
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
