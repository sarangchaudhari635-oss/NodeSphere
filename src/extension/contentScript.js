// src/extension/contentScript.js
// Captures selected text and sends to the background script.

(function () {
  document.addEventListener('mouseup', () => {
    try {
      const selectionObj = window.getSelection ? window.getSelection() : null;
      const sel = selectionObj ? selectionObj.toString().trim() : '';
      if (sel) {
        chrome.runtime.sendMessage({ type: 'selection', text: sel });
      }
    } catch (err) {
      // silently fail in pages where content scripts cannot run
      console.warn('contentScript error', err);
    }
  });
})();
