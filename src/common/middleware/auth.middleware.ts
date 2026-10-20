
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../errors/apiErrors.js";
import { env } from "../../config/env.js";

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    throw new ApiError(401, "Authorization token is required");
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Invalid authorization format");
  }

  try {
    const decodedToken = jwt.verify(token, env.JWT_SECRET);

    if (
      typeof decodedToken === "string" ||
      !decodedToken ||
      typeof decodedToken.userId !== "string"
    ) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = {
      userId: decodedToken.userId,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid or expired access token");
  }
};
/*
===============================================================================
                 JWT AUTHENTICATION MIDDLEWARE — NOTES
===============================================================================

PURPOSE:
JWT middleware protected routes ko secure karta hai.

Ye check karta hai ki request bhejne wale user ke paas valid access token hai
ya nahi.

FLOW:

Client Request
      ↓
Authorization Header
      ↓
JWT Middleware
      ↓
Token Verify
      ↓
Protected Controller


1. Authorization Header

Client protected API request ke saath token bhejta hai:

Authorization: Bearer <access-token>


2. Token Extract Karna

Middleware header se:

- Bearer word
- Actual JWT token

alag karta hai.

Agar token missing ya format invalid ho, toh 401 Unauthorized response milega.


3. Token Verify Karna

JWT secret ke through token verify hota hai.

Verify hone par check hota hai:

- Token server ne generate kiya tha ya nahi
- Token modify hua hai ya nahi
- Token expire hua hai ya nahi


4. Payload

Login ke time token mein userId store kiya gaya tha.

Valid token se userId milta hai:

userId → authenticated user ki identity


5. Request Me User Attach Karna

Valid token ke baad userId request object ke saath attach hota hai:

req.user.userId

Protected controller isi userId ka use karke database se user data fetch karega.


6. next()

Token valid ho toh middleware:

next()

call karta hai aur request protected controller tak jaati hai.


7. Invalid Token

Token missing, invalid ya expired hone par:

- Request controller tak nahi jaati
- 401 Unauthorized error throw hota hai
- Global error middleware response bhejta hai


8. Authentication vs Authorization

Authentication:
User logged in hai ya nahi?

Authorization:
Logged-in user ko specific action ki permission hai ya nahi?

Abhi hum authentication middleware banayenge.
Admin authorization baad me add karenge.


FINAL FLOW:

Login
  ↓
JWT token generate
  ↓
Client token store/send karta hai
  ↓
Protected request
  ↓
JWT middleware token verify karta hai
  ↓
req.user me userId attach hoti hai
  ↓
Controller execute hota hai

IMPORTANT:

- JWT me password store nahi karna.
- JWT secret .env file me rakhna.
- Invalid token par generic error dena.
- Protected route par middleware controller se pehle lagana.
- req.user me sirf required identity data rakhna.

===============================================================================
*/
