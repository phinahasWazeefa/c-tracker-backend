import {Request,Response,NextFunction} from 'express'


import * as userService from '../service/user'


export const getUser = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        const response = await userService.getUser(req.body) 

        res.status(200).send({user:response.user})
        
    } catch (error) {
        
    }
}