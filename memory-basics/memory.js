import { getEmbedding } from "./embeddings.js";

// Simple in-memory "vector database"
const memories = [];

// Cosine similarity between two embedding vectors
function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function initializeMemory() {
  console.log("🧠 Using simple in-memory vector store.");
}

export async function storeMemory(text) {
  const embedding = await getEmbedding(text);

  const memory = {
    id: Date.now().toString(),
    text,
    embedding,
    createdAt: new Date().toISOString(),
  };

  memories.push(memory);
  console.log("🧠 Memory stored:", text);
}

export async function retrieveMemory(query, topK = 3) {
  if (memories.length === 0) {
    return [];
  }

  const queryEmbedding = await getEmbedding(query);

  const scored = memories.map((m) => ({
    ...m,
    score: cosineSimilarity(queryEmbedding, m.embedding),
  }));

  // Sort by similarity score (high → low)
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}
