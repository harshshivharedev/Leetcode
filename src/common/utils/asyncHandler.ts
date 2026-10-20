import type { RequestHandler } from "express";

export const asyncHandler = ( 
    requestHandler: RequestHandler,
): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)) .catch(next);
    };
};










/*
 * ASYNC HANDLER NOTES
 *
 * 1. asyncHandler ek higher-order function hai jo Express
 *    controller ko wrap karta hai aur repetitive try-catch
 *    likhne ki zarurat kam karta hai.
 *
 * 2. RequestHandler Express ka TypeScript type hai, jo
 *    request handler ke expected structure ko define karta hai.
 *
 * 3. requestHandler parameter mein actual controller function
 *    pass hota hai.
 *
 * 4. Wrapper (req, res, next) ko Express request aane par
 *    execute karta hai.
 *
 * 5. Promise.resolve() controller ke returned Promise ko
 *    handle karne mein help karta hai.
 *
 * 6. .catch(next) asynchronous errors ko Express ke global
 *    error-handling middleware tak forward karta hai.
 *
 * 7. next(error) error ko aage bhejta hai; ye khud response
 *    send nahi karta.
 *
 * 8. Global error middleware final error response bhejta hai.
 *
 * 9. try-catch synchronous errors ko bhi forward karne mein
 *    help karta hai.
 *
 * FLOW:
 * Request -> asyncHandler -> Controller
 *         -> Success: Response
 *         -> Error: next(error) -> Global Error Middleware
 *
 * IMPORTANT:
 * Promise.resolve() ke saath .catch(next) zaroor lagao,
 * warna rejected Promise properly handle nahi hoga.
 */ 