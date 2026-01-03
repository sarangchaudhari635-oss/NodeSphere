// src/ai/aiClient.ts
type AIConfig = { useBuiltin: boolean };

const CONFIG: AIConfig = { useBuiltin: false }; // flip to true when integrating

export async function expandIdea(text: string, persona?: string) {
  if (!CONFIG.useBuiltin) {
    // mock
    return [
      `${text} — Alternate approach`,
      `${text} — Quick prototype`,
      `${text} — User test idea`,
      `${text} — Marketing angle`,
      `${text} — Cost saving`,
      `${text} — Technical note`
    ];
  }
  // PSEUDOCODE: replace with actual chrome built-in API call
  const prompt = `You are an idea generator... Idea: "${text}"${persona ? ` Persona: ${persona}` : ''}`;
  // example: const resp = await chrome.ai.prompt({prompt, ...});
  // return resp.outputItems or resp.text
  throw new Error("Replace with chrome.ai.prompt call per docs");
}

export async function summarizeTexts(texts: string[]) {
  if (!CONFIG.useBuiltin) {
    return texts.join(' ').slice(0, 140) + '...';
  }
  // PSEUDOCODE: chrome.ai.summarize or similar
  throw new Error("Replace with chrome.ai.summarize call per docs");
}
