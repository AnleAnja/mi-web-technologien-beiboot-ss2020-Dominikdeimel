/**
 * @returns {Promise<String>}
 */
async function getQuote() {
    const request = new Request('http://quotes.rest/qod');
    request.headers.append('Accept', 'application/json');
    return fetch(request)
        .then(response => response.json())
        .then(body => body.contents.quotes[0].quote);
}

/**
 * @param {String} quote
 * @returns {void}
 */
function renderQuote(quote) {
    document.getElementById('quote').innerText = quote;
}

/**
 * @param {'portrait' | 'landscape' | 'square'} [orientation='portrait']
 * @returns {Promise<Metadata>}
 */
async function getRandomImageMeta(orientation = 'portrait') {
    const url = new URL('/image/single');
    url.searchParams.append('format', orientation);
    return fetch(url.toString())
        .then(response => response.json());
}

/**
 * @param {Metadata} metadata
 */
function renderRandomImage(metadata) {
    const img = document.createElement('img');
    img.setAttribute('class', 'img')
    img.src = metadata.imagePath;
    document.getElementById('content').append(img);
}

/**
 *
 * @returns {Promise<void>}
 */
async function renderGradient(metadata) {
    const div = document.createElement('div');
    div.setAttribute('class', 'gradient');
    metadata.primaryColorDetails.hex;
}

async function main() {
    const metadata = await getRandomImageMeta();
    renderQuote(await getQuote());
    renderRandomImage(metadata);
    renderGradient(metadata);
}

main();

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