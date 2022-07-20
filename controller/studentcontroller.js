import { Student,validatestudent } from "../model/studentschema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const insertdata=async(req,res)=>{
    validatestudent(req.body);
    let register_no;
    let name=req.body.name;
    let email=req.body.email;
    let password=req.body.password;
    let course=req.body.course;
    let batch=req.body.batch;
    let section=req.body.section;
    let dept=req.body.dept;


    try {
        let reg=await Student.find().count()
        console.log(reg);
        if(reg==0) {
            // console.log('if');
            register_no=batch.toString()+'01'}
        else{
            // console.log('else');
            let reg1=await Student.findOne().sort({register_no:-1})
            register_no=Number(reg1.register_no)+1
            // console.log(register_no);
        }
        
        const edata=await Student.findOne({email:email})
        if(edata) return res.send("Email is already used")
        const salt_routes=10;
        bcrypt.hash(password,salt_routes,async function(err,hash){
            const data= await Student.insertMany({
                register_no:JSON.stringify(register_no),
                name,
                email,
                password:hash,
                course,
                batch,
                section,
                dept
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
        const data= await Student.findOne({email:email})
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

const updatedata=async(req,res)=>{
    let name=req.body.name;
    try {
        console.log(req.user._id);
        const data=await Student.findById(req.user._id)
        
        
            const udata=await Student.updateOne({email:data.email},{
                $set:{name:name}
           
            })
            if(udata) return res.send("update"+udata)
       
        if(data)return res.send(data)
    } catch (error) {
        return res.send(error.message)
    }
}

const viewprof=async(req,res)=>{
    let stu_id=req.user._id;
    try {
        const data=await Student.findOne({_id:stu_id},{password:0})
        if(data) return res.send(data);
        return res.send('No data')
    } catch (error) {
        return res.send(error.message)
    }

}


export {insertdata,login,updatedata,viewprof}