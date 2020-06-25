module.exports = {
    randomId: function () {
        const idLength = 10;
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < idLength; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },
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
    }
};

