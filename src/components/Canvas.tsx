import React, { useState, useCallback } from "react";
// @ts-ignore - some packages export things in ways TS can't infer; we'll cast to `any` below.
import ReactFlowLib, { addEdge, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeEditor from "./NodeEditor";
import { expandIdeaMock, summarizeMapMock } from "../utils/aiMocks";

// --- Quick cast to any to work around JSX typing problems with @xyflow/react package
// You can replace `RFAny` with the proper typed component if you install or author the package types.
const ReactFlow: any = ReactFlowLib as any;

// Minimal RF node/edge typings for our local usage (you can expand these if you need stricter typing)
type SimpleNode = {
  id: string;
  data: { label: string; summary?: string };
  position: { x: number; y: number };
};
type SimpleEdge = { id: string; source: string; target: string };

export default function Canvas(): JSX.Element {
  const [nodes, setNodes] = useState<SimpleNode[]>([
    { id: "1", data: { label: "Central Idea" }, position: { x: 250, y: 150 } },
  ]);
  const [edges, setEdges] = useState<SimpleEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<SimpleNode | null>(null);
  const [summary, setSummary] = useState<string>("");

  // Use a very permissive param type here because addEdge from the lib may expect different shapes
  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds) as SimpleEdge[]), []);

  async function handleExpand(node: SimpleNode) {
    // Guard: ensure label is a string
    const label = typeof node?.data?.label === "string" ? node.data.label : String(node?.data?.label ?? "");
    const ideas = await expandIdeaMock(label);

    const baseIndex = nodes.length;
    const newNodes: SimpleNode[] = ideas.map((idea, i) => ({
      id: `${baseIndex + i + 1}`,
      data: { label: idea },
      position: { x: node.position.x + 200, y: node.position.y + i * 60 },
    }));

    const newEdges: SimpleEdge[] = newNodes.map((n) => ({
      id: `e${node.id}-${n.id}`,
      source: node.id,
      target: n.id,
    }));

    setNodes((prev) => [...prev, ...newNodes]);
    setEdges((prev) => [...prev, ...newEdges]);
  }

  async function handleSummarize() {
    // summarizeMapMock expects nodes; make sure types align
    const text = await summarizeMapMock(nodes);
    setSummary(text);
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1 }}>
        {/* Cast to any to avoid TS complaining about JSX element type for this package */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodeDoubleClick={(event: React.MouseEvent, node: SimpleNode) => setSelectedNode(node)}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>

      <div style={{ width: 320, borderLeft: "1px solid #ddd", padding: 12 }}>
        <h3>AI Tools</h3>
        {selectedNode && (
          <button onClick={() => handleExpand(selectedNode)} className="ai-btn">
            ✨ Expand Idea
          </button>
        )}
        <button onClick={handleSummarize} className="ai-btn">
          🧠 Summarize Map
        </button>
        <p style={{ marginTop: 10 }}>{summary}</p>
      </div>
    </div>
  );
}
