// regeneratorRuntime is needed for webpack, specifically for async / await
import 'regenerator-runtime';

document.addEventListener('DOMContentLoaded', main, false);
window.addEventListener('resize', () => rerenderOnResize().catch(console.error));


let canvas, orientation, metadata, quote, image;
const fontFamily = 'Barlow';

async function rerenderOnResize() {
    const currentOrientation = getOrientation();

    if (currentOrientation !== orientation) {
        await reloadImage();
    }

    reloadCanvasSize();
    render();
}

function reloadCanvasSize() {
    const containerBox = document.querySelector('.container').getBoundingClientRect();
    canvas.width = containerBox.width;
    canvas.height = containerBox.height;
}

/**
 * @returns {void}
 */
async function init() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((reg) => {
                console.log('Service worker registered', reg);
            }, (err) => {
                console.error('Service worker not registered', err);
            });
    }

    canvas = document.querySelector('#canvas');
    reloadCanvasSize();
    await reloadImage();

    quote = await getQuote();
}

async function reloadImage() {
    orientation = getOrientation();
    metadata = await getRandomImageMeta(orientation);
    image = await fetchImage(metadata);
}

/**
 * @returns {Promise<void>}
 * */
async function main() {
    await init();
    render();
}

function render() {
    renderImage(image);
    renderGradient(metadata, orientation);
    renderQuoteWithAuthor(quote, metadata, orientation);
}

/**
 *
 * @returns {Promise<Image>}
 */
function fetchImage(metadata) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = done;
        image.src = metadata.imagePath;

        function done() {
            resolve(this);
        }
    });
}

/**
 * @returns {string}
 */
function getOrientation() {
    if (window.innerHeight > window.innerWidth) {
        return 'portrait';
    } else if (window.innerWidth > window.innerHeight) {
        return 'landscape';
    } else
        return 'square';
}

/**
 * @returns {Promise<Object>}
 */
async function getQuote() {
    const request = new Request('http://quotes.rest/qod');
    request.headers.append('Accept', 'application/json');
    const response = await fetch(request);
    if (response.status === 200) {
        const body = await response.json();
        if (body.contents.quotes[0].quote.length <= 250) {
            return body.contents.quotes[0];
        }
    }
    return {
        quote: 'Act as if what you do makes a difference. It does.',
        author: 'William James',
        date: getDate(),
    };
}

/**
 * @returns {string}
 */
function getDate() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}

/**
 * @param {Object} quotes
 * @param {Metadata} metadata
 * @param {'portrait' | 'landscape' | 'square'} orientation
 * @returns {void}
 */
function renderQuoteWithAuthor(quotes, metadata, orientation) {

    const textContainerWidth = orientation === 'landscape' ? canvas.width / 2 : canvas.width;
    let fontSize = 25;
    const quoteLines = formatUsingLinebreaks(quotes.quote, fontSize);
    const textColor = metadata.primaryColorDetails.luma < 0.5 ? '#ffffff' : '#000000';
    const lines = quoteLines.map(ql => calculateTextDimensions(ql, fontSize));
    const widestLine = Math.max(...lines.map(l => l.width)) + 40;
    if (widestLine > textContainerWidth) {
        fontSize /= widestLine / textContainerWidth;
    }

    let quoteX, quoteY, dateX, dateY, authorX, authorY;

    switch (orientation) {
    case 'landscape':
        quoteX = 0.75;
        quoteY = 0.5;

        dateX = 0.75;
        dateY = 0.15;

        authorX = 0.75;
        authorY = 0.85;
        break;
    case 'portrait':
        quoteX = 0.5;
        quoteY = 0.75;

        dateX = 0.5;
        dateY = 0.15;

        authorX = 0.5;
        authorY = 0.85;
        break;
    }

    renderMultilineString(lines, quoteX, quoteY, textColor, fontSize);
    renderString(quotes.date, dateX, dateY, textColor, 15);
    renderString(quotes.author, authorX, authorY, textColor, 18);
}

/**
 * @param {String} text
 * @param {Number} x
 * @param {Number} y
 * @param {String} color
 * @param {Number} size
 */
function renderString(text, x, y, color, size) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.font = `${size}pt ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width * x, canvas.height * y);
}

/**
 * @param { String } quote
 * @param { Number } fontSize
 * @returns { String[] }
 */
function formatUsingLinebreaks(quote, fontSize) {
    const ctx = canvas.getContext('2d');
    const maxLineBreaks = 2;
    const lines = [];
    ctx.font = `${fontSize}pt ${fontFamily}`;
    const metrics = ctx.measureText(quote);

    for (let lineBreak = maxLineBreaks; lineBreak > 0; lineBreak--) {
        // check if the current amount of linebreaks is justified
        if (metrics.width >= canvas.width * lineBreak) {
            // get how many characters are supposed to be in a line
            const charCount = quote.length / (lineBreak + 1);
            let lastIndex = 0;
            for (let i = 0; i < lineBreak; i++) {
                // for each target linebreak, replace the closest space with a linebreak
                const spaceIndex = findClosestSpace(quote, charCount * (i + 1));
                lines.push(quote.substring(lastIndex, spaceIndex));
                lastIndex = spaceIndex + 1;
            }
            lines.push(quote.substring(lastIndex));
            // end of function, the quite has been partitioned
            return lines;
        }
    }

    // if the quote needed no change, it is returned as-is
    return [quote];
}

/**
 *
 * @param { String } text
 * @param { Number } position
 * @returns { Number }
 * */
function findClosestSpace(text, position) {
    const right = text.indexOf(' ', position);
    const left = text.lastIndexOf(' ', position);
    if (left === -1 || right - position < position - left) {
        return right;
    } else {
        return left;
    }
}

/**
 * @param { StringWithDimensions[] } lines
 * @param { Number } x
 * @param { Number } y
 * @param { String } textColor
 * @param { Number } fontSize
 */
function renderMultilineString(lines, x, y, textColor, fontSize) {
    const ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}pt ${fontFamily}`;

    const xAbsolute = canvas.width * x;
    let yAbsolute = canvas.height * y;

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i].content, xAbsolute, yAbsolute);
        yAbsolute += lines[i].height + 5;
    }
}

/**
 * Checks how much space would be occupied when rendering the given text using the given font size
 *
 * @param { String } text The text that should be rendered
 * @param { Number } fontSize The font size that should be used for rendering
 * @returns { StringWithDimensions } The given text along with it's width and height
 */
function calculateTextDimensions(text, fontSize) {
    const span = document.createElement('span');
    span.innerText = text;
    span.style.font = `${fontSize}pt ${fontFamily}`;
    span.style.whiteSpace = 'nowrap';
    document.body.append(span);
    const dimensions = span.getBoundingClientRect();
    document.body.removeChild(span);
    return {content: text, width: dimensions.width, height: dimensions.height};
}

/**
 * @param {'portrait' | 'landscape' | 'square'} orientation
 * @returns {Promise<Metadata>}
 */
async function getRandomImageMeta(orientation) {
    const url = new URL('http://localhost:3000/api/images/single');
    url.searchParams.append('format', orientation);
    const response = await fetch(url.toString());
    return response.json();
}

/**
 * @param {Image} metadata
 */
function renderImage(image) {
    const ctx = canvas.getContext('2d');
    const scale = Math.max(
        canvas.height / image.height,
        canvas.width / image.width
    );

    ctx.drawImage(image, 0, 0, image.width * scale, image.height * scale);
}

/**
 *
 * @param {Metadata} metadata
 * @param {'portrait' | 'landscape' | 'square'} orientation
 */
function renderGradient(metadata, orientation) {
    const ctx = canvas.getContext('2d');

    const gradient = orientation === 'landscape' ?
        ctx.createLinearGradient(canvas.width, 0, canvas.width / 2, 0) :
        ctx.createLinearGradient(0, canvas.height, 0, canvas.height / 2);

    gradient.addColorStop(0, metadata.primaryColorDetails.hex.toString());
    gradient.addColorStop(1, `rgba(${metadata.primaryColorDetails.red}, ${metadata.primaryColorDetails.green}, ${metadata.primaryColorDetails.blue}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * @returns {void}
 */
function renderOffline() {
    canvas = document.getElementById('canvas');
    const image = new Image;
    const ctx = canvas.getContext('2d');

    image.src = '/images/offlineImg.jpg';
    image.onload = drawImage;

    async function drawImage() {
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        ctx.drawImage(this, 0, 0);
    }
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

/**
 * @typedef {Object} StringWithDimensions
 * @property {String} content
 * @property {Number} width
 * @property {Number} height
 */