'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "03f2903ebf269c335739be3f4bdba96e",
"assets/AssetManifest.bin.json": "33f563bae1160e527ee20c42cc9e8c14",
"assets/assets/fonts/Inter-Bold.otf": "d759e235e88e47f838062c7ab97308b1",
"assets/assets/fonts/Inter-Light.otf": "d7019947105844db1899d246172f06b4",
"assets/assets/fonts/Inter-Medium.otf": "ef3d193e6a6ad033724c7872aec1cff7",
"assets/assets/fonts/Inter-Regular.otf": "76e872bc911c3d908aeaf31b2c16bc63",
"assets/assets/fonts/Inter-SemiBold.otf": "ef2dede4404ddb4cb3ed69d196ef2722",
"assets/assets/fonts/Inter-Thin.otf": "72869267880104b27bed47fdf7e5c75d",
"assets/assets/icons/app_icon.png": "eb544bf940ce4b90655e62a601d37b2e",
"assets/assets/icons/arrow-big-up-dash.svg": "dc6875892b1c90618b098ccf9e16b54d",
"assets/assets/icons/arrow-left.svg": "f86e0c8176c2d7f893e8f659c8740500",
"assets/assets/icons/arrow-up.svg": "46a37b6201654859a1d83f844c0843b0",
"assets/assets/icons/bell.svg": "b4c8a7e709be9ae97eba490ec031d0f7",
"assets/assets/icons/check.svg": "a8e6b31f47c27033075feef9e002097d",
"assets/assets/icons/circle-check-big.svg": "87ef69a7ce00c877830333ffdcce40d6",
"assets/assets/icons/clock.svg": "eb2201b50cbd489b0bbcf4aff2079d3e",
"assets/assets/icons/coins.svg": "773d887bdb190dd9240b3267612910c1",
"assets/assets/icons/crown.svg": "482c91576650ae06e779758f62a44b3c",
"assets/assets/icons/gift.svg": "f7fa4fb262e5fb45f6270cdd49adedb0",
"assets/assets/icons/heart.svg": "7ef396701773e4dfb6d2677d974257a9",
"assets/assets/icons/house.svg": "055cf8aa533988c68ba079115717ba7a",
"assets/assets/icons/lock.svg": "7bbb15edd6daea974e9827c048c54337",
"assets/assets/icons/mail.svg": "ebdf427fe8bb657941bf847edf8313ac",
"assets/assets/icons/message-circle.svg": "2e6a233379a9d4ca8b39cd58700e6231",
"assets/assets/icons/phone.svg": "038fda626daac772a6e13d6929ac9058",
"assets/assets/icons/settings.svg": "b5f45b72f36eed06474c60f50c0ca9e7",
"assets/assets/icons/shopping-bag.svg": "6933780cdf75b6d7b8e3b257cf4daa7a",
"assets/assets/icons/tag.svg": "334a000914b56723a5b66d51e41bceea",
"assets/assets/icons/tasks.svg": "6d9a84d63a64d74d38f2fb96a18499ed",
"assets/assets/icons/trash.svg": "3decd32cd9e5e7065418fa5067a947a5",
"assets/assets/icons/trending-down.svg": "735e26384e84f5d700e4be45154752f3",
"assets/assets/icons/trending-up.svg": "48caefbd245cfdab422e48765778163f",
"assets/assets/icons/upload.svg": "7544ebc2852a7222f5688057d9bd9e1d",
"assets/assets/icons/user.svg": "ee529daf93fb96b79ac78c714556ee6e",
"assets/assets/icons/users.svg": "f93859e6d477561edb9dad5b3ffc2512",
"assets/assets/icons/x.svg": "b9f91041c6f90847a3f746b8d7f2c5da",
"assets/FontManifest.json": "131503634fb0233bfb7384a4e1eba1a0",
"assets/fonts/MaterialIcons-Regular.otf": "7b5edb3224f411cb97b9e20a3c841fd9",
"assets/NOTICES": "0cdbf1c73db5a85f5a17613e14ef7a41",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/shaders/stretch_effect.frag": "40d68efbbf360632f614c731219e95f0",
"canvaskit/canvaskit.js": "8331fe38e66b3a898c4f37648aaf7ee2",
"canvaskit/canvaskit.js.symbols": "a3c9f77715b642d0437d9c275caba91e",
"canvaskit/canvaskit.wasm": "9b6a7830bf26959b200594729d73538e",
"canvaskit/chromium/canvaskit.js": "a80c765aaa8af8645c9fb1aae53f9abf",
"canvaskit/chromium/canvaskit.js.symbols": "e2d09f0e434bc118bf67dae526737d07",
"canvaskit/chromium/canvaskit.wasm": "a726e3f75a84fcdf495a15817c63a35d",
"canvaskit/skwasm.js": "8060d46e9a4901ca9991edd3a26be4f0",
"canvaskit/skwasm.js.symbols": "3a4aadf4e8141f284bd524976b1d6bdc",
"canvaskit/skwasm.wasm": "7e5f3afdd3b0747a1fd4517cea239898",
"canvaskit/skwasm_heavy.js": "740d43a6b8240ef9e23eed8c48840da4",
"canvaskit/skwasm_heavy.js.symbols": "0755b4fb399918388d71b59ad390b055",
"canvaskit/skwasm_heavy.wasm": "b0be7910760d205ea4e011458df6ee01",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "24bc71911b75b5f8135c949e27a2984e",
"flutter_bootstrap.js": "7982d07a3942b26f3138dd030e9e6f96",
"icons/Icon-192.png": "d4fa37259012e46babde64d31e9a3b29",
"icons/Icon-512.png": "eb544bf940ce4b90655e62a601d37b2e",
"index.html": "816a298dd5ca0dbefe79699312c0af81",
"/": "816a298dd5ca0dbefe79699312c0af81",
"main.dart.js": "f0a48fa74588bdc0951f8b4b8ae287aa",
"manifest.json": "d584483c76e66b8efbfb3e2f52744d76",
"version.json": "8242d4ad5074ad0d35494de9e84c34ad"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
