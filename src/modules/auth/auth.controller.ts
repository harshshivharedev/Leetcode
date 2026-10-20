

import type{ Request, Response} from "express";
import { ApiError } from "../../common/errors/apiErrors.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { loginSchema, registerSchema } from "./validation.auth.js";
import { registerUser, loginUser } from "./auth.service.js";

export const registerController = asyncHandler(
    async( req:Request, res: Response) => {
        const parsedData = registerSchema.safeParse(req.body);

        if(!parsedData.success) {
            throw new ApiError(
                400,
                "Invalid registration data",
                parsedData.error.issues
            );
        }

        const user = await registerUser(parsedData.data);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        })
    }
)
export const loginController = asyncHandler(
      async(req:Request, res: Response) => {
          const parsedData = loginSchema.safeParse(req.body);
          if(!parsedData.success) {
            throw new ApiError(
                  400,
                  "Invalid login data",
                  parsedData.error.issues
            );
          }

          const result = await loginUser(parsedData.data);

          res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
          })
          
      }
)











/*
===============================================================================
              AUTH REGISTER CONTROLLER — NOTES
===============================================================================

FILE:
src/modules/auth/auth.controller.ts

PURPOSE:
Ye file registration request ko receive karti hai, input validate karti hai,
auth service ko call karti hai aur client ko final response bhejti hai.

CONTROLLER KA FLOW:

Client Request
      ↓
Register Controller
      ↓
Zod Validation
      ↓
Auth Service
      ↓
User Model
      ↓
MongoDB
      ↓
Success Response


1. Request Receive Karna

Express ka req object client ki request contain karta hai.

req.body mein register form ka data hota hai:

- firstName
- lastName
- username
- email
- password
- age


2. Zod Validation

registerSchema.safeParse(req.body) client ke data ko validate karta hai.

Ye check karta hai:

- Required fields present hain ya nahi
- Email valid hai ya nahi
- Password ki length valid hai ya nahi
- Username valid hai ya nahi
- Age valid range mein hai ya nahi

Invalid data hone par database tak request nahi jaati.


3. ApiError

Agar validation fail hoti hai, toh ApiError throw hota hai.

Status code:
400 = Bad Request

Error asyncHandler ke through global error middleware tak jaata hai,
jo client ko consistent JSON error response bhejta hai.


4. Auth Service Call

Agar validation successful hoti hai, toh parsedData.data service ko diya jata hai.

Auth service:

- Existing email check karti hai
- Existing username check karti hai
- Password hash karti hai
- User create karti hai
- Safe user data return karti hai

Controller khud database logic nahi karta.


5. asyncHandler

Controller asynchronous function hai.

asyncHandler ka purpose:

- Async errors automatically catch karna
- Errors ko error middleware tak forward karna
- Har controller mein manually try/catch likhne se bachna


6. Success Response

User successfully create hone par:

HTTP status:
201 Created

Response mein:

- success
- message
- safe user data

bheja jata hai.

Password aur sensitive data response mein return nahi karna chahiye.


7. Controller KI Responsibilities

Controller ka kaam:

- Request receive karna
- Input validate karna
- Service call karna
- Response bhejna


Controller ka kaam nahi:

- Database queries likhna
- Password hash karna
- Duplicate user check karna
- User schema define karna

Ye kaam service aur model layer karti hain.


FINAL SUMMARY:

Zod:
Request validation

Controller:
Request aur response handling

Service:
Registration business logic

Model:
Database structure aur database validation

asyncHandler:
Async errors forward karna

Error Middleware:
Final error response bhejna

===============================================================================
*/