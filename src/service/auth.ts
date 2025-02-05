const jwt = require('jsonwebtoken')
import { User } from "../model/User"
import { Return } from "../types/general";
import { CreateUser } from "../types/userTypes"

export const createUser = async ({ name, email, password }: CreateUser): Promise<Return> => {
    try {

        const userObj = new User({
            email: email,
            name: name,
            password: password
        })

        await userObj.save();

        return { statusCode: 200, message: "User Created" }


    } catch (error) {
        throw error
    }
}

export const signin = async ({ email, password }: { email: string, password: string }) => {
    try {

        const userFromDb = await User.findOne({ email: email });
        if (!userFromDb) return { statusCode: 409, message: "User not found" }

        if (userFromDb.password != password)
            return { statusCode: 409, message: "Password mismatch" }

        const token = jwt.sign(
            {
                user: userFromDb._id.toString(),
            },
            "10958",
            { expiresIn: "168h" }
        );

        return {
            statusCode: 200,
            user: {
                _id: userFromDb._id,
                name: userFromDb.name
            },
            token: token,
        };

    } catch (error) {
        throw error
    }
}

export const isUserVerification = async ({ user }: { user: string }) => {
    try {

        const userFromDb = await User.findOne({ _id: user });
        if (!userFromDb) return { statusCode: 401, message: "No user found" };
        return { statusCode: 200, message:"success" };

    } catch (error) {
        throw error
    }
}

export const getUser = async ({ user }: { user: string }) => {
    try {

        const userFromDb = await User.findOne({ _id: user });
        if (!userFromDb) return { statusCode: 401, message: "No user found" };


        return {
            statusCode: 200,
            user: {

                _id: userFromDb._id,
                name: userFromDb.name,

            },
        };

    } catch (error) {
        throw error
    }
}