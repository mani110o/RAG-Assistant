import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sessionId =
    localStorage.getItem("sessionId") ||
    Math.random().toString(36).substring(2);

  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setChat((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        {
          sessionId,
          message,
        }
      );

      const botMessage = {
        role: "assistant",
        content: response.data.reply,
      };

      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: "Server error occurred." },
      ]);
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>RAG Assistant</h2>

      <div style={styles.chatBox}>
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf:
                msg.role === "user" ? "flex-end" : "flex-start",
              background:
                msg.role === "user" ? "#4f46e5" : "#e5e7eb",
              color: msg.role === "user" ? "white" : "black",
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div>Thinking...</div>}
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    fontFamily: "Arial",
    display: "flex",
    flexDirection: "column",
  },
  chatBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minHeight: "400px",
    border: "1px solid #ccc",
    padding: "15px",
    borderRadius: "8px",
    overflowY: "auto",
  },
  message: {
    padding: "10px 15px",
    borderRadius: "15px",
    maxWidth: "70%",
  },
  inputArea: {
    display: "flex",
    marginTop: "15px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 15px",
    marginLeft: "10px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default App;