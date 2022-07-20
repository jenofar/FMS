import mongoose from 'mongoose';
import Joi from 'joi'

const studentSchema= new mongoose.Schema({
    register_no:{
        type:String,
    },
    name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:15
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    course:{
        type:String,
        required:true
    },
    batch:{
        type:String,
        required:true
    },
    section:{
        type:String,
        required:true
    },
    dept:{
        type:String,
        required:true
    },
    date_of_registration:{
        type:Date,
        default:Date.now()
    },
    isfaculty:{
        type:Boolean,
        default:false
    },
    isHOD:{
        type:Boolean,
        default:false
    }
})

var Student=mongoose.model('Student',studentSchema)

function validatestudent(student){
    const schema={
        name:Joi.string().min(3).max(20),
        email:Joi.string().required(),
        password:Joi.string().required(),
        batch:Joi.string(),
        dept:Joi.string(),
        section:Joi.string(),
        isfaculty:Joi.boolean().default(false),
        isHOD:Joi.boolean().default(false)
    }
}


export  {Student,validatestudent}