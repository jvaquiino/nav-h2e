import { NextRequest, NextResponse } from "next/server";
import { getAdmins } from "@/backend/services/users";
import { inviteAdmin } from "@/backend/services/admins";
import { inviteAdminSchema } from "@/backend/schemas";
import {
  blockForbiddenRequests,
  returnInvalidDataErrors,
  validBody,
  zodErrorHandler,
} from "@/utils";
import type { AllowedRoutes } from "@/types";
import { toErrorMessage } from "@/utils/api/toErrorMessage";

const allowedRoles: AllowedRoutes = {
  GET: ["SUPER_ADMIN", "ADMIN"],
  POST: ["SUPER_ADMIN"],
};

export async function GET(request: NextRequest) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.GET);
    if (forbidden) {
      return forbidden;
    }

    const admins = await getAdmins();
    return NextResponse.json(admins);
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
    const validationResult = inviteAdminSchema.safeParse(body);

    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const admin = await inviteAdmin(validationResult.data);

    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    if (error instanceof Error && error.message.includes("Já existe")) {
      return NextResponse.json(toErrorMessage(error.message), { status: 409 });
    }

    return zodErrorHandler(error);
  }
}
