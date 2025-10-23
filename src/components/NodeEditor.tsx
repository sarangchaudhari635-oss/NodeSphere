// src/components/NodeEditor.tsx
import React, { useState, useEffect } from "react";
import { Node } from "reactflow";

type Props = {
  node: Node;
  onChange: (node: Node) => void;
};

export default function NodeEditor({ node, onChange }: Props) {
  const [text, setText] = useState<string>(node.data?.label ?? "");
  const [notes, setNotes] = useState<string>(node.data?.notes ?? "");
  const [color, setColor] = useState<string>(node.data?.color ?? "#ffffff");

  useEffect(() => {
    setText(node.data?.label ?? "");
    setNotes(node.data?.notes ?? "");
    setColor(node.data?.color ?? "#ffffff");
  }, [node]);

  const save = () => {
    const updated: Node = {
      ...node,
      data: { ...node.data, label: text, notes, color },
      style: { ...(node.style || {}), background: color },
    };
    onChange(updated);
  };

  const expandMock = () => {
    const expanded = text + " — explore subtopics: Research, Design, Testing, Launch";
    setNotes((n) => n + "\n" + expanded);
  };

  const summarizeMock = () => {
    const s = text.length > 40 ? text.slice(0, 40) + "…" : text;
    setNotes((n) => n + "\n" + `Summary: ${s}`);
  };

  return (
    <div className="editor">
      <label className="field">
        <div className="label">Text</div>
        <input value={text} onChange={(e) => setText(e.target.value)} onBlur={save} className="input" />
      </label>

      <label className="field">
        <div className="label">Color</div>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} onBlur={save} />
      </label>

      <label className="field">
        <div className="label">Notes</div>
        <textarea rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={save} className="textarea" />
      </label>

      <div className="editor-actions">
        <button className="btn" onClick={save}>Save</button>
        <button className="btn quiet" onClick={expandMock}>Expand (AI)</button>
        <button className="btn quiet" onClick={summarizeMock}>Summarize (AI)</button>
      </div>
    </div>
  );
}
