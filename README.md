🧠 Production-Grade RAG Assistant
🚀 Overview

This project is a Retrieval-Augmented Generation (RAG) Chat Assistant built using Node.js (Express) and React (Vite).

Instead of generating responses blindly, the assistant retrieves relevant information from a private knowledge base using vector similarity search before responding. This prevents hallucinations and ensures grounded, fact-based answers.

🏗️ System Architecture
User (React Frontend)
        ↓
POST /api/chat
        ↓
Express Backend
        ↓
Query Vectorization (TF-IDF)
        ↓
Cosine Similarity Search
        ↓
Top 3 Relevant Chunks Retrieved
        ↓
Grounded Response Generation
        ↓
Frontend Chat Display
🛠️ Tech Stack
Backend

Node.js

Express.js

natural (TF-IDF vectorization)

Custom Cosine Similarity

JSON-based Vector Store

Frontend

React.js (Vite)

Axios

localStorage (Session Handling)

📂 Project Structure
rag-assistant/
├── backend/
│   ├── data/
│   │   ├── docs.json
│   │   └── vector_store.json
│   ├── scripts/
│   │   └── ingest.js
│   ├── utils/
│   │   └── vector_math.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   └── index.html
└── README.md
📚 RAG Workflow
1️⃣ Document Ingestion

Documents are stored in docs.json

Text is chunked into smaller pieces

Each chunk is converted into a TF-IDF vector

Vectors are stored in vector_store.json

2️⃣ Query Processing

When a user sends a message:

Convert query into TF-IDF vector

Compute cosine similarity against all stored vectors

Filter using similarity threshold (> 0.1)

Retrieve top 3 most relevant chunks

3️⃣ Grounded Response Strategy

If relevant chunks exist:

Based on the documents:
<retrieved content>

If similarity score is too low:

I do not have enough information to answer this.

This ensures:

No hallucinated responses

Strict document grounding

Safe fallback mechanism

🧮 Similarity Search Formula

Cosine Similarity:

cosine_similarity = (A · B) / (||A|| × ||B||)

Where:

A = Query Vector

B = Document Vector

Documents are ranked by similarity score and filtered using threshold.

🔒 Hallucination Prevention

Retrieval before response

Similarity threshold filtering

No free-form answer generation

Safe fallback if no relevant data found

🔌 API Endpoint
POST /api/chat
Request
{
  "sessionId": "abc123",
  "message": "How can I reset my password?"
}
Response
{
  "reply": "Based on the documents...",
  "retrievedChunks": 2
}
▶️ Setup Instructions
Backend Setup
cd backend
npm install
node server.js

Backend runs on:

http://localhost:5000
Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173
🎯 Key Features

Embedding-based retrieval

Cosine similarity ranking

Threshold-based filtering

Safe fallback mechanism

React chat interface

Session-based interaction

Modular architecture

🔮 Future Improvements

Replace TF-IDF with transformer embeddings (OpenAI / Gemini)

Use vector databases (Pinecone / FAISS / Chroma)

Add conversation memory persistence

Add token usage logging

Dockerize for production deployment

🧠 Interview Summary

This project demonstrates:

Strong understanding of RAG architecture

Vector similarity implementation

Backend API development

Frontend integration

Hallucination mitigation strategies

End-to-end system design

📌 Conclusion

This is a fully functional Retrieval-Augmented Generation system implementing document chunking, vector similarity search, threshold filtering, and grounded response generation.
