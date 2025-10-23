import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  Node,
  Edge,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "default",
    position: { x: 250, y: 5 },
    data: { label: "Central Idea" },
  },
];

export default function App(): JSX.Element {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const newLabel = prompt("Enter new text:", node.data.label);
      if (newLabel) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id ? { ...n, data: { label: newLabel } } : n
          )
        );
      }
    },
    [setNodes]
  );

  const addNode = () => {
    const id = (nodes.length + 1).toString();
    const newNode: Node = {
      id,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `New Node ${id}` },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <button
        onClick={addNode}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          background: "#4a90e2",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        + Add Node
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}
