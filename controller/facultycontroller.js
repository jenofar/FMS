import {Faculty,validatefaculty} from '../model/facultyschema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const insertdata=async(req,res)=>{
    validatefaculty(req.body)
    let SID;
    let name=req.body.name;
    let email=req.body.email;
    let password=req.body.password;
    let dept=req.body.dept;
    let isHOD=req.body.isHOD;
    try {
        let sid=await Faculty.find().count()
        // console.log(sid);
        if(sid==0) {
            SID=dept+'01';
            // console.log(SID);
        }
        else{
            let sid1=await Faculty.findOne().sort({SID:-1})
            SID=Number(sid1.SID.slice(4))+1
            // console.log(SID);
            SID=dept+'0'+JSON.stringify(SID);
            // console.log(SID);
        }
        const edata=await Faculty.findOne({email:email})
        if(edata) return res.send("Email is already used")
        const salt_routes=10;
        bcrypt.hash(password,salt_routes,async function(err,hash){
            const data= await Faculty.insertMany({
                SID,
                name,
                email,
                password:hash,
                dept,
                isHOD
            })
            if(data) return res.send(data+"added")
        })
    } catch (error) {
        return res.send(error.message)
    }
}

const login=async(req,res)=>{
    
    let email=req.body.email;
    let pwd=req.body.pwd;
    // console.log(email+" "+pwd);
    try {
        const data= await Faculty.findOne({email:email})
        if(data){
        bcrypt.compare(pwd,data.password,async function(err, result){
            // console.log();
            if(result==true){
                const token=jwt.sign({_id:data._id,isfaculty:data.isfaculty,isHOD:data.isHOD},''+process.env.SECRET)
                return res.header({'x-auth-token':token}).send('welcome '+data.name)
                // return res.send({'x-auth-token':token})
                // return res.send(data)
            }
            return res.send("Please enter correct id and password")
        })
    }
    else{
        return res.send("No user on that email")
    }
    } catch (error) {
       return res.send(error.message)
    }
}

export {insertdata,login}