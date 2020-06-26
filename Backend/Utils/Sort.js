const path = require('path');
const fs_extra = require('fs-extra');

module.exports = {
    shuffle: function (a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },
    sortByNames: function (objectA, objectB) {
        const nameA = objectA.name.toUpperCase();
        const nameB = objectB.name.toUpperCase();

        let comparison = 0;
        if (nameA > nameB) {
            comparison = 1;
        } else if (nameA < nameB) {
            comparison = -1;
        }
        return comparison;
    },
    sortByBirthName: function (objectA, objectB) {
        const numberA = objectA.imageStats.birthTimeMs;
        const numberB = objectB.imageStats.birthTimeMs;

        return numberA - numberB;
    },
    //adopted by https://jsfiddle.net/shanfan/ojgp5718/
    sortByColors: async function (imageList){
        const paramHexList = imageList.map( it => {
            const primaryColor = it.primaryColors[0].color;
            const colorObj = new Color(primaryColor);
            const changedColor = constructColor(colorObj);

            return {
                id: it.id,
                colorObject: changedColor
            };
        });
        const sortedColorList = sortColorsByHue(paramHexList);
        const result = [];

        for(i = 0; i < sortedColorList.length; i++) {
            const imageParam = JSON.parse(await fs_extra.readFile(path.join(__dirname, `../userData/${sortedColorList[i].id}/imageParam.json`)));
            imageParam.primaryColorDetails = sortedColorList[i].colorObject;
            result.push(imageParam);
        }

        return result;
    }
};

const Color = function Color(hexVal) { //define a Color class for the color objects
    this.hex = hexVal;
};

function constructColor (colorObj){
    var hex = colorObj.hex.substring(1);
    /* Get the RGB values to calculate the Hue. */
    var r = parseInt(hex.substring(0, 2), 16) / 255;
    var g = parseInt(hex.substring(2, 4), 16) / 255;
    var b = parseInt(hex.substring(4, 6), 16) / 255;

    /* Getting the Max and Min values for Chroma. */
    var max = Math.max.apply(Math, [r, g, b]);
    var min = Math.min.apply(Math, [r, g, b]);


    /* Variables for HSV value of hex color. */
    var chr = max - min;
    var hue = 0;
    var val = max;
    var sat = 0;


    if (val > 0) {
        /* Calculate Saturation only if Value isn't 0. */
        sat = chr / val;
        if (sat > 0) {
            if (r === max) {
                hue = 60 * (((g - min) - (b - min)) / chr);
                if (hue < 0) {
                    hue += 360;
                }
            } else if (g === max) {
                hue = 120 + 60 * (((b - min) - (r - min)) / chr);
            } else if (b === max) {
                hue = 240 + 60 * (((r - min) - (g - min)) / chr);
            }
        }
    }
    colorObj.chroma = chr;
    colorObj.hue = hue;
    colorObj.sat = sat;
    colorObj.val = val;
    colorObj.luma = 0.3 * r + 0.59 * g + 0.11 * b;
    colorObj.red = parseInt(hex.substring(0, 2), 16);
    colorObj.green = parseInt(hex.substring(2, 4), 16);
    colorObj.blue = parseInt(hex.substring(4, 6), 16);
    return colorObj;
}

function sortColorsByHue (paramHexList) {
    return paramHexList.sort(function (a, b) {
        return a.colorObject.hue - b.colorObject.hue;
    });
}







