import { NextRequest, NextResponse } from "next/server";
import { processDocument } from "@/backend/services/documents";
import { blockForbiddenRequests, zodErrorHandler } from "@/utils";
import { toErrorMessage } from "@/utils/api/toErrorMessage";
import type { AllowedRoutes } from "@/types";

const allowedRoles: AllowedRoutes = {
  POST: ["SUPER_ADMIN", "ADMIN"],
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.POST);
    if (forbidden) {
      return forbidden;
    }

    const { id } = await params;
    const document = await processDocument(id);

    return NextResponse.json(document);
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
