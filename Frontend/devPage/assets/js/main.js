/**
 * @returns {Promise<String>}
 */
function getQuote() {
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
 * @returns {Promise<String>}
 */
function loadRandomImageMeta(orientation = 'portrait') {
    const request = new Request('/image/single');
    request.query.append('format', orientation);
    return fetch(request)
        .then(response => response.json());
}