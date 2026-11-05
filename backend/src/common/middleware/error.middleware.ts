import type { ErrorRequestHandler } from "express";
import { ApiError } from "../errors/apiErrors.js";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  const isApiError = error instanceof ApiError;

  const statusCode = isApiError ? error.statusCode : 500;

  const message = isApiError
    ? error.message
    : error instanceof Error
      ? error.message
      : "Internal server error";

  const errors = isApiError ? error.errors : [];

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    data: null,
    ...(process.env.NODE_ENV === "development" && {
      stack: error instanceof Error ? error.stack : undefined,
    }),
  });
};



/*
 * ERROR MIDDLEWARE NOTES
 *
 * 1. ErrorRequestHandler Express ka TypeScript type hai
 *    jo error-handling middleware ko define karta hai.
 *
 * 2. Express error middleware ke 4 parameters hote hain:
 *    (error, req, res, next).
 *
 * 3. error instanceof ApiError check karta hai ki error
 *    hamari custom ApiError class ka instance hai ya nahi.
 *
 * 4. Custom ApiError hone par uska statusCode, message aur
 *    errors use hote hain. Otherwise, statusCode 500 hota hai.
 *
 * 5. error instanceof Error check karta hai ki error
 *    JavaScript Error instance hai ya nahi.
 *
 * 6. res.status(statusCode).json(...) client ko consistent
 *    JSON error response send karta hai.
 *
 * 7. data: null batata hai ki failed request mein successful
 *    response data available nahi hai.
 *
 * 8. NODE_ENV === "development" hone par stack trace include
 *    hoti hai, jo debugging mein help karti hai.
 *
 * 9. _req aur _next unused parameters hain. Underscore
 *    naming batati hai ki inka use nahi ho raha.
 *
 * FLOW:
 * Error -> errorMiddleware -> Error details identify karo
 *       -> Status code aur message decide karo
 *       -> JSON response client ko send karo
 *
 * IMPORTANT:
 * Is middleware ko routes ke baad app.use(errorMiddleware)
 * se register karo. Production mein internal error messages
 * aur stack traces client ko expose karne se bacho.
 */