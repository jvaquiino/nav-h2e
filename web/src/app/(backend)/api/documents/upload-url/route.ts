import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, S3_BUCKET, publicUrlForKey } from "@/lib/s3";
import { documentUploadRequestSchema } from "@/backend/schemas";
import {
  blockForbiddenRequests,
  returnInvalidDataErrors,
  validBody,
  zodErrorHandler,
} from "@/utils";
import type { AllowedRoutes } from "@/types";

const allowedRoles: AllowedRoutes = {
  POST: ["SUPER_ADMIN", "ADMIN"],
};

function slugifyFilename(filename: string) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: NextRequest) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.POST);
    if (forbidden) {
      return forbidden;
    }

    const body = await validBody(request);
    const validationResult = documentUploadRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const { filename, contentType } = validationResult.data;
    const key = `documents/${randomUUID()}-${slugifyFilename(filename)}`;

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn: 300 }
    );

    return NextResponse.json({
      uploadUrl,
      fileUrl: publicUrlForKey(key),
      fileKey: key,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}
