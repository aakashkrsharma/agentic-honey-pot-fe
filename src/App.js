import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/honeypot/message";

function generateSessionId() {
  return crypto.randomUUID();
}

export default function App() {
  const [sessionId, setSessionId] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState(null);
  const [intelligence, setIntelligence] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const API_KEY = process.env.REACT_APP_API_KEY;

  // Create / load sessionId
  useEffect(() => {
    let stored = localStorage.getItem("sessionId");
    if (!stored) {
      stored = generateSessionId();
      localStorage.setItem("sessionId", stored);
    }
    setSessionId(stored);
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = {
      sender: "scammer",
      text: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, { ...userMessage, role: "user" }]);
    setInput("");

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        sessionId,
        message: userMessage,
      }),
    });


    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "bot", text: data.reply },
    ]);

    setStatus({
      scamDetected: data.scamDetected,
      agentActive: data.agentActive,
      turns: data.engagementMetrics?.conversationTurns,
    });

    setIntelligence(data.extractedIntelligence);
  }

  return (
    <div className="app">
      <h2>🕵️ Scam Honeypot</h2>

      {status && (
        <div className="status">
          {status.scamDetected ? (
            <span className="badge danger">🔴 Scam Detected</span>
          ) : (
            <span className="badge safe">🟢 Normal Conversation</span>
          )}

          {status.agentActive && (
            <div className="warning">
              ⚠️ Honeypot active – suspicious behavior detected
            </div>
          )}
        </div>
      )}

      <div className="chat">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message ${m.role === "user" ? "user" : "bot"}`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
        <button
          onClick={() => {
            const newSession = generateSessionId();
            localStorage.setItem("sessionId", newSession);
            setSessionId(newSession);
            setMessages([]);
            setStatus(null);
            setIntelligence(null);
          }}
        >
          New Session
        </button>
      </div>


      {intelligence && (
        <div className="intel">
          <h4>🧠 Extracted Intelligence</h4>

          {intelligence.upiIds?.length > 0 && (
            <div>
              <strong>UPI IDs:</strong>
              <ul>
                {intelligence.upiIds.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          )}

          {intelligence.bankAccounts?.length > 0 && (
            <div>
              <strong>Bank Accounts:</strong>
              <ul>
                {intelligence.bankAccounts.map((b, i) => (
                  <li key={i}>
                    Account: {b.accountNumber} | IFSC: {b.ifsc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {intelligence.phishingUrls?.length > 0 && (
            <div>
              <strong>Phishing URLs:</strong>
              <ul>
                {intelligence.phishingUrls.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
