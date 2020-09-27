const CACHE_NAME = 'service-worker-cache';
const landscapeReq = new Request('https://beiboot.herokuapp.com/api/images/single?format=landscape', { headers: {'Accept': 'application/json'} });
const portraitReq = new Request('https://beiboot.herokuapp.com/api/images/single?format=portrait', { headers: {'Accept': 'application/json'} });
const quoteReq = new Request('https://quotes.rest/qod', { headers: {'Accept': 'application/json'} });

const toCache = [
    '/',
    '/js/pwa.webmanifest',
    '/js/main.min.js',
    '/css/styles.min.css',
    '/images/apple-touch.png',
    '/images/android-chrome-192x192.png',
    '/images/android-chrome-512x512.png',
    '/images/favicon.ico',
    '/images/favicon-16x16.png',
    '/images/favicon-32x32.png',
    '/font/Barlow-Light.ttf',
    '/font/Barlow-Regular.ttf',
    landscapeReq,
    portraitReq,
];

async function getImages(cache) {
    try {
        await cache.add(quoteReq);
    } catch (e) {
        await cache.put(quoteReq, new Response(null));
    }

    await cache.addAll(toCache);

    const landscape = await (await cache.match(landscapeReq)).json();
    const portrait = await (await cache.match(portraitReq)).json();

    await cache.add(new Request(landscape.imagePath));
    await cache.add(new Request(portrait.imagePath));
}

self.addEventListener('install', function (event) {
    if (navigator.onLine) {
        event.waitUntil(
            caches.delete(CACHE_NAME)
                .then(() => caches.open(CACHE_NAME))
                .then(cache => getImages(cache))
                .then(self.skipWaiting())
        );
    }
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request)
            .then(async response => {
                const cache = await caches.open(CACHE_NAME);
                await cache.delete(event.request);
                await cache.put(event.request, response);
                return cache.match(event.request);
            })
            .catch(() => caches.open(CACHE_NAME)
                .then((cache) => cache.match(event.request))
            )
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
            .then((keyList) => {
                return Promise.all(keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[ServiceWorker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
            .then(() => self.clients.claim())
    );
});

setInterval(async () => {
    console.log('update cache');
    await caches.delete(CACHE_NAME);
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(toCache);
    await getImages(cache);
}, 1000 * 60 * 60 * 24);