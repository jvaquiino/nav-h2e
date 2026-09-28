import { NextRequest, NextResponse } from "next/server";
import { createDocument, getAllDocuments, processDocument } from "@/backend/services/documents";
import { createDocumentSchema } from "@/backend/schemas";
import {
  blockForbiddenRequests,
  returnInvalidDataErrors,
  validBody,
  zodErrorHandler,
} from "@/utils";
import type { AllowedRoutes } from "@/types";

const allowedRoles: AllowedRoutes = {
  GET: ["SUPER_ADMIN", "ADMIN"],
  POST: ["SUPER_ADMIN", "ADMIN"],
};

export async function GET(request: NextRequest) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.GET);
    if (forbidden) {
      return forbidden;
    }

    const documents = await getAllDocuments();
    return NextResponse.json(documents);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.POST);
    if (forbidden) {
      return forbidden;
    }

    const body = await validBody(request);
    const validationResult = createDocumentSchema.safeParse(body);

    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const document = await createDocument(validationResult.data);

    // processa (extração + chunking + embeddings) de forma síncrona - funções
    // serverless não garantem execução em background após a resposta ser enviada.
    // Para documentos grandes, migrar para uma fila (ex: cron + poller de PENDING).
    try {
      const processed = await processDocument(document.id);
      return NextResponse.json(processed, { status: 201 });
    } catch (error) {
      console.error(`Falha ao processar documento ${document.id}:`, error);
      return NextResponse.json(
        { ...document, status: "FAILED" },
        { status: 201 }
      );
    }
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}
