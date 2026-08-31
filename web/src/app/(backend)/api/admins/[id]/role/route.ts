import { NextRequest, NextResponse } from "next/server";
import {
  countSuperAdmins,
  findUserById,
  updateUserRole,
} from "@/backend/services/users";
import { roleSchema } from "@/backend/schemas";
import {
  blockForbiddenRequests,
  getUserFromRequest,
  returnInvalidDataErrors,
  validBody,
  zodErrorHandler,
} from "@/utils";
import type { AllowedRoutes } from "@/types";
import { toErrorMessage } from "@/utils/api/toErrorMessage";

const allowedRoles: AllowedRoutes = {
  PATCH: ["SUPER_ADMIN"],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.PATCH);
    if (forbidden) {
      return forbidden;
    }

    const userFromRequest = await getUserFromRequest(request);
    if (userFromRequest instanceof NextResponse) {
      return userFromRequest;
    }

    const { id } = await params;

    if (id === userFromRequest.id) {
      return NextResponse.json(
        toErrorMessage("Você não pode alterar sua própria role"),
        { status: 400 }
      );
    }

    const body = await validBody(request);
    const validationResult = roleSchema.safeParse(body);

    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const targetUser = await findUserById(id);

    if (!targetUser || (targetUser.role !== "ADMIN" && targetUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json(toErrorMessage("Admin não encontrado"), { status: 404 });
    }

    if (targetUser.role === "SUPER_ADMIN" && validationResult.data.role !== "SUPER_ADMIN") {
      const superAdminCount = await countSuperAdmins();
      if (superAdminCount <= 1) {
        return NextResponse.json(
          toErrorMessage("Não é possível remover o último super admin"),
          { status: 400 }
        );
      }
    }

    const user = await updateUserRole(id, validationResult.data.role);
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}
