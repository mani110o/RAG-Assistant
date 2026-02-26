const fs = require("fs");
const natural = require("natural");

const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

// Load documents
const docs = JSON.parse(
  fs.readFileSync("./data/docs.json", "utf-8")
);

docs.forEach(doc => {
  tfidf.addDocument(doc.content);
});

let vectorStore = [];

docs.forEach((doc, index) => {
  let terms = [];

  tfidf.listTerms(index).forEach(item => {
    terms.push({
      term: item.term,
      tfidf: item.tfidf
    });
  });

  vectorStore.push({
    id: doc.id,
    title: doc.title,
    content: doc.content,
    vector: terms
  });
});

fs.writeFileSync(
  "./data/vector_store.json",
  JSON.stringify(vectorStore, null, 2)
);

console.log("Local embeddings generated successfully!");