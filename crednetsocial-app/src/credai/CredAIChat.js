import React, { useState } from "react";
import CredAIMessage from "./CredAIMessage";

const CredAIChat = () => {
  const [messages, setMessages] = useState([
      { role: "system", text: "Cred AI is ready to read your signals." }
        ]);
          const [input, setInput] = useState("");

            const handleSend = (e) => {
                e.preventDefault();
                    if (!input.trim()) return;
                        setMessages((prev) => [...prev, { role: "user", text: input }]);
                            setInput("");
                                // Tomorrow: call Gemini via lib/ai.js and append assistant reply
                                  };

                                    return (
                                        <div className="credai-chat">
                                              <div className="credai-messages">
                                                      {messages.map((m, i) => (
                                                                <CredAIMessage key={i} role={m.role} text={m.text} />
                                                                        ))}
                                                                              </div>
                                                                                    <form onSubmit={handleSend} className="credai-input-row">
                                                                                            <input
                                                                                                      value={input}
                                                                                                                onChange={(e) => setInput(e.target.value)}
                                                                                                                          placeholder="Ask Cred AI about your signals…"
                                                                                                                                  />
                                                                                                                                          <button type="submit">Send</button>
                                                                                                                                                </form>
                                                                                                                                                    </div>
                                                                                                                                                      );
                                                                                                                                                      };

                                                                                                                                                      export default CredAIChat;