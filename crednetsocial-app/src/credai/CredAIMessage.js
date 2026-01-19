import React from "react";

const CredAIMessage = ({ role, text }) => (
  <div className={`credai-message credai-message-${role}`}>
      <strong>{role === "user" ? "You" : "Cred AI"}:</strong> {text}
        </div>
        );

        export default CredAIMessage;