document.addEventListener('DOMContentLoaded', init, false);

/**
 * @var { HTMLCanvasElement }
 */
let canvas;
const fontFamily = 'Barlow';

async function main() {
    canvas = document.getElementById('canvas');
    const metadata = await getRandomImageMeta();
    await renderRandomImage(metadata);
}

function init() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((reg) => {
                console.log('Service worker registered', reg);
            }, (err) => {
                console.error('Service worker not registered', err);
            });
    }
    main();
}

/**
 * @returns {Promise<Object>}
 */
async function getQuote() {
    const request = new Request('http://quotes.rest/qod');
    request.headers.append('Accept', 'application/json');
    return fetch(request)
        .then(response => response.json())
        .then(body => body.contents.quotes[0]);
}

/**
 * @param {Object} quotes
 * @param {Metadata} metadata
 * @returns {void}
 */
function renderQuote(quotes, metadata) {
    let fontSize = 25;
    const ctx = canvas.getContext('2d');
    const quote = formatUsingLinebreaks(quotes.quote, fontSize);
    const textColor = metadata.primaryColorDetails.luma < 0.5 ? '#ffffff' : '#000000';
    let lines = [];
    let width = [];
    for (let i = 0; i < quote.length; i++) {
        const dimensions = calculateTextDimensions(quote[i], fontSize);
        lines.push(dimensions);
    }
    for (let i = 0; i < lines.length; i++) {
        width.push(lines[i].width);
    }
    const excess = Math.max(...width) + 40;
    if (excess > canvas.width) {
        const factor = excess / canvas.width;
        fontSize = fontSize / factor;
        for (let i = 0; i < lines.length; i++) {
            lines[i].height = lines[i].height / factor;
        }
    }
    renderMultilineString(lines, canvas.width / 2, 3 * canvas.height / 4, textColor, fontSize);
    ctx.fillStyle = textColor;
    ctx.font = `15pt ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(quotes.date, canvas.width / 2, canvas.height / 8);
    ctx.font = `18pt ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(quotes.author, canvas.width / 2, 6 * canvas.height / 7);
}

/**
 *
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
 *
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
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i].content, x, y);
        y += lines[i].height + 5;
    }
}

/**
 * @param { String } text
 * @param { Number } fontSize
 * @returns { StringWithDimensions }
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
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.onload = drawImage;
    image.src = metadata.imagePath;

    async function drawImage() {
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        ctx.drawImage(this, 0, 0);
        await renderGradient(await getRandomImageMeta());
    }
}

async function renderGradient(metadata) {
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height / 2);
    gradient.addColorStop(0, metadata.primaryColorDetails.hex.toString());
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height);
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

/**
 * @typedef {Object} StringWithDimensions
 * @property {String} content
 * @property {Number} width
 * @property {Number} height
 */