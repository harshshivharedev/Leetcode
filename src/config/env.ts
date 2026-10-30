
// environment varible ko check krne or type safe rkhne 

import "dotenv/config";
import {z} from "zod";

const envSchema = z.object({
    NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

    PORT: z.coerce.number().int().positive().default(5000),

    MONGO_URI: z.string().min(1, "MONOGO_URI is required"),
    JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 characters"),
    JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 characters"),
    CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL"),
    JUDGE0_BASE_URL: z.string().url("JUDGE0_BASE_URL must be a valid URL")

});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error("Invalid environment variables:");
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;






/*
=========================================================
             ENVIRONMENT VALIDATION — NOTES
=========================================================

1. ENVIRONMENT VARIABLES KYA HOTE HAIN?

Environment variables application ki configuration values
hoti hain, jaise PORT, MONGO_URI, JWT_SECRET aur CLIENT_URL.

Inhe source code mein hardcode karne ke bajaye .env file
ya deployment platform ki environment configuration mein
store kiya jata hai.

Benefits:
- Configuration aur application code separate rehte hain.
- Development aur production ke liye alag values use kar sakte hain.
- Sensitive values ko source code mein hardcode karne se bach sakte hain.


2. dotenv/config KA KYA WORK HAI?

import "dotenv/config";

Ye dotenv package ko load karta hai aur .env file ki
available variables ko process.env mein load karta hai.

Example:
.env mein PORT=5000 hai, toh process.env.PORT ki value
"5000" string hogi.

Important:
process.env ki values generally strings hoti hain.
dotenv variables ko automatically number ya boolean mein
convert nahi karta.


3. ZOD KYA HAI AUR KYUN USE KAR RAHE HAIN?

Zod ek schema validation library hai.

Iska use expected data structure, data types aur validation
rules define karne ke liye hota hai.

envSchema mein hum define karte hain ki:
- Kaunse environment variables required hain.
- Unka data type kya hona chahiye.
- Unki values par kaunse rules apply honge.

Zod validation sirf environment variables tak limited nahi hai.
Iska use registration, login aur API request validation mein
bhi kiya ja sakta hai.


4. SCHEMA KYA HOTA HAI?

Schema ek blueprint ya rulebook ki tarah hota hai.

Ye batata hai ki data ka structure kaisa hona chahiye aur
kaunsi values valid maani jayengi.

z.object({...}) object ka schema define karta hai.

Example:
z.string()       -> String expected hai.
z.number()       -> Number expected hai.
z.boolean()      -> Boolean expected hai.
z.string().min(1)-> String empty nahi honi chahiye.
z.string().url() -> Valid URL format expected hai.


5. HAR ENVIRONMENT VARIABLE KA PURPOSE

NODE_ENV:
Application ka environment batata hai.
development = Local development
test        = Automated testing
production  = Production deployment

z.enum() sirf allowed values accept karta hai.
.default("development") missing value par default deta hai.

PORT:
Backend server kis port par listen karega, ye batata hai.

z.coerce.number() input ko number mein convert karne ki
koshish karta hai.
.int() integer enforce karta hai.
.positive() zero se bada number enforce karta hai.
.max(65535) valid TCP port range ki upper limit enforce karta hai.
.default(5000) missing value par 5000 use karta hai.

MONGO_URI:
MongoDB connection URI store karta hai.

z.string().min(1) ensure karta hai ki value empty na ho.
Lekin ye guarantee nahi deta ki MongoDB server running hai
ya connection successful hoga.

JWT_SECRET:
JWT signing aur verification mein use hone wala secret hai.

.min(16) minimum 16 characters enforce karta hai.
Sirf length se secret secure hone ki guarantee nahi milti.
Production mein strong, randomly generated secret use karna
chahiye aur ise public repository mein commit nahi karna chahiye.

CLIENT_URL:
Frontend ka origin store karta hai.

Example:
http://localhost:5173

z.string().url() URL format validate karta hai.
Is value ko CORS configuration mein use kiya ja sakta hai.
Valid URL hone ka matlab ye nahi ki frontend server running hai.


6. safeParse() KYA KARTA HAI?

safeParse(process.env) actual environment variables ko
schema ke against validate karta hai.

Iske do possible results hote hain:

SUCCESS:
- Validation pass hoti hai.
- parsedEnv.data mein validated data milta hai.
- Coercion aur default values apply ho chuki hoti hain.

FAILURE:
- parsedEnv.success false hota hai.
- parsedEnv.error mein validation details hoti hain.

safeParse() invalid input ke liye normally exception throw
karne ke bajaye result object return karta hai.

Important:
safeParse() original process.env ko modify nahi karta.
Ye validated output return karta hai.


7. process.exit(1) KYUN USE KIYA?

Agar environment variables invalid hain, toh application
ko startup continue nahi karna chahiye.

process.exit(1) Node.js process ko non-zero exit code ke
saath terminate karta hai.

Exit code 1 generally failure indicate karta hai.

Isse invalid configuration ke saath application run hone
se bachaya ja sakta hai.

Validation errors terminal mein print karne se humein pata
chalta hai ki kaunsa variable invalid hai.


8. parsedEnv.error.flatten().fieldErrors

Ye validation errors ko field-wise organize karta hai.

Example:
MONGO_URI empty hai toh MONGO_URI se related error milega.
CLIENT_URL invalid hai toh CLIENT_URL se related error milega.

Isse debugging easier hoti hai.

Validation errors log karte waqt secrets ki actual values
ko expose nahi karna chahiye.


9. export const env = parsedEnv.data

Ye validated configuration ko doosri files mein available
karata hai.

Example:
import { env } from "./config/env.js";

env.PORT
env.MONGO_URI
env.JWT_SECRET
env.CLIENT_URL

Isse baar-baar raw process.env access karne ki zaroorat
kam hoti hai aur TypeScript ko validated types milte hain.

PORT ka type number ho sakta hai, jabki process.env.PORT
generally string | undefined hota hai.

NodeNext configuration mein relative imports ke liye
.js extension use karna appropriate hai.


10. env.ts KAB AUR KAHAAN USE HOGI?

env.ts ko application startup ke beginning mein load karna
chahiye, taaki configuration invalid hone par application
jaldi fail ho sake.

app.ts:
env.CLIENT_URL ko CORS configuration mein use karenge.

server.ts:
env.PORT se server ka port configure karenge.

Database configuration:
env.MONGO_URI se MongoDB connection establish karenge.

Authentication:
env.JWT_SECRET ko JWT signing aur verification mein use karenge.

env.ts variables ko validate karti hai; ye khud server,
database connection ya authentication implement nahi karti.


11. TYPECHECK VS RUNTIME VALIDATION

npm run typecheck:
TypeScript compiler se type errors check karta hai.

Runtime validation:
Application execute hone par env.ts actual environment
variables ko Zod schema ke against validate karti hai.

Sirf typecheck pass hone ka matlab ye nahi ki .env ki
actual values valid hain.

Actual startup verification ke liye application run karna
bhi zaroori hai.


12. FINAL SUMMARY

env.ts backend ki environment configuration ka validated
source of truth hai.

Iske main benefits:
- Missing aur invalid configuration detect karna.
- Startup par clear validation errors dena.
- PORT jaise values ko correct type mein convert karna.
- Default values provide karna.
- Type-safe configuration export karna.
- app.ts, server.ts aur doosre modules mein configuration
  ko consistent tareeke se use karna.

Remember:
Zod configuration validate karta hai.
dotenv .env values load karta hai.
env.ts validated configuration export karti hai.
=========================================================
*/
