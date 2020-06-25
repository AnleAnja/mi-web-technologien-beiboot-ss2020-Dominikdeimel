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
    sortByNames: function (objectA, objectB) {
        const nameA = objectA.name.toUpperCase();
        const nameB = objectB.name.toUpperCase();

        let comparison = 0;
        if(nameA > nameB){
            comparison = 1;
        } else if(nameA < nameB){
            comparison = -1;
        }
        return comparison;
    }
};

