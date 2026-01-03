// inside NodeEditor props and component
import React from "react";
import { NodeShape } from "../utils/aiclient";

export default function NodeEditor({ node, nodes, setNodes }: { node: NodeShape; nodes: NodeShape[]; setNodes: (n: NodeShape[]) => void }) {
  // ...existing code

  function acceptSuggestion() {
    setNodes(nodes.map(n => n.id === node.id ? { ...n, data: { ...n.data, aiSuggestion: false } } : n));
  }

  function rejectSuggestion() {
    setNodes(nodes.filter(n => n.id !== node.id));
  }

  return (
    <div>
      {/* existing editor */}
      {node.data.aiSuggestion && (
        <div style={{ marginTop: 10 }}>
          <button onClick={acceptSuggestion}>Accept AI Suggestion</button>
          <button onClick={rejectSuggestion} style={{ marginLeft: 8 }}>Reject</button>
        </div>
      )}
    </div>
  );
}
