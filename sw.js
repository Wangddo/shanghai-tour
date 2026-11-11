// Shanghai Tour 통합 Service Worker (토·일 공용)
// scope: sw.js가 놓인 폴더 (배포 경로에 무관)
const CACHE_VERSION = 'shanghai-tour-v8';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './course/',
  './course/index.html',
  './course/sat.html',
  './course/sun.html',
  './course/shared-ticket.js',
  './course/sat/stops-data.js',
  './course/sun/stops-data.js',
  // 정거장 사진 — 현지 회선이 느려도 뜨도록 설치 시점에 미리 받아 둔다
  './course/sat/images/01-hotel-century-avenue.jpg',
  './course/sat/images/lujiazui-binjiang.jpg',
  './course/sat/images/02-nanjing-road.jpg',
  './course/sat/images/05-bund-promenade.jpg',
  './course/sat/images/07-grandmother.jpg',
  './course/sat/images/08-huxinting.jpg',
  './course/sat/images/09-yu-garden.jpg',
  './course/sat/images/11-provisional-government.jpg',
  './course/sat/images/13-xintiandi.jpg',
  './course/sat/images/15-tianzifang.jpg',
  './course/sat/images/16-longtimeago.jpg',
  './course/sat/images/17-wukang-mansion.jpg',
  './course/sat/images/19-bund-night.jpg',
  './course/sun/images/01-century-avenue.jpg',
  './course/sun/images/03-oriental-pearl.jpg',
  './course/sun/images/04-dimsum.jpg',
  './course/sun/images/07-shanghai-tower.jpg',
  './course/sun/images/08-hongqiao-t1.jpg',
  './navi/assets/css/navi.css',
  './navi/assets/js/navi-core.js',
  './navi/assets/js/v3-flex.js',
  './navi/assets/icons/icon-192.png',
  './navi/assets/icons/icon-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js',
];

self.addEventListener('install', (event) => {
  // cache: 'reload' — 브라우저 HTTP 캐시(GitHub Pages는 max-age=600)를 건너뛰고 서버에서 새로 받는다.
  // 이게 없으면 버전을 올려도 새 캐시가 10분 전의 옛 파일로 채워질 수 있다.
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.all(CORE_ASSETS.map((url) => cache.add(new Request(url, { cache: 'reload' })).catch(() => null)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.includes('google.com') || url.hostname.includes('googleapis.com')) return;
  if (url.hostname.includes('tile.openstreetmap')) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION + '-tiles').then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match('./course/')))
    );
    return;
  }
  // 사진·아이콘은 캐시 우선(용량 크고 거의 안 바뀜).
  // 페이지·데이터·코드는 네트워크 우선 — 온라인이면 항상 최신 일정을 받고, 오프라인일 때만 저장본을 쓴다.
  const isAsset = /\.(jpe?g|png|webp|svg)$/i.test(url.pathname);
  const save = (res) => {
    if (res.ok && (res.type === 'basic' || res.type === 'cors')) {
      const copy = res.clone();
      caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
    }
    return res;
  };
  if (isAsset) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then(save)).catch(() => caches.match('./course/'))
    );
    return;
  }
  event.respondWith(
    fetch(req, { cache: 'no-cache' }).then(save)
      .catch(() => caches.match(req).then((cached) => cached || caches.match('./course/')))
  );
});
