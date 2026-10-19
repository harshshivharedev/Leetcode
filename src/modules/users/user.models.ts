
import {
    Schema,
    Types,
    model
} from "mongoose";


/*
  User ke allowed roles.

  Public registration ke time role normally "user" rahega.
  "admin" role future me protected admin operation se assign karenge.
*/

export type UserRole = "user" | "admin";



/*
  IUser database me User document ke fields ka TypeScript structure hai.

  Ye interface sirf TypeScript ko batata hai ki User object me
  kaun-kaun se fields aur unke types honge.
*/
export interface Iuser {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    age: number;
    role: UserRole;
    problemSolved: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema (
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minlength: 3,
            maxlength: 20,
        },

        lastName: {
            type: String,
            required: [true,"Last name is required"],
            trim: true,
            minlength: 3,
            maxLength: 20,
        },

        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minLength: 3,
            maxLength: 30,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },

        age: {
            type: Number,
            required: [true, "Age is required"],
            min: 6, 
            max: 80,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        problemsSolved: [
            {
                type: Schema.Types.ObjectId,
                ref: "Problem",
            }
        ]
    },
    {
        timestamps: true
    }
)

export const User = model("User", userSchema)