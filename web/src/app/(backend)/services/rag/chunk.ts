const CHUNK_SIZE = 3000; // ~ characters per chunk (rough proxy for ~800 tokens)
const CHUNK_OVERLAP = 500;

export function splitIntoChunks(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim();

  if (!normalized) {
    return [];
  }

  const paragraphs = normalized.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if ((current + "\n\n" + paragraph).length > CHUNK_SIZE && current) {
      chunks.push(current.trim());
      const overlapStart = Math.max(0, current.length - CHUNK_OVERLAP);
      current = current.slice(overlapStart);
    }

    current = current ? `${current}\n\n${paragraph}` : paragraph;

    while (current.length > CHUNK_SIZE) {
      chunks.push(current.slice(0, CHUNK_SIZE).trim());
      current = current.slice(CHUNK_SIZE - CHUNK_OVERLAP);
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks.filter((chunk) => chunk.length > 0);
}
