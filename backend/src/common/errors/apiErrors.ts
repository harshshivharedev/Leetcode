
export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly errors: unknown[];
    public readonly isOperational: boolean ;

    constructor(
        statusCode: number,
        message: string,
        errors: unknown[] = [],
    ){
        super(message);

        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}















/*
===============================================================================
                    API ERROR CLASS — COMPLETE NOTES
===============================================================================

FILE LOCATION:
src/common/errors/apiError.ts

PURPOSE:
Is file mein hum ek custom ApiError class banate hain, jo backend API
mein aane wale errors ko consistent structure mein represent karti hai.

Example:
Agar user kisi aise problem ko access kare jo database mein exist nahi karti,
toh hum ApiError ke through status code 404 aur message "Problem not found"
ke saath error represent kar sakte hain.

IMPORTANT:
ApiError class sirf error object banati hai. Ye khud HTTP response send
nahi karti. Error ko handle karke response bhejne ke liye Express ka
global error-handling middleware chahiye.


1. CUSTOM ERROR CLASS KYA HOTI HAI?

JavaScript mein built-in Error class hoti hai, jiska use errors represent
karne ke liye kiya jata hai.

Example:
throw new Error("Something went wrong");

Lekin normal Error object mein hamare application ke liye custom HTTP
status code ya additional validation errors automatically nahi hote.

Isliye hum ApiError class banate hain, jo built-in Error class ko extend
karke apni additional properties provide karti hai.

Isse har API error ko ek common structure mein represent kar sakte hain.


2. export class ApiError extends Error

export:
Class ko doosri files mein import karne aur use karne ki permission deta hai.

class ApiError:
ApiError naam ki custom class define karta hai.

extends Error:
ApiError ko JavaScript ki built-in Error class se inherit karata hai.

Inheritance ka matlab hai ki ApiError ko parent Error class ki functionality
milti hai, jaise message aur stack trace.

Example:
const error = new ApiError(404, "Problem not found");

error.message -> "Problem not found"
error.name    -> "ApiError"

ApiError ek Error bhi hai aur ismein application-specific properties bhi hain.


3. public readonly statusCode: number

Purpose:
Error ke saath HTTP status code store karna.

public:
Property ko class ke bahar se access kar sakte hain.

readonly:
TypeScript mein property ko initialize karne ke baad dobara assign karne
se rokta hai. Ye compile-time restriction hai, runtime security feature nahi.

number:
Property mein number expected hai.

Example:
new ApiError(404, "Problem not found");

statusCode = 404

Common HTTP status codes:
400 -> Bad Request
401 -> Unauthorized
403 -> Forbidden
404 -> Not Found
409 -> Conflict
500 -> Internal Server Error

Global error middleware baad mein statusCode ko use karke response ka
HTTP status set kar sakta hai.


4. public readonly errors: unknown[]

Purpose:
Error ke saath additional details store karna, jaise validation errors.

unknown[]:
Array mein different types ki values ho sakti hain, lekin kisi value ko
specific type ki tarah use karne se pehle uska type check karna pad sakta hai.

Example:
[
  { field: "email", message: "Invalid email" },
  { field: "password", message: "Password is required" }
]

unknown, any se safer hai kyunki unknown values ko bina type checking
ke freely use karne ki permission nahi deta.

IMPORTANT:
readonly errors property ko dobara assign karne se rokta hai, lekin array
ke elements ko automatically immutable nahi banata.

Client ko errors return karne se pehle ensure karo ki unmein sensitive
database details, internal implementation ya secrets expose na hon.


5. public readonly isOperational: boolean

Purpose:
Error ko expected application error ke roop mein classify karna.

boolean:
Value true ya false ho sakti hai.

Example:
this.isOperational = true;

Operational error ka example:
User ne aisi problem request ki jo exist nahi karti.
Application expected tareeke se 404 return kar sakti hai.

Unexpected programming error ka example:
Code mein undefined value par galat operation hone se TypeError aa jaye.

isOperational flag application ke error-handling logic mein help kar sakta
hai, lekin ye apne aap errors ko handle nahi karta.

IMPORTANT:
Har error ko automatically safe ya operational nahi maana chahiye.
Unexpected errors ko log karna aur appropriate generic response dena chahiye.


6. CONSTRUCTOR KYA HOTA HAI?

Constructor class ka special method hai, jo new ApiError(...) call karne
par execute hota hai.

Constructor ke parameters:

statusCode: number
HTTP status code store karne ke liye.

message: string
Error ka description dene ke liye.

errors: unknown[] = []
Additional details store karne ke liye. Agar argument nahi diya, toh
default value empty array [] use hoti hai.

Example:
new ApiError(400, "Validation failed");

Yahan errors automatically [] hoga.

Example with additional errors:
new ApiError(400, "Validation failed", [
  { field: "email", message: "Invalid email" }
]);


7. super(message)

Purpose:
Parent Error class ka constructor call karna.

ApiError, Error class ko extend karti hai. Isliye derived class ke
constructor mein this access karne se pehle super(...) call karna zaroori hai.

super(message) parent Error ko message provide karta hai.

Iske baad error.message mein wahi message available hota hai jo constructor
ko pass kiya gaya tha.

Example:
new ApiError(401, "Invalid credentials");

error.message -> "Invalid credentials"


8. this.name = "ApiError"

Built-in Error ka default name aam taur par "Error" hota hai.

this.name = "ApiError" se error ka name custom ho jata hai.

Example:
const error = new ApiError(404, "Problem not found");

error.name -> "ApiError"

Ye debugging aur logs mein useful hai kyunki error ki category identify
karna easier hota hai.


9. this.statusCode = statusCode

Constructor ke statusCode parameter ko class ki statusCode property mein
store karta hai.

Isse error object ke through status code access kar sakte hain.

Example:
error.statusCode -> 404


10. this.errors = errors

Constructor ko jo additional errors array diya gaya hai, use class ki
errors property mein store karta hai.

Agar argument nahi diya gaya, toh default empty array [] store hoga.

Iska use validation ya field-specific errors represent karne mein ho sakta hai.


11. this.isOperational = true

ApiError se banne wale error ko operational mark karta hai.

Iska matlab application ise expected application error ke roop mein
treat kar sakti hai.

Ye sirf classification flag hai. Isse error automatically catch nahi hota,
HTTP response send nahi hota aur process automatically safe nahi ho jata.


12. Error.captureStackTrace(this, this.constructor)

Ye V8 JavaScript engine ka method hai, jo Node.js mein available hota hai.

Purpose:
Error object ka stack trace capture karna, taaki debugging ke waqt pata
chal sake ki error kis code path se aaya.

this:
Jis error object ka stack trace capture karna hai.

this.constructor:
Stack trace mein constructor ke frames ko omit karne mein help karta hai.

Stack trace debugging ke liye useful hai, lekin ise directly client ko
return karna security risk ho sakta hai.

NOTE:
Error.captureStackTrace V8-specific feature hai. Har JavaScript runtime
mein iska available hona guaranteed nahi hai.


13. APIERROR KA PRACTICAL FLOW

Example:
User kisi nonexistent coding problem ko access karta hai.

Step 1:
Controller ya service detect karti hai ki problem nahi mili.

Step 2:
throw new ApiError(404, "Problem not found");

Step 3:
Error Express ke error-handling pipeline tak forward hota hai.

Step 4:
Global error middleware error ka statusCode aur message read karta hai.

Step 5:
Middleware appropriate HTTP status aur JSON response send karta hai.

Possible response:
{
  "success": false,
  "message": "Problem not found"
}

Ye response tabhi send hoga jab global error-handling middleware ise
implement karega. ApiError class khud response generate nahi karti.


14. ApiError AUR GLOBAL ERROR MIDDLEWARE MEIN DIFFERENCE

ApiError class:
Error object create karti hai aur error se related information store karti hai.

Global error middleware:
Thrown errors ko handle karta hai, HTTP status decide karta hai aur client
ko response send karta hai.

Dono ka purpose alag hai, lekin saath use karne se error handling consistent
aur maintainable banti hai.


15. SECURITY NOTES

- Client ko internal stack traces return mat karo.
- Database credentials aur JWT secrets error messages mein expose mat karo.
- Unexpected errors ke liye generic 500 response use karo.
- Detailed debugging information server-side logs mein rakho.
- Error message ko blindly trust karke client ko expose mat karo.
- Authentication aur authorization errors ko appropriate status codes se
  represent karo.


16. FINAL SUMMARY

ApiError ek custom error class hai jo built-in Error ko extend karti hai.

Ismein:
statusCode     -> HTTP status code store karta hai.
errors         -> Additional error details store karta hai.
isOperational -> Expected application error ko classify karta hai.
message        -> Error ka description deta hai.
name           -> Error ki category identify karta hai.
stack          -> Debugging ke liye error trace provide karta hai.

Main benefit:
Backend mein errors ko common aur predictable structure mein represent karna.

NEXT STEP:
Global Express error-handling middleware banana, jo ApiError ko catch
karke appropriate status code aur safe JSON response return kare.

===============================================================================
*/