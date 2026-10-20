export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}


/*
Middleware me hum request object par custom property add kar rahe hain:
req.user = {
  userId: decodedToken.userId,
};
Lekin Express ke default Request type ko user property ke baare me pata nahi hota. TypeScript error dega:
Property 'user' does not exist on type 'Request'
Isliye hum TypeScript ko batate hain ki Express request ke andar user bhi available hoga:

*/