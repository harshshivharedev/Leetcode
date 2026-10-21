
import bcrypt from "bcryptjs";
import { ApiError } from "../../common/errors/apiErrors.js";
import { User } from "../users/user.models.js"
import { LoginInput, RegisterInput } from "./types.auth.js"
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../../common/utils/token.utils.js";


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

    const filters = [];

    if (email) filters.push({ email });
    if (username) filters.push({ username });

    const user = await User.findOne({ $or: filters }).select("+password");

    if(!user){
        throw new ApiError(401, "Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(
        password,
        user.password
    );

    if(!isValidPassword) {
        throw new ApiError(401, "Invalid credentials");
    }

   const userId = user._id.toString();

    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    user.refreshTokenHash = refreshTokenHash;
    await user.save();

    const userObject = user.toObject();

    const {
        password: _password,
        refreshTokenHash: _refreshTokenHash,
        ...safeUser
    } = userObject;

    return {
        accessToken,
        refreshToken,
        user: safeUser,
    };
}



export const refreshAccessToken = async (
    refreshToken: string,
    ) => {
        let userId: string;

        try {
            userId = verifyRefreshToken(refreshToken);
        } catch {
            throw new ApiError(401, "Invalid or expired refresh token");
        }

        const user = await User.findById(userId)
            .select("+refreshTokenHash");

        if (!user || !user.refreshTokenHash) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const isValidRefreshToken = await bcrypt.compare(
            refreshToken,
            user.refreshTokenHash,
        );

        if (!isValidRefreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const accessToken = generateAccessToken(userId);

        return accessToken;
};

export const logoutUser = async (refreshToken?: string): Promise<void> => {
    if (!refreshToken) return;

    try {
        const userId = verifyRefreshToken(refreshToken);
        const user = await User.findById(userId).select("+refreshTokenHash");

        if (user) {
            user.refreshTokenHash = null;
            await user.save();
        }
    } catch {
        // Logout should remain successful even if the token is expired/invalid.
    }
};





// async handler not used in services , its use in controllers
// all fields pass in service in data throw controller , controller has req.body for fields
