import {Request,Response,NextFunction} from 'express'


import * as authService from '../service/auth'


export const createUser = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        const response = await authService.createUser(req.body) 
        res.status(response.statusCode).send({message:response.message})
        
    } catch (error) {
        next(error)
    }
}

export const signin = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        const response = await authService.signin(req.body) 
        res.status(response.statusCode).send({message:response.message,user:response.user,token:response.token})
        
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        const response = await authService.getUser(req.body) 
        res.status(response.statusCode).send({message:response.message,user:response.user})
        
    } catch (error) {
        next(error)
    }
}