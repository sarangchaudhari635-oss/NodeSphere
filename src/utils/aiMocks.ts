export async function expandIdeaMock(topic: string): Promise<string[]> {
  const mockDatabase: Record<string, string[]> = {
    "banana wine": ["Fermentation", "Yeast Types", "Aging Process", "Tasting Notes"],
    fermentation: ["Anaerobic Process", "Temperature Control", "Wild Yeast"],
    marketing: ["Social Media", "Branding", "Target Audience"],
  };
  
  return mockDatabase[topic.toLowerCase()] || [
    `${topic} Overview`,
    `${topic} Techniques`,
    `${topic} Challenges`
  ];
}

export async function summarizeMapMock(nodes: any[]): Promise<string> {
  const titles = nodes.map(n => n.data.label).join(", ");
  return `This mind map explores: ${titles}. It connects ${nodes.length} key concepts.`;
}
