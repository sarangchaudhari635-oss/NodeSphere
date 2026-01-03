// at the top of Canvas.tsx
import React, { useState } from "react";
import { expandIdea, summarizeMap, NodeShape } from "../utils/aiclient";

// inside your component (example)
// local React state used by the handlers
const [nodes, setNodes] = useState<NodeShape[]>([]);
const [edges, setEdges] = useState<any[]>([]);
const [summary, setSummary] = useState<string>("");

async function handleExpand(node: NodeShape) {
  // ensure label is string
  const label = typeof node?.data?.label === "string" ? node.data.label : String(node?.data?.label ?? "");
  // optionally show UI loading state here
  const ideas = await expandIdea(label, /* persona? */ undefined);

  // create suggestion nodes (non-destructive). Mark them as suggestions:
  const baseIndex = nodes.length;
  const suggestionNodes: NodeShape[] = ideas.map((idea, i) => ({
    id: `s-${baseIndex + i + 1}`,
    data: { label: idea, aiSuggestion: true },
    position: { x: node.position.x + 180, y: node.position.y + i * 60 },
  }));
  const suggestionEdges = suggestionNodes.map((n) => ({
    id: `e${node.id}-${n.id}`,
    source: node.id,
    target: n.id,
    // optional: style differently
  }));

  setNodes((prev) => [...prev, ...suggestionNodes]);
  setEdges((prev) => [...prev, ...suggestionEdges]);
}

async function handleSummarize() {
  const s = await summarizeMap(nodes as NodeShape[]);
  setSummary(s);
}
