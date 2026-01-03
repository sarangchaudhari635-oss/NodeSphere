import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  Node,
  Edge,
  Connection,
  useReactFlow,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { expandIdea, summarizeMap, NodeShape } from './utils/aiclient';
import './styles.css';

// Custom Node Component
function CustomNode({ data }: { data: any }) {
  return (
    <div
      style={{
        background: data.color ? `${data.color}20` : 'var(--node-bg)',
        borderColor: data.color || 'var(--node-border)',
        border: `2px solid ${data.color || 'var(--node-border)'}`,
      }}
      className="custom-node"
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-label">{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  default: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 400, y: 300 },
    data: { label: 'Central Idea', notes: '', color: '#4a90e2' },
  },
];

const initialEdges: Edge[] = [];

const STORAGE_KEY = 'nodesphere-mindmap';

interface MindMapData {
  nodes: Node[];
  edges: Edge[];
}

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [summary, setSummary] = useState<string>('');
  const { fitView } = useReactFlow();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data: MindMapData = JSON.parse(saved);
        setNodes(data.nodes);
        setEdges(data.edges);
      } catch (e) {
        console.error('Failed to load saved mind map:', e);
      }
    }
  }, [setNodes, setEdges]);

  // Auto-save to localStorage
  useEffect(() => {
    const data: MindMapData = { nodes, edges };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [nodes, edges]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const updateSelectedNode = useCallback((updates: Record<string, any>) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id ? { ...n, data: { ...n.data, ...updates } } : n
      )
    );
    setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, ...updates } } : null);
  }, [selectedNode, setNodes]);

  const addNode = useCallback(() => {
    const id = Date.now().toString();
    const newNode: Node = {
      id,
      type: 'default',
      position: { x: Math.random() * 600 + 200, y: Math.random() * 400 + 200 },
      data: { label: 'New Idea', notes: '', color: '#4a90e2' },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const resetView = useCallback(() => {
    fitView();
  }, [fitView]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => prev === 'light' ? 'dark' : 'light');
  }, []);

  const expandNode = useCallback(async () => {
    if (!selectedNode) return;
    const label = selectedNode.data.label as string;
    try {
      const ideas = await expandIdea(label);
      const baseX = selectedNode.position.x + 200;
      const baseY = selectedNode.position.y;
      const newNodes: Node[] = ideas.map((idea, i) => ({
        id: `ai-${Date.now()}-${i}`,
        type: 'default',
        position: { x: baseX, y: baseY + i * 80 - (ideas.length * 40) },
        data: { label: idea, notes: '', color: '#28a745', aiSuggestion: true },
      }));
      const newEdges: Edge[] = newNodes.map((node) => ({
        id: `e-${selectedNode.id}-${node.id}`,
        source: selectedNode.id,
        target: node.id,
      }));
      setNodes((nds) => [...nds, ...newNodes]);
      setEdges((eds) => [...eds, ...newEdges]);
    } catch (e) {
      console.error('Failed to expand idea:', e);
    }
  }, [selectedNode, setNodes, setEdges]);

  const summarizeMindMap = useCallback(async () => {
    try {
      const sum = await summarizeMap(nodes as NodeShape[]);
      setSummary(sum);
    } catch (e) {
      console.error('Failed to summarize:', e);
    }
  }, [nodes]);

  const exportMap = useCallback(() => {
    const data: MindMapData = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const importMap = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data: MindMapData = JSON.parse(e.target?.result as string);
        setNodes(data.nodes);
        setEdges(data.edges);
        setSelectedNode(null);
      } catch (e) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  }, [setNodes, setEdges]);

  const deleteNode = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e: Edge) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  return (
    <div className={`app ${theme}`}>
      {/* Toolbar */}
      <div className="toolbar">
        <h1>NodeSphere</h1>
        <div className="toolbar-actions">
          <button onClick={addNode}>Add Node</button>
          <button onClick={resetView}>Reset View</button>
          <button onClick={toggleTheme}>
            {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
          <button onClick={exportMap}>Export</button>
          <label className="import-btn">
            Import
            <input type="file" accept=".json" onChange={importMap} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <div className="main-content">
        {/* Canvas */}
        <div className="canvas-container">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="reactflow-wrapper"
          >
            <MiniMap />
            <Controls />
            <Background color={theme === 'light' ? '#aaa' : '#444'} gap={16} />
          </ReactFlow>
        </div>

        {/* Inspector Panel */}
        <div className="inspector">
          <h3>Node Inspector</h3>
          {selectedNode ? (
            <div>
              <div className="form-group">
                <label>Label:</label>
                <input
                  type="text"
                  value={selectedNode.data.label as string}
                  onChange={(e) => updateSelectedNode({ label: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Notes:</label>
                <textarea
                  value={selectedNode.data.notes as string}
                  onChange={(e) => updateSelectedNode({ notes: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Color:</label>
                <input
                  type="color"
                  value={selectedNode.data.color as string}
                  onChange={(e) => updateSelectedNode({ color: e.target.value })}
                />
              </div>
              <div className="action-buttons">
                <button className="ai-btn" onClick={expandNode}>
                  Expand with AI
                </button>
                <button className="delete-btn" onClick={deleteNode}>
                  Delete Node
                </button>
              </div>
            </div>
          ) : (
            <p>Select a node to edit</p>
          )}

          <hr />

          <h3>Mind Map Summary</h3>
          <button className="ai-btn" onClick={summarizeMindMap}>
            Generate Summary
          </button>
          {summary && (
            <div className="summary">
              <p>{summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
