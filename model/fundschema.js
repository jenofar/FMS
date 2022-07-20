import mongoose from 'mongoose';


const fundSchema= new mongoose.Schema({
    fund_id:{
        type:String,
    },
    type:{
        type:String,
        enum:['fine','fees'],
        default:'fine'
    },
    amount:{
        type:Number,
        required:true
    },
    fund_name:{
        type:String,
        required:true
    },
    date_of_creation:{
        type:Date,
        dafault:Date.now()
    }
})

var Fund=mongoose.model('Fund',fundSchema)

export default Fund