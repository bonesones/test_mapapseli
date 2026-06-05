(function () {
  "use strict";

  var scanners = new Map();
  var timers = new Map();
  var observers = new Map();
  var QR_EVENT = "mapapseli-qr-detected";

  function dispatch(text) {
    if (!text) return;
    window.dispatchEvent(new CustomEvent(QR_EVENT, { detail: String(text) }));
  }

  async function ensureLibrary() {
    if (window.Html5Qrcode) return;
    await new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js";
      script.crossOrigin = "anonymous";
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error("Failed to load html5-qrcode"));
      };
      document.head.appendChild(script);
    });
  }

  function removeLibraryOverlay(elementId) {
    var container = document.getElementById(elementId);
    if (!container) return;

    var selectors = [
      "#qr-shaded-region",
      "#qr-scan-region-highlight",
      "#qr-scan-region-highlight-svg",
      '[id^="qr-shaded-region"]',
    ];

    for (var i = 0; i < selectors.length; i++) {
      var nodes = container.querySelectorAll(selectors[i]);
      for (var j = 0; j < nodes.length; j++) {
        nodes[j].remove();
      }
    }
  }

  function forceStopMediaTracks(elementId) {
    var container = document.getElementById(elementId);
    if (!container) return;

    var videos = container.querySelectorAll("video");
    for (var i = 0; i < videos.length; i++) {
      var stream = videos[i].srcObject;
      if (!stream) continue;
      var tracks = stream.getTracks();
      for (var j = 0; j < tracks.length; j++) {
        try {
          tracks[j].stop();
        } catch (e) {}
      }
      videos[i].srcObject = null;
    }
  }

  function cleanupElement(elementId) {
    var timer = timers.get(elementId);
    if (timer) {
      window.clearInterval(timer);
      timers.delete(elementId);
    }

    var observer = observers.get(elementId);
    if (observer) {
      observer.disconnect();
      observers.delete(elementId);
    }
  }

  async function stopScanner(elementId) {
    cleanupElement(elementId);
    removeLibraryOverlay(elementId);

    var scanner = scanners.get(elementId);
    if (!scanner) {
      forceStopMediaTracks(elementId);
      return;
    }

    scanners.delete(elementId);

    try {
      var state = scanner.getState();
      if (
        window.Html5QrcodeScannerState &&
        (state === Html5QrcodeScannerState.SCANNING ||
          state === Html5QrcodeScannerState.PAUSED)
      ) {
        await scanner.stop();
      }
    } catch (e) {}

    try {
      scanner.clear();
    } catch (e) {}

    forceStopMediaTracks(elementId);
  }

  async function stopAll() {
    var ids = Array.from(scanners.keys());
    for (var i = 0; i < ids.length; i++) {
      await stopScanner(ids[i]);
    }
  }

  async function warmUpEnvironmentCamera() {
    try {
      var stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      stream.getTracks().forEach(function (track) {
        track.stop();
      });
    } catch (e) {}
  }

  async function pickBackCameraId() {
    var cameras = await Html5Qrcode.getCameras();
    if (!cameras || cameras.length === 0) return null;

    for (var i = 0; i < cameras.length; i++) {
      var label = (cameras[i].label || "").toLowerCase();
      if (
        label.indexOf("back") >= 0 ||
        label.indexOf("rear") >= 0 ||
        label.indexOf("environment") >= 0 ||
        label.indexOf("задн") >= 0
      ) {
        return cameras[i].id;
      }
    }

    if (cameras.length > 1) {
      return cameras[cameras.length - 1].id;
    }

    return null;
  }

  function watchOverlayRemoval(elementId) {
    var container = document.getElementById(elementId);
    if (!container) return;

    var observer = new MutationObserver(function () {
      removeLibraryOverlay(elementId);
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    observers.set(elementId, observer);

    var timer = window.setInterval(function () {
      removeLibraryOverlay(elementId);
    }, 200);
    timers.set(elementId, timer);
  }

  async function startWithCamera(html5QrCode, cameraIdOrConfig) {
    var scanConfig = {
      fps: 15,
      disableFlip: false,
    };

    if (window.Html5QrcodeSupportedFormats) {
      scanConfig.formatsToSupport = [Html5QrcodeSupportedFormats.QR_CODE];
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
    stopAll: stopAll,

    start: async function (elementId) {
      await ensureLibrary();
      await stopAll();

      var container = document.getElementById(elementId);

      if (!container) {
        throw new Error("QR container not found: " + elementId);
      }

      container.innerHTML = "";

      var html5QrCode = new Html5Qrcode(elementId, { verbose: false });
      scanners.set(elementId, html5QrCode);

      var started = false;
      var cameraAttempts = [
        { facingMode: { exact: "environment" } },
        { facingMode: "environment" },
      ];

      for (var i = 0; i < cameraAttempts.length; i++) {
        try {
          await startWithCamera(html5QrCode, cameraAttempts[i]);
          started = true;
          break;
        } catch (e) {
          console.warn("QR environment camera failed", cameraAttempts[i], e);
        }
      }

      if (!started) {
        await warmUpEnvironmentCamera();
        var backCameraId = await pickBackCameraId();
        if (backCameraId) {
          try {
            await startWithCamera(html5QrCode, backCameraId);
            started = true;
          } catch (e) {
            console.warn("QR back camera id failed", backCameraId, e);
          }
        }
      }

      if (!started) {
        scanners.delete(elementId);
        try {
          html5QrCode.clear();
        } catch (e) {}
        throw new Error("Unable to start back camera for QR scanning");
      }

      removeLibraryOverlay(elementId);
      watchOverlayRemoval(elementId);
    },

    stop: stopScanner,
  };
})();
