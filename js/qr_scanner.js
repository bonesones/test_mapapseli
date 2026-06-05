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
    try {
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) return null;

      console.log("Available cameras:", cameras);
      alert("Available cameras: " + cameras);

      // Приоритет задней камере
      for (const camera of cameras) {
        const label = (camera.label || "").toLowerCase();
        if (
          label.includes("back") ||
          label.includes("rear") ||
          label.includes("environment") ||
          label.includes("задн") ||
          label.includes("основн") ||
          label.includes("0") || // часто задняя — 0
          !label.includes("front")
        ) {
          console.log("Selected camera:", camera.label);
          return camera.id;
        }
      }

      return cameras[cameras.length - 1]?.id || null; // последняя обычно задняя
    } catch (e) {
      console.warn("Failed to get cameras", e);
      return null;
    }
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
    const scanConfig = {
      fps: 20,
      qrbox: { width: 320, height: 320 },
      aspectRatio: 1.0,
    };

    if (window.Html5QrcodeSupportedFormats) {
      scanConfig.formatsToSupport = [Html5QrcodeSupportedFormats.QR_CODE];
    }

    await html5QrCode.start(
      cameraIdOrConfig,
      scanConfig,
      function (decodedText, decodedResult) {
        console.log(
          "%c✅ QR DETECTED!",
          "color:lime;font-weight:bold",
          decodedText,
        );
        alert("QR detected:\n" + decodedText);
        dispatch(decodedText);
      },
      function (errorMessage) {
        if (
          !errorMessage.includes("No MultiFormat Readers") &&
          !errorMessage.includes("QR code parse error")
        ) {
          console.warn("SCAN:", errorMessage);
        }
      },
    );
  }

  window.MapapseliQrScanner = {
    stopAll: stopAll,

    start: async function (elementId) {
      await ensureLibrary();
      await stopAll();

      console.log("Starting QR scanner for:", elementId);

      let container = document.getElementById(elementId);
      if (!container) {
        container = document.querySelector('[id^="mapapseli-qr-"]');
      }
      if (!container) {
        throw new Error("QR container not found: " + elementId);
        alert("QR container not found: " + elementId);
      }

      container.innerHTML = "";
      container.style.position = "relative";
      container.style.overflow = "hidden";
      container.style.backgroundColor = "#000";

      var html5QrCode = new Html5Qrcode(elementId, { verbose: false });
      scanners.set(elementId, html5QrCode);

      const scanConfig = {
        fps: 20,
        qrbox: { width: 320, height: 320 },
        aspectRatio: 1.0,
        disableFlip: false,
      };

      if (window.Html5QrcodeSupportedFormats) {
        scanConfig.formatsToSupport = [Html5QrcodeSupportedFormats.QR_CODE];
      }

      // === Улучшенная логика выбора камеры ===
      const cameraAttempts = [
        { facingMode: { exact: "environment" } }, // 1. Строго задняя
        { facingMode: "environment" }, // 2. Предпочтительно задняя
        { facingMode: "user" }, // 3. Фронтальная как fallback
        true, // 4. Автоматический выбор (лучшая доступная)
      ];

      let started = false;

      for (let attempt of cameraAttempts) {
        try {
          console.log("Trying camera config:", attempt);
          alert("Trying camera config: " + attempt);
          await startWithCamera(html5QrCode, attempt);
          started = true;
          console.log("✅ Camera started successfully with config:", attempt);
          alert("Camera started successfully with config: " + attempt);
          break;
        } catch (e) {
          console.warn("Camera attempt failed:", attempt, e.name || e);
          alert("Camera attempt failed: " + attempt + " " + (e.name || e));
          if (e.name === "OverconstrainedError") {
            continue; // пробуем следующий вариант
          }
        }
      }

      if (!started) {
        // Последняя попытка через ID камеры
        try {
          const backCameraId = await pickBackCameraId();
          if (backCameraId) {
            await startWithCamera(html5QrCode, backCameraId);
            started = true;
          }
        } catch (e) {
          console.warn("Back camera ID attempt failed", e);
        }
      }

      if (!started) {
        scanners.delete(elementId);
        throw new Error("Unable to start camera for QR scanning");
      }

      removeLibraryOverlay(elementId);
      watchOverlayRemoval(elementId);
    },

    stop: stopScanner,
  };
})();
