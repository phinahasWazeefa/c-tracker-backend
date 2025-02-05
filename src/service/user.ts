
import { Item } from "../model/Item"
import { Session } from "../model/Session";
import { Return } from "../types/general";
import * as returnTypes  from "../types/returnTypes";
import * as utils from "../util/commonFns"

const ObjectId = require("mongoose").Types.ObjectId;


export const createAnItem = async ({user,itemName,itemPrice}:{user:string,itemName:string,itemPrice:number})=>{
    try {
       
        const formatString =  utils.formatString(itemName);

        const itemFromDb = await Item.findOne({name:formatString});
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
       
        const itemsfromDb = await Item.find({user:user});
       
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
            name: new Date().toISOString(),
            startDate: new Date(),
        });

        const savedSession = await sessionObj.save();

        return { statusCode: 200, message: "New session created", sessionId: savedSession._id };

    } catch (error) {
        throw error;
    }
};

export const getSessionOfAUser  = async ({ user }: { user: string }): Promise<returnTypes.NewSessionCreatedReturn> => {
    try {
        const sessionFromDb = await Session.findOne({ user: user, status: 'open' },{_id:1});
        if (!sessionFromDb) {
            return { statusCode: 409, message: "There is no live session going on" };
        }

        return { statusCode: 200, sessionId: sessionFromDb._id };

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

       let user = '67a1c94b472303afea480d86';
        console.log(user,sessionId)
        const sessionFromDb = await Session.findOne({user:new ObjectId(user),_id:new ObjectId(sessionId)},{_id:1});
        console.log(sessionFromDb)
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