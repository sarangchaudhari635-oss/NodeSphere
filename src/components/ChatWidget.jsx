// ChatWidget.jsx
import { useState } from "react";

export default function ChatWidget() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  async function send() {
    if (!text) return;
    const userMsg = { role: "user", text };
    setMessages(m => [...m, { from: "you", text }]);
    setText("");
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg.text }),
    });
    const data = await res.json();
    setMessages(m => [...m, { from: "bot", text: data.reply }]);
  }

  return (
    <div style={{ width: 320, border: "1px solid #ddd", padding: 12 }}>
      <div style={{ height: 200, overflow: "auto", marginBottom: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === "you" ? "right" : "left" }}>
            <small>{m.text}</small>
          </div>
        ))}
      </div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}

fetch("http://localhost:3000/api/ai/chat",)
