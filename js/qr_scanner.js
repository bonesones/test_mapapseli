(function () {
  "use strict";

  let codeReader = null;
  let stream = null;
  let scanning = false;

  const EVENT = "mapapseli-qr-detected";

  function dispatch(text) {
    if (!text) return;
    window.dispatchEvent(new CustomEvent(EVENT, { detail: String(text) }));
  }

  async function ensureZXing() {
    if (window.ZXing) return;

    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/@zxing/browser@latest/umd/index.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function start(elementId) {
    if (scanning) return;
    scanning = true;

    try {
      await ensureZXing();

      await stop();

      const container = document.getElementById(elementId);
      if (!container) throw new Error("Container not found");

      container.innerHTML = "";

      const video = document.createElement("video");
      video.setAttribute("playsinline", "true");
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "cover";

      container.appendChild(video);

      const ZXingBrowser = window.ZXingBrowser;
      codeReader = new ZXingBrowser.BrowserMultiFormatReader();

      const devices =
        await ZXingBrowser.BrowserCodeReader.listVideoInputDevices();

      let selectedDeviceId = null;

      if (devices.length > 0) {
        selectedDeviceId =
          devices.find(
            (d) =>
              (d.label || "").toLowerCase().includes("back") ||
              (d.label || "").toLowerCase().includes("rear"),
          )?.deviceId || devices[0].deviceId;
      }

      await codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        video,
        (result, err) => {
          if (result) {
            const text = result.getText();
            console.log("QR detected:", text);
            dispatch(text);
          }
        },
      );

      console.log("ZXing scanner started");
    } catch (e) {
      console.error("ZXing start error:", e);
      throw e;
    } finally {
      scanning = false;
    }
  }

  async function stop() {
    try {
      if (codeReader) {
        codeReader.reset();
        codeReader = null;
      }
    } catch (_) {}

    try {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        stream = null;
      }
    } catch (_) {}
  }

  window.MapapseliQrScanner = {
    start,
    stop,
  };
})();
