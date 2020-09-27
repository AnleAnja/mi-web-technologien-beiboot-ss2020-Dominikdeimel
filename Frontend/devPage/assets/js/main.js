// regeneratorRuntime is needed for webpack, specifically for async / await
import 'regenerator-runtime';

document.addEventListener('DOMContentLoaded', main, false);
window.addEventListener('resize', () => rerenderOnResize().catch(console.error));


let canvas, orientation, metadata, quote, image, containerElement;
const fontFamily = 'Barlow';
let currentDate = new Date().toLocaleString('de-DE', {year: 'numeric', month: 'long', day: 'numeric'});
const renard = [10, 11, 12, 14, 16, 18, 20, 22, 25, 28, 30]; //35, 40, 45, 50, 55, 60, 70, 80, 90, 100];

async function rerenderOnResize() {
    const currentOrientation = getOrientation();

    if (currentOrientation !== orientation) {
        await reloadImage();
    }

    reloadCanvasSize();
    render();
}

function reloadCanvasSize() {
    const containerBox = containerElement.getBoundingClientRect();
    canvas.width = containerBox.width;
    canvas.height = containerBox.height;
}

/**
 * @returns {void}
 */
async function init() {
    containerElement = document.querySelector('.container');
    canvas = document.querySelector('#canvas');
    reloadCanvasSize();
    await reloadImage();

    quote = await getQuote();
    if (quote.author === ('none' || '')) quote.author = 'Unknown';
}

async function reloadImage() {
    orientation = getOrientation();
    metadata = await getRandomImageMeta(orientation);
    image = await fetchImage(metadata);
}

/**
 * @returns {Promise<void>}
 */
async function main() {
    await init();
    render();
}

function render() {
    renderImage(image);
    renderGradient(metadata, orientation);
    renderDate(currentDate, orientation);

    let quoteMeasurements;
    try {
        quoteMeasurements = renderQuote(quote, metadata, orientation);
    } catch (err) {

        try {
            quoteMeasurements = renderQuote(getDefaultQuote(), metadata, orientation);
        } catch (err2) {
            console.log(err2);
            containerElement.classList.add('failure');
            return;
        }
    }

    containerElement.classList.remove('failure');
    renderAuthor(quoteMeasurements);
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

    return getDefaultQuote();
}

function getDefaultQuote() {
    return {
        quote: 'Act as if what you do makes a difference. It does.',
        author: 'William James'
    };
}

function getTextColor() {
    return metadata.primaryColorDetails.luma < 0.5 ? '#ffffff' : '#000000';
}

/**
 * @typedef {Object} QuoteMeasurements
 * @property {number} x
 * @property {number} y
 * @property {number} height
 * @property {number} lineHeight
 * @property {number} fontSize
 */

/**
 * @param {Object} quotes
 * @param {primaryColorData} gradientColor
 * @param {'portrait' | 'landscape' | 'square'} orientation
 * @returns {QuoteMeasurements} Measurements of the rendered quote
 */
function renderQuote(quotes, gradientColor, orientation) {

    const ctx = canvas.getContext('2d');
    const xOffset = 36;
    const yOffset = xOffset;
    const maxLineBreaks = orientation === 'landscape' ? 3 : 4;
    const textColor = getTextColor();

    const x = (orientation === 'landscape' ? (canvas.width / 2) : 0) + xOffset;
    const y = canvas.height / 2 + yOffset;
    const availableWidth = canvas.width - x - xOffset;
    const availableHeight = canvas.height - y - yOffset;

    const formattedText = formatAsMultiline(
        quotes.quote,
        availableWidth,
        availableHeight,
        maxLineBreaks
    );

    ctx.font = `${formattedText.fontSize}pt ${fontFamily} Regular`;
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'alphabetic';

    const drawTextLine = (i, withEndSign = false) => {
        ctx.fillText(
            formattedText.lines[i] + (withEndSign ? ' »' : ''),
            x,
            y + formattedText.lineHeight * i
        );
    };

    ctx.textAlign = 'right';
    ctx.fillText('« ', x, y);
    ctx.textAlign = 'left';
    for (let i = 0; i < formattedText.lines.length - 1; i++) {
        drawTextLine(i);
    }
    drawTextLine(formattedText.lines.length - 1, true);

    return {
        x, y,
        lineHeight: formattedText.lineHeight,
        height: formattedText.lines.length * formattedText.lineHeight,
        fontSize: formattedText.fontSize
    };
}

function findNextLowestRenard(value) {
    if (value < renard[0]) {
        throw new Error();
    }

    for (let i = 1; i < renard.length; i++) {
        if (value <= renard[i]) {
            return renard[i - 1];
        }
    }
}

function renderDate(date, orientation) {
    const ctx = canvas.getContext('2d');

    const textColor = getTextColor();

    ctx.lineWidth = 1;
    ctx.strokeStyle = textColor;
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'middle';
    ctx.font = '14pt Barlow';
    ctx.textAlign = 'left';

    const dateDimensions = calculateTextDimensions(date, 14);

    const y = 36;
    const xMargin = 20;
    let xOffset = 0;

    if (orientation === 'landscape') {
        xOffset = canvas.width / 2;
    }

    const dateStart = (xOffset / 2) + (canvas.width - dateDimensions.width) / 2;
    const dateEnd = (xOffset / 2) + (canvas.width + dateDimensions.width) / 2;


    ctx.beginPath();

    ctx.moveTo(xOffset + xMargin, y);
    ctx.lineTo(dateStart - xMargin, y);

    ctx.moveTo(dateEnd + xMargin, y);
    ctx.lineTo(canvas.width - xMargin, y);

    ctx.closePath();
    ctx.stroke();
    ctx.font = `14pt ${fontFamily} Regular`;
    ctx.fillText(date, dateStart, y);
}

/**
 * @param {QuoteMeasurements} quoteMeasurements
 */
function renderAuthor(quoteMeasurements) {
    const ctx = canvas.getContext('2d');
    const textColor = getTextColor();
    const fontSize = findNextLowestRenard(quoteMeasurements.fontSize - 1);


    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}pt ${fontFamily} Light`;
    ctx.textAlign = 'left';

    ctx.fillText(quote.author, quoteMeasurements.x,
        quoteMeasurements.y + quoteMeasurements.height + quoteMeasurements.lineHeight / 2);
}

/**
 * @typedef {Object} MultilineText
 * @property {string[]} lines
 * @property {number} fontSize
 * @property {number} lineHeight
 */

/**
 * @param {string} text
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @param {number} maxLineBreaks
 * @returns {MultilineText}
 */
function formatAsMultiline(text, maxWidth, maxHeight, maxLineBreaks) {
    const words = text.split(' ');


    let ri = renard.length - 1;
    let fontSize, currentLine, lines, width, lineHeight, spaceWidth;

    const reset = () => {
        if (ri < 0) throw new Error('Impossible to render');

        fontSize = renard[ri];
        currentLine = null;
        lines = [];
        lineHeight = 0;
        width = 0;
        spaceWidth = calculateTextDimensions(' ', fontSize).width;
    };

    reset();

    let retry = true;
    while (retry) {
        retry = false;

        for (let word of words) {
            const dimensions = calculateTextDimensions(word, fontSize);
            lineHeight = Math.max(lineHeight, dimensions.height);

            if (width + dimensions.width > maxWidth) {
                lines.push(currentLine);
                currentLine = null;
                width = 0;

                if (lines.length > maxLineBreaks ||
                    (lineHeight * lines.length + 1) > maxHeight) {
                    ri--;
                    reset();
                    retry = true;
                    break;
                }
            }

            if (currentLine === null) {
                currentLine = word;
                width = dimensions.width;
            } else {
                currentLine += ` ${word}`;
                width += spaceWidth + dimensions.width;
            }
        }
    }

    lines.push(currentLine);
    return {fontSize, lines, lineHeight};
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
    span.style.font = `${fontSize}pt ${fontFamily} Regular`;
    span.style.whiteSpace = 'pre';
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
    const url = new URL('https://beiboot.herokuapp.com/api/images/single');
    url.searchParams.append('format', orientation);
    const response = await fetch(url.toString());
    return response.json();
}

/**
 * @param {HTMLImageElement} image
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
    gradient.addColorStop(1,
        `rgba(${metadata.primaryColorDetails.red}, 
        ${metadata.primaryColorDetails.green}, 
        ${metadata.primaryColorDetails.blue}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
 * @property {Array} hsl
 * @property {Array} rgb
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