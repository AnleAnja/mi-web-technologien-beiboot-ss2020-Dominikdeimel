async function main() {
    const metadata = await getRandomImageMeta();
    await renderRandomImage(metadata);
}

main();

/**
 * @returns {Promise<String>}
 */
async function getQuote() {
    const request = new Request('http://quotes.rest/qod');
    request.headers.append('Accept', 'application/json');
    return fetch(request)
        .then(response => response.json())
        .then(body => body.contents.quotes[0]);
}

/**
 * @param {String} quotes
 * @returns {void}
 */
function renderQuote(quotes, metadata) {
    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.font = '25pt Barlow';
    if (metadata.primaryColorDetails.luma < 50) {
        ctx.fillStyle = '#ffffff';
    } else {
        ctx.fillStyle = '#000000';
    }
    ctx.textAlign = 'center';
    ctx.fillText(quotes.quote, canvas.width/2, 3 * canvas.height/4);
    ctx.font = '18pt Barlow';
    ctx.textAlign = 'center';
    ctx.fillText(quotes.date, canvas.width/2, canvas.height/8);
    ctx.font = '20pt Barlow';
    ctx.textAlign = 'center';
    ctx.fillText(quotes.author, canvas.width/2, 6 * canvas.height / 7);
}

/**
 * @param {'portrait' | 'landscape' | 'square'} [orientation='portrait']
 * @returns {Promise<Metadata>}
 */
async function getRandomImageMeta(orientation = 'portrait') {
    const url = new URL('http://localhost:3000/api/images/single');
    url.searchParams.append('format', orientation);
    return fetch(url.toString())
        .then(response => response.json());
}

/**
 * @param {Metadata} metadata
 */
async function renderRandomImage(metadata) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.onload = drawImage;
    image.src = metadata.imagePath;

    async function drawImage() {
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        ctx.drawImage(this, 0, 0);
        renderGradient(await getRandomImageMeta());
    }
}

async function renderGradient(metadata) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height/2);
    gradient.addColorStop(0, metadata.primaryColorDetails.hex.toString());
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height);
    renderQuote(await getQuote(), metadata);
}

/**
 * @typedef {Object} Metadata
 * @property {String} id
 * @property {String} name
 * @property {String} imagePath
 * @property {imageDimensions} imageDimensions
 * @property {imageStats} imageStats
 * @property {Array<primaryColorData>} primaryColors
 * @property {primaryColorDetails} primaryColorDetails
 */

/**
 * @typedef {Object} imageDimensions
 * @property {number} height
 * @property {number} width
 * @property {String} type
 * @property {String} format
 */

/**
 * @typedef {Object} imageStats
 * @property {String} birthTime
 * @property {number} birthTimeMs
 * @property {number} size
 */

/**
 * @typedef {Object} primaryColorData
 * @property {String} name
 * @property {String} color
 * @property {number} population
 */

/**
 * @typedef {Object} primaryColorDetails
 * @property {String} hex
 * @property {number} chroma
 * @property {number} hue
 * @property {number} sat
 * @property {number} val
 * @property {number} luma
 * @property {number} red
 * @property {number} green
 * @property {number} blue
 */