
import bcrypt from "bcryptjs";
import { ApiError } from "../../common/errors/apiErrors.js";
import { User } from "../users/user.models.js"
import { RegisterInput } from "./types.auth.js";
                                    
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





// async handler not used in services , its use in controllers
// all fields pass in service in data throw controller , controller has req.body for fields
