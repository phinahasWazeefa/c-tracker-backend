import { User } from "../model/User"
import { Return } from "../types/general";
import { CreateUser } from "../types/userTypes"

export const createUser = async ({name,email,password}:CreateUser):Promise<Return>=>{
    try {

        const userObj = new User({
            email:email,
            name:name,
            password:password
        })

       await userObj.save();

       return {statusCode:200,message:"User Created"}

        
    } catch (error) {
        throw error
    }
}