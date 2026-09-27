/**
 * Asynchronous dynamic loader for MapTiler SDK JS & CSS
 * Loads official MapTiler SDK UMD module without bloat or lock issues
 */

let loadPromise = null;

export function loadMapTilerSDK() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('MapTiler SDK requires a browser environment.'));
  }

  if (window.maptilersdk) {
    return Promise.resolve(window.maptilersdk);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    // 1. Inject CSS if not present
    const cssId = 'maptiler-sdk-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://cdn.maptiler.com/maptiler-sdk-js/v2.5.1/maptiler-sdk.css';
      document.head.appendChild(link);
    }

    // 2. Inject UMD Script if not present
    const scriptId = 'maptiler-sdk-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdn.maptiler.com/maptiler-sdk-js/v2.5.1/maptiler-sdk.umd.min.js';
      script.async = true;

      const timeout = setTimeout(() => {
        reject(new Error('MapTiler SDK script download timed out.'));
      }, 15000);

      script.onload = () => {
        clearTimeout(timeout);
        if (window.maptilersdk) {
          resolve(window.maptilersdk);
        } else {
          reject(new Error('MapTiler SDK loaded but window.maptilersdk is undefined.'));
        }
      };

      script.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load MapTiler SDK script from CDN.'));
      };

      document.body.appendChild(script);
    } else {
      // Script tag exists, wait for it
      const interval = setInterval(() => {
        if (window.maptilersdk) {
          clearInterval(interval);
          resolve(window.maptilersdk);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        if (window.maptilersdk) {
          resolve(window.maptilersdk);
        } else {
          reject(new Error('Timed out waiting for existing MapTiler SDK script.'));
        }
      }, 10000);
    }
  });

  return loadPromise;
}
