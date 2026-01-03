let lastSelection = '';

chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
  if (msg?.type === 'selection') {
    lastSelection = msg.text;
    chrome.runtime.sendMessage({ type: 'selection', text: lastSelection });
  } else if (msg?.type === 'request-selection') {
    sendResp({ text: lastSelection });
  }
  return true;
});
