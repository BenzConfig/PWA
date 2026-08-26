const CACHE_NAME = 'benzconfig-cache-v4';

const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',

    './res/logo.png',
    './res/logo_about.svg',
    './res/logo_main.svg',
    './res/logo_splash.svg',
    './res/logo_tab.svg',

    './res/fonts/Exo2/Exo2.ttf',

    './res/fonts/Bai_Jamjuree/BaiJamjuree-Bold.ttf',
    './res/fonts/Bai_Jamjuree/BaiJamjuree-SemiBold.ttf'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
            .catch(() => {
                return caches.match(event.request)
                    .then(resp => resp || caches.match('/offline.html'));
            })
    );
});
