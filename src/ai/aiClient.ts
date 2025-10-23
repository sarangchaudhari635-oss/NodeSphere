// Mock AI client for testing
export async function expandIdea(text: string) {
  return [
    `${text} — branch 1`,
    `${text} — branch 2`,
    `${text} — branch 3`
  ];
}

export async function summarizeTexts(texts: string[]) {
  return texts.join(' ').slice(0, 120) + '...';
}
