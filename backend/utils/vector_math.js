function cosineSimilarity(vecA, vecB) {
  const mapA = {};
  vecA.forEach(item => {
    mapA[item.term] = item.tfidf;
  });

  const mapB = {};
  vecB.forEach(item => {
    mapB[item.term] = item.tfidf;
  });

  const allTerms = new Set([...Object.keys(mapA), ...Object.keys(mapB)]);

  let dot = 0;
  let normA = 0;
  let normB = 0;

  allTerms.forEach(term => {
    const a = mapA[term] || 0;
    const b = mapB[term] || 0;
    dot += a * b;
    normA += a * a;
    normB += b * b;
  });

  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

module.exports = { cosineSimilarity };