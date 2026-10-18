

export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}






/*
===============================================================================
                  API RESPONSE INTERFACE — COMPLETE NOTES
===============================================================================

FILE LOCATION:
src/common/types/apiResponse.ts

PURPOSE:
Is file mein hum ApiResponse naam ka generic TypeScript interface define
karte hain, jo API se client ko bheje jaane wale successful response ka
expected structure describe karta hai.

Iska main goal hai ki backend ke API responses consistent rahen aur
TypeScript response ke structure ko check kar sake.


1. INTERFACE KYA HOTA HAI?

TypeScript mein interface ek contract ya blueprint hota hai.

Ye define karta hai ki kisi object mein kaun-kaun si properties honi chahiye
aur unki types kya honi chahiye.

Interface khud runtime par response generate nahi karta aur na hi data
automatically validate karta hai. Ye mainly compile-time type checking ke
liye use hota hai.


2. ApiResponse<T> MEIN GENERIC KYA HAI?

export interface ApiResponse<T>

Yahan T ek generic type parameter hai.

Generic ka matlab hai ki hum ek reusable interface bana sakte hain jo
different types ke response data ke saath kaam kare.

T ko placeholder samjho. Jab interface use karenge, tab T ki jagah actual
data type provide karenge.

Examples:

ApiResponse<string>
ApiResponse<User>
ApiResponse<Problem[]>

Isse har API ke liye alag response interface banane ki zaroorat kam hoti hai.

IMPORTANT:
T koi fixed TypeScript type nahi hai. Ye ek placeholder hai jise interface
use karte waqt actual type se replace kiya jata hai.


3. success: boolean

Ye batata hai ki application ke response ke according operation successful
tha ya nahi.

boolean ka matlab true ya false.

Example:
success: true

Iska use successful response indicate karne ke liye hota hai.

Note:
HTTP status code aur success flag ko consistent rakhna chahiye.
For example, successful operation ke liye aam taur par 2xx status use hote hain.


4. statusCode: number

Ismein HTTP status code store hota hai.

Examples:
200 -> OK
201 -> Created
400 -> Bad Request
401 -> Unauthorized
404 -> Not Found
500 -> Internal Server Error

Example:
statusCode: 200

Ye property response body ke andar status code describe karti hai.
Actual HTTP status set karne ke liye Express mein res.status(...) use karna hota hai.

Dono ko consistent rakhna chahiye.


5. message: string

Ismein response ka readable message hota hai.

Examples:
"User fetched successfully"
"Problem created successfully"
"Submission retrieved successfully"

Iska purpose client ko operation ke result ke baare mein batana hai.

Sensitive internal information, database details ya stack traces ko message
mein expose nahi karna chahiye.


6. data: T

Ye generic interface ki sabse important property hai.

T ki jagah actual response data ka type aata hai.

Example 1:
ApiResponse<string>

Ismein data string hoga.

Example 2:
ApiResponse<User>

Ismein data User type ka object hoga.

Example 3:
ApiResponse<Problem[]>

Ismein data Problem objects ka array hoga.

Isse TypeScript check kar sakta hai ki response ke data ka structure expected
type ke according hai ya nahi.


7. PRACTICAL EXAMPLE

Maan lo User interface hai:

interface User {
  id: string;
  username: string;
  email: string;
}

Ab response type:

ApiResponse<User>

Iska expected structure hoga:

{
  success: true,
  statusCode: 200,
  message: "User fetched successfully",
  data: {
    id: "123",
    username: "Harsh",
    email: "harsh@example.com"
  }
}

Yahan T ki jagah User type use hua hai.

Isse TypeScript expected response structure ko check kar sakta hai.


8. GENERIC USE KARNE KA BENEFIT

Agar generic use nahi karte, toh har data type ke liye alag interface
banana pad sakta hai.

Example:
UserResponse
ProblemResponse
SubmissionResponse

Generic interface ke saath:

ApiResponse<User>
ApiResponse<Problem>
ApiResponse<Submission>

Ek common response structure different data types ke liye reuse kar sakte hain.


9. LEETCODE CLONE MEIN KAHAAN USE HOGA?

User APIs:
ApiResponse<User>

Problems listing:
ApiResponse<Problem[]>

Single problem:
ApiResponse<Problem>

Submission details:
ApiResponse<Submission>

Isse controllers aur services mein response structure ko consistently
type karna easier hota hai.


10. API RESPONSE KA EXAMPLE

Successful response:

{
  "success": true,
  "statusCode": 200,
  "message": "Problems fetched successfully",
  "data": []
}

Ye sirf example hai. Actual data database se aayega.

Express mein response bhejte waqt:

res.status(200).json({
  success: true,
  statusCode: 200,
  message: "Problems fetched successfully",
  data: problems
});

Agar problems ka type Problem[] hai aur response ko ApiResponse<Problem[]>
ke roop mein type kiya gaya hai, toh TypeScript data ke expected structure
ko check karne mein help karega.


11. IMPORTANT LIMITATIONS

- Interface runtime par object create nahi karta.
- Interface response automatically send nahi karta.
- Interface incoming ya outgoing data ko runtime par validate nahi karta.
- Generic T compile-time type information provide karta hai.
- JSON response mein TypeScript interfaces maujood nahi rehte; TypeScript
  types compilation ke baad erase ho jaate hain.

Runtime validation ke liye Zod jaise tools use kiye ja sakte hain.


12. API RESPONSE AUR API ERROR MEIN DIFFERENCE

ApiResponse:
Successful responses ka consistent structure describe karne ke liye use
kiya ja sakta hai.

ApiError:
Errors ko statusCode, message aur additional details ke saath represent
karne ke liye custom error class hai.

Dono alag responsibilities rakhte hain.

Aage chal kar successful responses ke liye ApiResponse aur failures ke liye
global error-handling middleware ka consistent JSON format define kar sakte hain.


13. FINAL SUMMARY

ApiResponse<T> ek generic TypeScript interface hai.

success     -> Operation ka result indicate karta hai.
statusCode  -> HTTP status code describe karta hai.
message     -> Human-readable response message.
data: T     -> Actual response data ka expected type.

MAIN BENEFITS:
- Consistent API response structure.
- Reusable generic interface.
- Better TypeScript type checking.
- Controllers aur services mein predictable response format.

REMEMBER:
Interface contract define karta hai; actual response object controller
banata hai aur Express client ko send karta hai.

===============================================================================
*/