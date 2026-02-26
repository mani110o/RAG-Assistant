const express = require("express");
const cors = require("cors");
const fs = require("fs");
const natural = require("natural");
const { cosineSimilarity } = require("./utils/vector_math");

const app = express();
app.use(cors());
app.use(express.json());

const TfIdf = natural.TfIdf;

// Load vector store
const vectorStore = JSON.parse(
  fs.readFileSync("./data/vector_store.json", "utf-8")
);

// In-memory session storage
const sessions = {};

// Similarity threshold
const SIMILARITY_THRESHOLD = 0.3;

app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const id = sessionId || "default";

    // Initialize session if not exists
    if (!sessions[id]) {
      sessions[id] = [];
    }

    // --------- Generate Query Vector ---------
    const tfidf = new TfIdf();
    tfidf.addDocument(message);

    let queryVector = [];
    tfidf.listTerms(0).forEach(item => {
      queryVector.push({
        term: item.term,
        tfidf: item.tfidf
      });
    });

    // --------- Similarity Scoring ---------
    const scored = vectorStore.map(doc => ({
      ...doc,
      score: cosineSimilarity(queryVector, doc.vector)
    }));

    const topChunks = scored
      .filter(doc => doc.score > SIMILARITY_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (topChunks.length === 0) {
      return res.json({
        reply: "I do not have enough information to answer this.",
        retrievedChunks: 0,
        similarityScores: []
      });
    }

    // --------- Build Context ---------
    const context = topChunks.map(c => c.content).join("\n\n");

    // --------- Maintain Conversation Memory ---------
    sessions[id].push({ role: "user", content: message });

    const history = sessions[id]
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    // --------- Construct Prompt (Simulated LLM Prompt) ---------
    const prompt = `
You are a helpful assistant.
Answer ONLY using the context below.
If the answer is not in the context, say you do not know.

CONTEXT:
${context}

CONVERSATION HISTORY:
${history}

USER QUESTION:
${message}

ANSWER:
`;

    // --------- Simulated LLM Response ---------
    const reply = `Based on the documents:\n\n${context}`;

    sessions[id].push({ role: "assistant", content: reply });

    // Keep last 5 pairs (10 messages)
    if (sessions[id].length > 10) {
      sessions[id] = sessions[id].slice(-10);
    }

    // --------- Response ---------
    res.json({
      reply,
      retrievedChunks: topChunks.length,
      similarityScores: topChunks.map(c => Number(c.score.toFixed(3))),
      sessionId: id
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Offline RAG server running on port 5000");
});