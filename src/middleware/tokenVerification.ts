import {Request,Response,NextFunction} from 'express'
const jwt = require('jsonwebtoken')

import *as userHelper from '../service/auth'

import {ApiError} from '../util/ApiError'



export const isUser = async (req:Request, res:Response, next:NextFunction) => {
    try {
      console.log(req.url)
      const authHeader = req.get("Authorization");
      console.log(authHeader)
      if (!authHeader) {
        throw new ApiError("Not authenticated",400)
    
      }
      let decodedToken = jwt.verify(authHeader, "10958");
      const response = await userHelper.isUserVerification(decodedToken);
      if (response.statusCode != 200) {
        throw new ApiError(response.message,400)
      } else {
        req.body.user = decodedToken.user;
        next();
      }
    } catch (error:any) {
      next(error);
    }
  };