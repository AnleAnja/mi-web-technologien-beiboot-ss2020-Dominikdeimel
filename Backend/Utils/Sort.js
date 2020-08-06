const path = require('path');
const fs_extra = require('fs-extra');

module.exports = {
    sortOptions: ['alphabetical','birthTime','random','color'],
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

    sortByColors: async function (imageList){
        return imageList.sort(function (a, b) {
            return a.primaryColorDetails.hue - b.primaryColorDetails.hue;
        });
    }
};









