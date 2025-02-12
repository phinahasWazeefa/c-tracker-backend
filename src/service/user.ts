
import { Item } from "../model/Item"
import { Session } from "../model/Session";
import { SessionLog } from "../model/SessionLog";
import { Return } from "../types/general";
import * as returnTypes  from "../types/returnTypes";
import * as utils from "../util/commonFns"

const ObjectId = require("mongoose").Types.ObjectId;


export const createAnItem = async ({user,itemName,itemPrice}:{user:string,itemName:string,itemPrice:number})=>{
    try {
       
        const formatString =  utils.formatString(itemName);

        const itemFromDb = await Item.findOne({name:formatString,user:new ObjectId(user)});
        if(itemFromDb)
        return {statusCode:409,message:"Item already exists"}

        const itemObj = new Item({
            name:formatString,
            price:itemPrice,
            user:user
        })

       let item = await itemObj.save();

        return {statusCode:200,message:"Item Created",item:item}

       
    } catch (error) {
        throw error
    }
}

export const getItems = async ({user}:{user:string}):Promise<returnTypes.ItemsReturn>=>{
    try {
      
        const itemsfromDb = await Item.find({user:new ObjectId(user)});
        
       
        return {statusCode:200,items:itemsfromDb}
       
    } catch (error) {
        throw error
    }
}

export const createASession = async ({ user }: { user: string }): Promise<returnTypes.NewSessionCreatedReturn> => {
    try {
        const sessionFromDb = await Session.findOne({ user: user, status: 'open' });
        if (sessionFromDb) {
            return { statusCode: 409, message: "There is a live session going on" };
        }

        const sessionObj = new Session({
            user: user,
            name: utils.formatDateToYYYYMMDDHHMMSS(new Date()),
            startDate: new Date(),
        });

        const savedSession = await sessionObj.save();

        return { statusCode: 200, message: "New session created", sessionId: savedSession._id, sessionName:savedSession.name };

    } catch (error) {
        throw error;
    }
};

export const getSessionOfAUser  = async ({ user }: { user: string }): Promise<returnTypes.NewSessionCreatedReturn> => {
    try {
        const sessionFromDb = await Session.findOne({ user: user, status: 'open' },{_id:1,name:1});
        if (!sessionFromDb) {
            return { statusCode: 409, message: "There is no live session going on" };
        }

        return { statusCode: 200, sessionId: sessionFromDb._id, sessionName:sessionFromDb.name };

    } catch (error) {
        throw error;
    }
};

export const addExepnse = async ({user,sessionId,itemId,quantity}:{user:string,sessionId:string,itemId:string,quantity:number})=>{
    try {

        const sessionFromDb = await Session.findOne({_id:sessionId,status:"open",user:user});
        if(!sessionFromDb) return {statusCode:409,message:"No session found"}

        await Session.updateOne(
            { _id: sessionId },
            {
                $push: {
                    items: {
                        date:new Date(),
                        item: itemId,
                        quantity: quantity
                    }
                }
            }
        );

        return {statusCode:200,message:"Item added"}

        
    } catch (error) {
        throw error;
    }
}


export const getASessionExpense = async({user,sessionId}:{user:string,sessionId:string})=>{
    try {

        const sessionFromDb = await Session.findOne({user:new ObjectId(user),_id:new ObjectId(sessionId)},{_id:1});
      
        if(!sessionFromDb) return{statusCode:409,message:"No session found"}

        const sessionsDetails = await Session.aggregate([
            {
                $match: { _id: new ObjectId(sessionId) } // Filter session by ID
            },
            {
                $unwind: "$items" // Deconstruct the items array
            },
            {
                $lookup: {
                    from: "items", // Reference Item collection
                    localField: "items.item",
                    foreignField: "_id",
                    as: "itemDetails"
                }
            },
            {
                $unwind: "$itemDetails" // Extract item details from array
            },
            {
                $addFields: {
                    "items.name": "$itemDetails.name",
                    "items.price": { $multiply: ["$items.quantity", "$itemDetails.price"] } // Calculate total price per item
                }
            },
            {
                $group: {
                    _id: "$_id",
                    startDate: { $first: "$startDate" },
                    endDate: { $first: "$endDate" },
                    remark: { $first: "$remark" },
                    status: { $first: "$status" },
                    items: { $push: "$items" }, // Rebuild the items array
                    totalSessionPrice: { $sum: "$items.price" } // Sum up the total session price
                }
            }
        ]);
        
       
        if(sessionsDetails.length == 0) 
        return {statusCode:409,message:"no data found"}
        return {statusCode:200,sessionDetails:sessionsDetails[0]}
        
        

        
    } catch (error) {
        throw error
    }
}

export const closeASession = async ({user,sessionId}:{user:string,sessionId:string})=>{
    try {

        const sessionFromDb = await Session.findOne({_id:new ObjectId(sessionId),status:"open"});
        if(!sessionFromDb)
            return {statusCode:409,message:"No session found"}

        sessionFromDb.status = "closed";
        sessionFromDb.endDate = new Date();

        await sessionFromDb.save();
        
        const sessionsDetails = await Session.aggregate([
            {
                $match: { _id: new ObjectId(sessionId) } // Filter session by ID
            },
            {
                $unwind: "$items" // Deconstruct the items array
            },
            {
                $lookup: {
                    from: "items", // Reference Item collection
                    localField: "items.item",
                    foreignField: "_id",
                    as: "itemDetails"
                }
            },
            {
                $unwind: "$itemDetails" // Extract item details from array
            },
            {
                $group: {
                    _id: {
                        sessionId: "$_id",
                        itemName: "$itemDetails.name" // Group by sessionId and item name
                    },
                    quantity: { $sum: "$items.quantity" }, // Sum the quantity
                    unitPrice: { $first: "$itemDetails.price" }, // Get unit price
                }
            },
            {
                $addFields: {
                    price: { $multiply: ["$quantity", "$unitPrice"] } // Calculate total price per item
                }
            },
            {
                $group: {
                    _id: "$_id.sessionId",
                    items: {
                        $push: {
                            item: "$_id.itemName",
                            quantity: "$quantity",
                            unitPrice: "$unitPrice",
                            price: "$price"
                        }
                    },
                    totalSessionPrice: { $sum: "$price" } // Calculate total session price
                }
            },
            {
                $addFields: {
                    name:sessionFromDb.name,
                    sessionId:sessionFromDb._id,
                    user:sessionFromDb.user,
                    startDate: sessionFromDb.startDate,
                    endDate: sessionFromDb.endDate,
                    remark: sessionFromDb.remark,
                    status: sessionFromDb.status,
                  
                }
            }
        ]);

       

        const sessionLogObj = new SessionLog({
            user:sessionsDetails[0].user,
            sessionId:sessionsDetails[0]._id,
            name:sessionsDetails[0].name,
            startDate:sessionsDetails[0].startDate,
            endDate:sessionsDetails[0].endDate,
            remark:sessionsDetails[0].remak,
            items:sessionsDetails[0].items,
            totalSessionPrice:sessionsDetails[0].totalSessionPrice
        })

        await sessionLogObj.save()

        return {statusCode:200,message:"success"}

        
    } catch (error) {
        throw error
    }
}


export const getSessions = async ({user}:{user:string})=>{
    try {
        
        const sessionLogFromDb = await SessionLog.find({user:new ObjectId(user)},{_id:1,endDate:1,startDate:1,name:1,totalSessionPrice:1});
        if(sessionLogFromDb.length == 0) return {statusCode:409,message:"No sessions found"}
        return {statusCode:200,sessions:sessionLogFromDb}


    } catch (error) {
        throw error;
    }
}

export const getASessionBill = async({user,sessionLogId}:{user:string,sessionLogId:string})=>{
    try {

        const sessionFromDb = await SessionLog.findOne({_id:new ObjectId(sessionLogId)},{user:0,sessionId:0});
        if(!sessionFromDb) return{statusCode:409,message:"No session found"}
        return {sessionBill:sessionFromDb,statusCode:200}
        
    } catch (error) {
        throw error
    }
}