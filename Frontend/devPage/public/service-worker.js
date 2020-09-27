const CACHE_NAME = 'service-worker-cache';
const landscapeReq = new Request('http://192.168.2.106:3000/api/images/single?format=landscape', { headers: {'Accept': 'application/json'} });
const portraitReq = new Request('http://192.168.2.106:3000/api/images/single?format=portrait', { headers: {'Accept': 'application/json'} });
const quoteReq = new Request('http://quotes.rest/qod', { headers: {'Accept': 'application/json'} });

const toCache = [
    '/',
    '/js/pwa.webmanifest',
    '/js/main.min.js',
    '/css/styles.min.css',
    '/images/splash-screen.png',
    '/images/apple-touch.png',
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

    await cache.add(new Request(`http://192.168.2.106:3000${landscape.imagePath}`));
    await cache.add(new Request(`http://192.168.2.106:3000${portrait.imagePath}`));
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