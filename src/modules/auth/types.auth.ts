

// In this file we define the typescripts types for autentication input data

export interface RegisterInput {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  age: number;
}

export interface LoginInput {
  email: string;
  password: string;
}