import mongoose, { Schema } from 'mongoose';



const itemSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: { type: String, required: true },
    price:{type:Number,required:true}
});

export const Item = mongoose.model('Item', itemSchema);
