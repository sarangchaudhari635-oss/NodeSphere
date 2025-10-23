document.addEventListener('DOMContentLoaded', () => {
  const selDiv = document.getElementById('selection')!;
  const btn = document.getElementById('pasteBtn')!;

  chrome.runtime.sendMessage({ type: 'request-selection' });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === 'selection') {
      selDiv.textContent = msg.text;
      btn.addEventListener('click', async () => {
        alert('Would send to NodeSphere app: ' + msg.text);
      });
    }
  });
});
