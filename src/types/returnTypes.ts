import { Types } from "mongoose";

import {Return, StatusCodes} from './general'


export interface conflictReturn {
    statusCode:StatusCodes,
    message:string
}

export interface ItemsReturn extends Return {
    items: {
        user?: Types.ObjectId | string; // ✅ Allow both ObjectId and string
        _id: Types.ObjectId;
        name: string;
        price: number;
        __v: number;
    }[];
}

export interface NewSessionCreatedReturn extends Return {
    sessionId?:Types.ObjectId | string
    
}