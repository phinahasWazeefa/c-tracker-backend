import mongoose, { Schema } from 'mongoose';



const sessionSchema = new Schema({
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
            date: {
                type: Schema.Types.Date, required: true
            },

            item: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "item",
            },
            quantity: {
                type: Schema.Types.Number,
                required: true,

            }
        }
    ],
    status: {
        type: Schema.Types.String,
        default: 'open',
        enum: ['closed', 'open']
    }
});
export const Session = mongoose.model('Session', sessionSchema);

