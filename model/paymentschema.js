import mongoose from 'mongoose';


const paymentSchema= new mongoose.Schema({
    payment_id:{
        type:String,
        unique:true
    },
    student_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student',
        required:true
    },
    fund_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Fund',
        required:true
    },
    faculty_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Faculty',
        required:true
    },
    Date_of_fine:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:String,
        enum:['paid','not paid','pending'],
        default:'not paid'
    },
    date_of_payment:{
        type:Date,
        default:null
    },
    paid_amount:{
        type:Number,
        default:0
    }
})

var Payment=mongoose.model('Payment',paymentSchema)

export default Payment