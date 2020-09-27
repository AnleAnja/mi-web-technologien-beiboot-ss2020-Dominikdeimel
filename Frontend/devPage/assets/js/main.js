// regeneratorRuntime is needed for webpack, specifically for async / await
import 'regenerator-runtime';

document.addEventListener('DOMContentLoaded', main, false);
window.addEventListener('resize', () => rerenderOnResize().catch(console.error));


let canvas, orientation, metadata, quote, image, containerElement;
const fontFamily = 'Barlow Regular';
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

    let quoteFontSize;
    try {
        quoteFontSize = renderQuote(quote, metadata, orientation);
        containerElement.classList.remove('failure');
    } catch (err) {
        console.error(err);
        containerElement.classList.add('failure');
        return;
    }

    renderDate(currentDate, orientation);
    renderAuthor(quoteFontSize - 2);
}

/**
 *
 * @returns {Promise<Image>}
 */
function fetchImage(metadata) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = done;
        image.src = `http://192.168.2.106:3000${metadata.imagePath}`; //TODO

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
 * @param {Object} quotes
 * @param {primaryColorData} gradientColor
 * @param {'portrait' | 'landscape' | 'square'} orientation
 * @returns {number} the fontsize used to render the quote
 */
function renderQuote(quotes, gradientColor, orientation) {

    const ctx = canvas.getContext('2d');
    const xOffset = 36;
    const yOffset = xOffset;
    const maxLineBreaks = orientation === 'landscape' ? 3 : 4;
    const textColor = getTextColor();
    let fontSize = renard[renard.length - 1];

    const lines = formatUsingLinebreaks(quotes.quote, fontSize, maxLineBreaks);

    const textContainer = {};
    textContainer.x = (orientation === 'landscape' ? (canvas.width / 2) : 0) + xOffset;
    textContainer.y = canvas.height / 2 + yOffset;

    const availableWidth = canvas.width - textContainer.x - xOffset;
    const availableHeight = canvas.height - textContainer.y - yOffset;

    populateTextContainerMeasurements(textContainer, lines, fontSize);

    let scale = 1;
    if (textContainer.height > availableHeight) {
        scale = availableHeight / textContainer.height;
    }

    if (textContainer.width * scale > availableWidth) {
        scale = availableWidth / textContainer.width;
    }

    if (scale !== 1) {
        fontSize *= scale;
        populateTextContainerMeasurements(textContainer, lines, fontSize);
    }

    try {
        fontSize = findNextLowestRenard(fontSize);
    } catch (err) {
        quote = getDefaultQuote();
        fontSize = findNextLowestRenard(fontSize);
    }

    ctx.font = `${fontSize}pt Barlow Regular`;
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'alphabetic';

    const drawTextLine = (i, withEndSign = false) => {
        ctx.fillText(
            lines[i] + (withEndSign ? ' »' : ''),
            textContainer.x,
            textContainer.y + textContainer.lineHeight * i
        );
    };

    ctx.textAlign = 'right';
    ctx.fillText('« ', textContainer.x, textContainer.y);
    ctx.textAlign = 'left';
    for (let i = 0; i < lines.length - 1; i++) {
        drawTextLine(i);
    }
    drawTextLine(lines.length - 1, true);

    return fontSize;

    /*const textContainerWidth = orientation === 'landscape' ? canvas.width / 2 : canvas.width;
    let fontSize = 25;
    const quoteLines = formatUsingLinebreaks(quotes.quote, fontSize, 3, );
    const textColor = gradientColor.hsl[2] < 0.5 ? '#ffffff' : '#000000';
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
    renderString(currentDate, dateX, dateY, textColor, 15);
    renderString(quotes.author, authorX, authorY, textColor, 18);*/
}

function populateTextContainerMeasurements(textContainer, lines, fontSize) {
    let linesWithDimensions = lines.map(l => calculateTextDimensions(l, fontSize));

    let lineWidth = 0;
    let lineHeight = 0;
    for (let line of linesWithDimensions) {
        lineHeight = Math.max(lineHeight, line.height);
        lineWidth = Math.max(lineWidth, line.width);
    }

    textContainer.height = lineHeight * lines.length;
    textContainer.width = lineWidth;

    textContainer.lineHeight = lineHeight;
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

    ctx.lineWidth = '1px';
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
    ctx.font = `14pt ${fontFamily}`;
    ctx.fillText(date, dateStart, y);
}

/**
 * @param {String} text
 * @param {Number} x
 * @param {Number} y
 * @param {String} color
 * @param {Number} size
 */
function renderAuthor(targetFontSize) {
    const ctx = canvas.getContext('2d');
    const textColor = getTextColor();
    if (quote.author === ('none' || '')) quote.author = 'Unknown';
    ctx.fillStyle = textColor;
    let fontSize = findNextLowestRenard(targetFontSize);
    ctx.font = `${fontSize}pt ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(quote.author, canvas.width * 0.75, canvas.height * 0.85);
}

/**
 * @param { String } quote
 * @param { Number } fontSize
 * @returns { String[] }
 */
function formatUsingLinebreaks(quote, fontSize, maxLineBreaks) {
    const ctx = canvas.getContext('2d');
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

/*function renderMultilineString(lines, x, y, textColor, fontSize) {
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
 */

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
    const url = new URL('http://192.168.2.106:3000/api/images/single');
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
    gradient.addColorStop(1,
        `rgba(${metadata.primaryColorDetails.red}, 
        ${metadata.primaryColorDetails.green}, 
        ${metadata.primaryColorDetails.blue}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    /*const ctx = canvas.getContext('2d');
    const gradientColor = pickGradientColor(metadata.primaryColors);
    const gradient = orientation === 'landscape' ?
        ctx.createLinearGradient(canvas.width, 0, canvas.width / 2, 0) :
        ctx.createLinearGradient(0, canvas.height, 0, canvas.height / 2);

    gradient.addColorStop(0, gradientColor.color);
    gradient.addColorStop(
        0.3,
        `rgba(${gradientColor.rgb[0]}, 
        ${gradientColor.rgb[1]}, 
        ${gradientColor.rgb[2]}, 
        0.8)`);
    gradient.addColorStop(
        1,
        `rgba(${gradientColor.rgb[0]}, 
        ${gradientColor.rgb[1]}, 
        ${gradientColor.rgb[2]}, 
        0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    renderQuoteWithAuthor(quote, gradientColor, orientation);*/
}

/*
function pickGradientColor(primaryColors){
    let result = '';
    let difference = 0;

    for(let i = 1; i < primaryColors.length; i++){
        let currentDifference = 0;
        if(primaryColors[0].hsl[2] < primaryColors[i].hsl[2]){
            currentDifference = primaryColors[i].hsl[2] - primaryColors[0].hsl[2];
        } else {
            currentDifference = primaryColors[0].hsl[2] - primaryColors[i].hsl[2];
        }

        if(difference < currentDifference){
            difference = currentDifference;
            result = primaryColors[i];
        }
    }

    return result;
}
 */

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