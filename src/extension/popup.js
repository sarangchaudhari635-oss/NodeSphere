
// src/extension/popup.js
// Runs in the popup. Requests last selection from background and opens NodeSphere app.

document.addEventListener('DOMContentLoaded', function () {
  const selDiv = document.getElementById('selection');
  const btn = document.getElementById('pasteBtn');

  // Ask background for last selection
  chrome.runtime.sendMessage({ type: 'request-selection' }, function (resp) {
    if (resp && resp.text) {
      selDiv.textContent = resp.text;
    } else {
      selDiv.textContent = 'No selection captured yet';
    }
  });
  chrome.runtime.onMessage.addListener(function (msg)
   {
    if (msg && msg.type === 'selection') {
      selDiv.textContent = msg.text;
    }
  });
});
