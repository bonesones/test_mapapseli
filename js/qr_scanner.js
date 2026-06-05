(function () {
  'use strict';

  const scanners = new Map();
  const QR_EVENT = 'mapapseli-qr-detected';

  function dispatch(text) {
    window.dispatchEvent(new CustomEvent(QR_EVENT, { detail: text }));
  }

  async function ensureLibrary() {
    if (window.Html5Qrcode) return;
    await new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
      script.crossOrigin = 'anonymous';
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error('Failed to load html5-qrcode'));
      };
      document.head.appendChild(script);
    });
  }

  window.MapapseliQrScanner = {
    start: async function (elementId) {
      await ensureLibrary();
      if (scanners.has(elementId)) return;

      var container = document.getElementById(elementId);
      if (!container) {
        throw new Error('QR container not found: ' + elementId);
      }

      var html5QrCode = new Html5Qrcode(elementId);
      scanners.set(elementId, html5QrCode);

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: function (viewfinderWidth, viewfinderHeight) {
            var minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            var size = Math.floor(minEdge * 0.72);
            return { width: size, height: size };
          },
          aspectRatio: 1.0,
          disableFlip: false,
        },
        function (decodedText) {
          dispatch(decodedText);
        },
        function () {},
      );
    },

    stop: async function (elementId) {
      var scanner = scanners.get(elementId);
      if (!scanner) return;
      scanners.delete(elementId);
      try {
        await scanner.stop();
        scanner.clear();
      } catch (e) {}
    },
  };
})();
