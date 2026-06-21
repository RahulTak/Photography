import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Higher-order function wrapper to intercept and standardise API route errors.
 * Handles Zod validation exceptions, Prisma DB constraint violations, and general failures.
 */
export function withErrorHandler(handler: Function) {
  return async function (req: Request, ...args: any[]) {
    try {
      return await handler(req, ...args);
    } catch (error: any) {
      console.error(`[API Error Log - ${req.url}]:`, error);

      // Handle Zod validation errors
      if (error instanceof ZodError) {
        const readableMessage = error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; ");
        
        return NextResponse.json(
          {
            success: false,
            message: `Validation failed: ${readableMessage}`,
            data: error.format(),
          },
          { status: 400 }
        );
      }

      // Handle Prisma database unique constraint violations (e.g. duplicate key)
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            message: "Conflict: A record with these attributes already exists.",
            data: null,
          },
          { status: 409 }
        );
      }

      // Handle custom or standard errors with status codes
      const status = error.status || 500;
      const message = error.message || "Internal server error occurred.";

      return NextResponse.json(
        {
          success: false,
          message,
          data: null,
        },
        { status }
      );
    }
  };
}
export default withErrorHandler;
