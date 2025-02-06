import mongoose, { Schema } from 'mongoose';



const sessionLogSchema = new Schema({
    sessionId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Session",
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: { type: Schema.Types.String, required: true },
    startDate: { type: Schema.Types.Date, required: true },
    endDate: { type: Schema.Types.Date },
    remark: { type: Schema.Types.String },
    items: [
        {
            item: {
                type: Schema.Types.String,
                
            },
            quantity: {
                type: Schema.Types.Number,
                required: true,

            },
            unitPrice:{
                type:Schema.Types.Number,
                required:true
            }
        }
    ],
    totalSessionPrice:{
        type:Schema.Types.Number
    }
});
export const SessionLog = mongoose.model('SessionLog', sessionLogSchema);

