import mongoose from 'mongoose';
import Joi from 'joi';

const facultySchema= new mongoose.Schema({
 SID:{
    type:String
 },
 name:{
    type:String,
    required:true
 },
 email:{
    type:String,
    required:true
 },
 dept:{
    type:String,
    required:true
 },
 password:{
    type:String,
    required:true
 },
 isfaculty:{
    type:Boolean,
    default:true
 },
 isHOD:{
    type:Boolean,
    default:false
 }
})

var Faculty=mongoose.model('Faculty',facultySchema)

function validatefaculty(faculty){
    const schema={
        ID:Joi.number(),
        name:Joi.string().min(3).max(20),
        email:Joi.string().required(),
        password:Joi.string().required(),
        dept:Joi.string().required(),
        isHOD:Joi.boolean().default(false),
        isfaculty:Joi.boolean().default(true)
    }
}

export {Faculty,validatefaculty}