// src/utils/aiClient.ts
// AI wrapper for NodeSphere
// - use expandIdea() and summarizeMap() from your UI
// - supports mock (offline) and builtin (chrome.ai) modes
// - includes a simple IndexedDB cache

import { openDB } from "idb";

export type NodeShape = { id: string; data: { label: string; summary?: string; aiSuggestion?: boolean }; position: { x: number; y: number } };

// === CONFIG ===
// Set to true when you have the chrome built-in AI available and implemented below.
const USE_BUILTIN_AI = false;

// === Simple IDB cache ===
async function db() {
  return openDB("nodesphere-ai-cache", 1, {
    upgrade(d) {
      if (!d.objectStoreNames.contains("cache")) d.createObjectStore("cache");
    },
  });
}
async function getCached(key: string) {
  const d = await db();
  return d.get("cache", key);
}
async function setCached(key: string, value: any) {
  const d = await db();
  return d.put("cache", value, key);
}

// === MOCK implementations (fast & offline) ===
async function expandIdeaMock(text: string, persona?: string): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 260));
  return [
    `${text} — Alternate approach`,
    `${text} — Quick prototype`,
    `${text} — User-test idea`,
    `${text} — Marketing angle`,
    `${text} — Cost-saving option`,
    `${text} — Technical note`,
  ];
}
async function summarizeMapMock(nodes: NodeShape[]): Promise<string> {
  await new Promise((r) => setTimeout(r, 200));
  const joined = nodes.map((n) => `• ${n.data.label}`).join("\n");
  return joined.slice(0, 800);
}

// === Helpers to build stable cache keys ===
function hashPrompt(prompt: string) {
  // simple hash: base64 of prompt (ok for cache key)
  return btoa(unescape(encodeURIComponent(prompt))).slice(0, 200);
}

// === Wrapper functions: call builtin or mock ===
export async function expandIdea(text: string, persona?: string): Promise<string[]> {
  const prompt = `Expand idea into 6 actionable branches.\nPersona:${persona ?? "none"}\nIdea: ${text}`;
  const key = "expand:" + hashPrompt(prompt);
  const cached = await getCached(key);
  if (cached) return cached as string[];

  if (!USE_BUILTIN_AI) {
    const out = await expandIdeaMock(text, persona);
    await setCached(key, out);
    return out;
  }

  // ===== PSEUDOCODE: Replace this block with the actual chrome.ai.prompt call per Chrome docs =====
  // Example conceptual structure (NOT real API signature) — replace with the real call:
  //
  // const resp = await chrome.ai.prompt({
  //   model: 'gemini-nano',
  //   prompt: prompt,
  //   maxOutputTokens: 300,
  //   temperature: 0.7,
  // });
  // // parse resp to array of strings
  // const parsed = parseResponseToArray(resp);
  //
  // ================================================================================================
  throw new Error("expandIdea(): set USE_BUILTIN_AI=false while developing, or replace the pseudocode with chrome.ai.prompt per docs");
}

export async function summarizeMap(nodes: NodeShape[]): Promise<string> {
  const text = nodes.map((n) => n.data.label).join("\n");
  const prompt = `Summarize the following ideas into a concise executive summary (2-4 sentences):\n${text}`;
  const key = "summarize:" + hashPrompt(prompt);
  const cached = await getCached(key);
  if (cached) return cached as string;

  if (!USE_BUILTIN_AI) {
    const out = await summarizeMapMock(nodes);
    await setCached(key, out);
    return out;
  }

  // ===== PSEUDOCODE: Replace with chrome.ai.summarize (or chrome.ai.prompt with summarization prompt) =====
  //
  // const resp = await chrome.ai.summarize({ text, length: 'short' });
  // return resp.summary;
  //
  // ================================================================================================
  throw new Error("summarizeMap(): set USE_BUILTIN_AI=false while developing, or replace the pseudocode with chrome.ai.summarize per docs");
}

