
const CACHE_NAME = 'ark-dossier-cache-v1';

const IMAGE_URLS = [
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Giga',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Rex',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Spino',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Yuty',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Allo',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Carno',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Dire+Bear',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Megalosaurus',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Thylacoleo',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Daeodon',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Bronto',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Chalico',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Diplo',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Mammoth',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Rhino',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Paracer',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Stego',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Theri',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Trike',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Titanosaur',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Megatherium',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Kentro',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Achatina',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Ankylo',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Beaver',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Doedic',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Equus',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Bigfoot',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Moschops',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Phiomia',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Argy',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Archa',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Ptera',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Quetzal',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Griffin',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Tapejara',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Pelagornis',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Baryonyx',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Direwolf',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Galli',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Iguanodon',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Kapro',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Megaloceros',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Pachyrhino',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Purlovia',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Parasaur',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Raptor',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Sabertooth',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Terror+Bird',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Hyaenodon',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Araneo',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Arthro',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Beelzebufo',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Dimetrodon',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Leech',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Onyc',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Scorpion',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Sarco',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Titanoboa',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Megalania',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Compy',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Dilo',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Dimorph',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Dodo',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Kairuku',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Lystro',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Meso',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Microraptor',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Otter',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Oviraptor',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Pachy',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Pego',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Ant',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Troodon',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Ichthyornis',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Mosa',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Plesio',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Ichthy',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Megalodon',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Dunkle',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Angler',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Basilo',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Turtle',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Coelacanth',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Tuso',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Diplocaulus',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Cnidaria',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Eel',
    'https://placehold.co/400x400/111317/e0e1e6.png?text=Manta',
    'https://placehold.co/800x800/2a2f38/e0e1e6.png?text=The+Island'
];

const APP_SHELL_URLS = [
    '/',
    '/index.html',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap',
];

const URLS_TO_CACHE = [...APP_SHELL_URLS, ...IMAGE_URLS];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                const promises = URLS_TO_CACHE.map(url => {
                    return cache.add(url).catch(err => {
                        console.warn(`Failed to cache ${url}:`, err);
                    });
                });
                return Promise.all(promises);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then(
                    (response) => {
                        if (!response || response.status !== 200) {
                            return response;
                        }
                        
                        // We don't cache API calls to Gemini
                        if(event.request.url.includes('generativelanguage.googleapis.com')) {
                           return response;
                        }

                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    }
                ).catch(() => {
                    // If fetch fails, and it's a navigation request, return a fallback page
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
