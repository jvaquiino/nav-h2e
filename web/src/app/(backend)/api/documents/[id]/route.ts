import { NextRequest, NextResponse } from "next/server";
import { deleteDocument, getDocumentById } from "@/backend/services/documents";
import { blockForbiddenRequests, zodErrorHandler } from "@/utils";
import { toErrorMessage } from "@/utils/api/toErrorMessage";
import type { AllowedRoutes } from "@/types";

const allowedRoles: AllowedRoutes = {
  GET: ["SUPER_ADMIN", "ADMIN"],
  DELETE: ["SUPER_ADMIN", "ADMIN"],
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.GET);
    if (forbidden) {
      return forbidden;
    }

    const { id } = await params;
    const document = await getDocumentById(id);

    if (!document) {
      return NextResponse.json(toErrorMessage("Documento não encontrado"), { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.DELETE);
    if (forbidden) {
      return forbidden;
    }

    const { id } = await params;
    await deleteDocument(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    if (error instanceof Error && error.message.includes("não encontrado")) {
      return NextResponse.json(toErrorMessage(error.message), { status: 404 });
    }

    return zodErrorHandler(error);
  }
}
