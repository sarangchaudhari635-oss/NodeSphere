// src/utils/aiClient.ts
// AI wrapper for NodeSphere
// - use expandIdea() and summarizeMap() from your UI
// - supports mock (offline) and builtin (chrome.ai) modes
// - includes a simple IndexedDB cache

import { openDB } from "idb";
import { Node } from "@xyflow/react";

export type NodeShape = Node;

// === CONFIG ===
// Set to true when you have the chrome built-in AI available and implemented below.
const USE_BUILTIN_AI = true;
const USE_OPENROUTER_API = true; // Set to true to use OpenRouter API instead of mocks

// Add your OpenRouter API key here (for frontend-only usage)
// WARNING: This will be exposed in the client-side code
const OPENROUTER_API_KEY = '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';

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
  const labels = nodes.map((n) => n.data.label).filter(Boolean);
  const joined = labels.map(label => `• ${label}`).join("\n");
  return `Mind Map Summary:\n\n${joined}\n\nTotal ideas: ${labels.length}`;
}

// === REAL OPENROUTER API implementations ===
async function expandIdeaOpenRouter(text: string, persona?: string): Promise<string[]> {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === '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') {
    throw new Error('OpenRouter API key not configured. Please add your API key to src/utils/aiclient.ts');
  }

  const prompt = `Expand this idea into 6 actionable, related sub-ideas. Each idea should be concise (1-2 sentences max). Return only the 6 ideas as a numbered list, no other text.

Idea: ${text}${persona ? `\nContext/Persona: ${persona}` : ''}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'NodeSphere Mind Mapping App'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku:beta',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content;

    if (!aiText) {
      throw new Error('No response from OpenRouter API');
    }

    // Parse the numbered list into an array
    const ideas = aiText
      .split('\n')
      .filter((line: string) => line.trim().match(/^\d+\./))
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((idea: string) => idea.length > 0)
      .slice(0, 6); // Limit to 6 ideas

    return ideas.length > 0 ? ideas : expandIdeaMock(text, persona); // Fallback to mock if parsing fails
  } catch (error) {
    console.error('OpenRouter API error:', error);
    // Fallback to mock implementation
    return expandIdeaMock(text, persona);
  }
}

async function summarizeMapOpenRouter(nodes: NodeShape[]): Promise<string> {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === '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') {
    throw new Error('OpenRouter API key not configured. Please add your API key to src/utils/aiclient.ts');
  }

  const text = nodes.map((n) => n.data.label).filter(Boolean).join("\n");
  const prompt = `Summarize the following mind map ideas into a concise overview (2-4 sentences). Focus on the main themes and connections between ideas.

Ideas:
${text}

Summary:`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'NodeSphere Mind Mapping App'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku:beta',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.3,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content;

    return aiText || summarizeMapMock(nodes); // Fallback to mock if no response
  } catch (error) {
    console.error('OpenRouter API error:', error);
    // Fallback to mock implementation
    return summarizeMapMock(nodes);
  }
}

// === Helpers to build stable cache keys ===
function hashPrompt(prompt: string) {
  // simple hash: base64 of prompt (ok for cache key)
  return btoa(unescape(encodeURIComponent(prompt))).slice(0, 200);
}

// === Wrapper functions: call openrouter, builtin, or mock ===
export async function expandIdea(text: string, persona?: string): Promise<string[]> {
  const prompt = `Expand idea into 6 actionable branches.\nPersona:${persona ?? "none"}\nIdea: ${text}`;
  const key = "expand:" + hashPrompt(prompt);
  const cached = await getCached(key);
  if (cached) return cached as string[];

  let out: string[];

  if (USE_OPENROUTER_API) {
    out = await expandIdeaOpenRouter(text, persona);
  } else if (USE_BUILTIN_AI) {
    // ===== PSEUDOCODE: Replace this block with the actual chrome.ai.prompt call per Chrome docs =====
    throw new Error("expandIdea(): set USE_BUILTIN_AI=false while developing, or replace the pseudocode with chrome.ai.prompt per docs");
  } else {
    out = await expandIdeaMock(text, persona);
  }

  await setCached(key, out);
  return out;
}

export async function summarizeMap(nodes: NodeShape[]): Promise<string> {
  const text = nodes.map((n) => n.data.label).filter(Boolean).join("\n");
  const prompt = `Summarize the following mind map ideas into a concise overview (2-4 sentences):\n${text}`;
  const key = "summarize:" + hashPrompt(prompt);
  const cached = await getCached(key);
  if (cached) return cached as string;

  let out: string;

  if (USE_OPENROUTER_API) {
    out = await summarizeMapOpenRouter(nodes);
  } else if (USE_BUILTIN_AI) {
    // ===== PSEUDOCODE: Replace with chrome.ai.summarize (or chrome.ai.prompt with summarization prompt) =====
    throw new Error("summarizeMap(): set USE_BUILTIN_AI=false while developing, or replace the pseudocode with chrome.ai.summarize per docs");
  } else {
    out = await summarizeMapMock(nodes);
  }

  await setCached(key, out);
  return out;
}

