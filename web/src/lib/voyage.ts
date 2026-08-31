const VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings";
const VOYAGE_MODEL = "voyage-3-large";
const BATCH_SIZE = 96;

type VoyageInputType = "document" | "query";

type VoyageEmbeddingsResponse = {
  data: { embedding: number[]; index: number }[];
};

async function requestEmbeddings(texts: string[], inputType: VoyageInputType) {
  const response = await fetch(VOYAGE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: texts,
      model: VOYAGE_MODEL,
      input_type: inputType,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Falha ao gerar embeddings na Voyage AI: ${response.status} ${errorText}`);
  }

  const data: VoyageEmbeddingsResponse = await response.json();

  return data.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
}

export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const batchEmbeddings = await requestEmbeddings(batch, "document");
    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
}

export async function embedQuery(text: string): Promise<number[]> {
  const [embedding] = await requestEmbeddings([text], "query");
  return embedding;
}
