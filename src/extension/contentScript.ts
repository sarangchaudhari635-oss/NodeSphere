document.addEventListener('mouseup', () => {
  const sel = window.getSelection()?.toString().trim();
  if (sel) {
    chrome.runtime.sendMessage({ type: 'selection', text: sel });
  }
});
