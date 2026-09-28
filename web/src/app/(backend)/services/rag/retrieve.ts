import prisma from "../db";
import { embedQuery } from "@/lib/voyage";

export type RetrievedChunk = {
  content: string;
  documentId: string;
  documentTitle: string;
  score: number;
};

type VectorSearchRawResult = {
  _id: { $oid: string };
  content: string;
  documentId: string;
  score: number;
};

export async function retrieveRelevantChunks(
  question: string,
  limit = 6
): Promise<RetrievedChunk[]> {
  const queryEmbedding = await embedQuery(question);

  const result = await prisma.$runCommandRaw({
    aggregate: "DocumentChunk",
    pipeline: [
      {
        $vectorSearch: {
          index: process.env.ATLAS_VECTOR_INDEX || "chunk_vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: limit * 15,
          limit,
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          documentId: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ],
    cursor: {},
  });

  const matches = ((result as unknown as { cursor: { firstBatch: VectorSearchRawResult[] } })
    .cursor?.firstBatch ?? []) as VectorSearchRawResult[];

  if (matches.length === 0) {
    return [];
  }

  const documents = await prisma.document.findMany({
    where: { id: { in: matches.map((match) => match.documentId) } },
    select: { id: true, title: true },
  });
  const titleById = new Map(documents.map((doc) => [doc.id, doc.title]));

  return matches.map((match) => ({
    content: match.content,
    documentId: match.documentId,
    documentTitle: titleById.get(match.documentId) ?? "Documento",
    score: match.score,
  }));
}
