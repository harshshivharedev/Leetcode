
import bcrypt from "bcryptjs";
import { ApiError } from "../../common/errors/apiErrors.js";
import { User } from "../users/user.models.js"
import { LoginInput, RegisterInput } from "./types.auth.js"
import jwt from "jsonwebtoken"  
import { env } from "../../config/env.js";

                                  // data <-- req.body throw controller
export const registerUser = async (data: RegisterInput) => {
    const { email, username, password } = data;

    // check existing user 
    const existingUser = await User.findOne({
        $or: [{email}, { username }]
    })
    
    if(existingUser) {
        throw new ApiError(409, "Email or username is already registered");
    }

    // password hash
    const hashedPassword = await bcrypt.hash(password, 12);


    // user create , password replace with hashed password 
    const createdUser = await User.create({
        ...data,
        password: hashedPassword,
    })

    const userObject = createdUser.toObject();

    // remove password from return object
    const {password: _password, ...safeUser} = userObject;

    return safeUser;
}

// Login Service

export const loginUser = async (data: LoginInput) => {
    const {email, username, password} = data;

    const user = await User.findOne({
        $or: [{email}, {username}]
    }).select("+password");

    if(!user){
        throw new ApiError(401, "Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(
        password,
        user.password
    );

    if(!isValidPassword) {
        throw new ApiError(401, "Invalid credential");
    }

    const accessToken = jwt.sign(
        {
            userId: user._id.toString(),
        },
        env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    )
    const userObject = user.toObject();

    const {password: _password, ...safeUser} = userObject

    return {
        accessToken,
        user: safeUser
    }
}





// async handler not used in services , its use in controllers
// all fields pass in service in data throw controller , controller has req.body for fields
