import {Request,Response,NextFunction} from 'express'


import * as userService from '../service/user'


export const getItems = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        const response = await userService.getItems(req.body) 

        res.status(200).send({items:response.items,message:response.message})
        
    } catch (error) {
        next(error)
    }
}

export const creatAnItem = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        const response = await userService.createAnItem(req.body) 

        res.status(200).send({message:response.message,item:response.item})
        
    } catch (error) {
        next(error)
    }
}

export const creatASesion = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        const response = await userService.createASession(req.body) ;
      
      
        res.status(response.statusCode).send({message:response.message,sessionId:response.sessionId})
        
    } catch (error) {
        next(error)
    }
}

export const getASessionOfAUser = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        const response = await userService.getSessionOfAUser(req.body) ;
       
      
        res.status(response.statusCode).send({message:response.message,sessionId:response.sessionId})
        
    } catch (error) {
        next(error)
    }
}

export const addExepnse = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        const response = await userService.addExepnse(req.body) ;
     
        res.status(response.statusCode).send({message:response.message})
        
    } catch (error) {
        next(error)
    }
}

export const getASessionExpenses = async (req:Request,res:Response,next:NextFunction)=>{
    try {

       
        req.body.sessionId = req.query.sessionId
        const response = await userService.getASessionExpense(req.body) ;
       
      
        res.status(response.statusCode).send({message:response.message,sessionDetails:response.sessionDetails})
        
    } catch (error) {
        next(error)
    }
}