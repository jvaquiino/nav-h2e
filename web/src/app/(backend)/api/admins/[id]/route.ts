import { NextRequest, NextResponse } from "next/server";
import {
  countSuperAdmins,
  findUserById,
  updateUserRole,
} from "@/backend/services/users";
import { blockForbiddenRequests, getUserFromRequest, zodErrorHandler } from "@/utils";
import type { AllowedRoutes } from "@/types";
import { toErrorMessage } from "@/utils/api/toErrorMessage";

const allowedRoles: AllowedRoutes = {
  DELETE: ["SUPER_ADMIN"],
};

// revoga o acesso de admin (volta a role para USER)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.DELETE);
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
        toErrorMessage("Você não pode revogar seu próprio acesso"),
        { status: 400 }
      );
    }

    const targetUser = await findUserById(id);

    if (!targetUser || (targetUser.role !== "ADMIN" && targetUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json(toErrorMessage("Admin não encontrado"), { status: 404 });
    }

    if (targetUser.role === "SUPER_ADMIN") {
      const superAdminCount = await countSuperAdmins();
      if (superAdminCount <= 1) {
        return NextResponse.json(
          toErrorMessage("Não é possível revogar o último super admin"),
          { status: 400 }
        );
      }
    }

    const user = await updateUserRole(id, "USER");
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}
