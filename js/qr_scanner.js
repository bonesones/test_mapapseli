(function () {
  'use strict';

  const scanners = new Map();
  const QR_EVENT = 'mapapseli-qr-detected';

  function dispatch(text) {
    if (!text) return;
    window.dispatchEvent(new CustomEvent(QR_EVENT, { detail: String(text) }));
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

  function removeLibraryOverlay(elementId) {
    var container = document.getElementById(elementId);
    if (!container) return;

    var shaded = container.querySelector('#qr-shaded-region');
    if (shaded) shaded.remove();

    var highlight = container.querySelector('#qr-scan-region-highlight');
    if (highlight) highlight.remove();

    var highlightSvg = container.querySelector('#qr-scan-region-highlight-svg');
    if (highlightSvg) highlightSvg.remove();
  }

  async function pickCameraId() {
    var cameras = await Html5Qrcode.getCameras();
    if (!cameras || cameras.length === 0) return null;

    for (var i = 0; i < cameras.length; i++) {
      var label = (cameras[i].label || '').toLowerCase();
      if (
        label.indexOf('back') >= 0 ||
        label.indexOf('rear') >= 0 ||
        label.indexOf('environment') >= 0
      ) {
        return cameras[i].id;
      }
    }

    return cameras[0].id;
  }

  async function startWithCamera(html5QrCode, cameraIdOrConfig) {
    var scanConfig = {
      fps: 15,
      disableFlip: false,
    };

    if (window.Html5QrcodeSupportedFormats) {
      scanConfig.formatsToSupport = [
        Html5QrcodeSupportedFormats.QR_CODE,
      ];
    }

    await html5QrCode.start(
      cameraIdOrConfig,
      scanConfig,
      function (decodedText) {
        dispatch(decodedText);
      },
      function () {},
    );
  }

  window.MapapseliQrScanner = {
    start: async function (elementId) {
      await ensureLibrary();
      if (scanners.has(elementId)) return;

      var container = document.getElementById(elementId);
      if (!container) {
        throw new Error('QR container not found: ' + elementId);
      }

      var html5QrCode = new Html5Qrcode(elementId, { verbose: false });
      scanners.set(elementId, html5QrCode);

      var started = false;
      var cameraId = await pickCameraId();

      if (cameraId) {
        try {
          await startWithCamera(html5QrCode, cameraId);
          started = true;
        } catch (e) {
          console.warn('QR camera id start failed', e);
        }
      }

      if (!started) {
        var fallbacks = [{ facingMode: 'environment' }, { facingMode: 'user' }];
        for (var i = 0; i < fallbacks.length; i++) {
          try {
            await startWithCamera(html5QrCode, fallbacks[i]);
            started = true;
            break;
          } catch (e) {
            console.warn('QR facingMode start failed', fallbacks[i], e);
          }
        }
      }

      if (!started) {
        scanners.delete(elementId);
        throw new Error('Unable to start QR camera');
      }

      removeLibraryOverlay(elementId);
      var overlayTimer = window.setInterval(function () {
        removeLibraryOverlay(elementId);
      }, 300);
      scanners.set(elementId + ':timer', overlayTimer);
    },

    stop: async function (elementId) {
      var timer = scanners.get(elementId + ':timer');
      if (timer) {
        window.clearInterval(timer);
        scanners.delete(elementId + ':timer');
      }

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
