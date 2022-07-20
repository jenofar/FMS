import Payment from "../model/paymentschema.js";
import { Student } from "../model/studentschema.js";
import Fund from "../model/fundschema.js"; 
import {Faculty} from '../model/facultyschema.js'


const insertdata=async(req,res)=>{
    let payment_id;
    let student=req.body.student;
    let fund=req.body.fund;
    let faculty_id=req.user._id
    if(req.user.isHOD==true)return res.send('Hods not allowed to add payment')

    try {
        let pid=await Payment.find().count()
        if(pid==0) {
            payment_id='p01';
        }
        else{
            let pid1=await Payment.findOne().sort({payment_id:-1})
            payment_id=Number(pid1.payment_id.slice(2))+1
            payment_id='p0'+JSON.stringify(payment_id);
        }
        const stu=await Student.findOne({register_no:student})
        if(!stu)return res.send('invalid register no')
        const fid=await Fund.findOne({fund_id:fund})
        if(!fid)return res.send('invalid fund id')
        const data= await Payment.insertMany({
            payment_id,
            student_id:stu._id,
            fund_id:fid._id,
            faculty_id,
        })
        if(data) return res.send(data+"added")
    } catch (error) {
        return res.send(error.message)
    }
}

const updatedata=async(req,res)=>{
    let payment_id=req.body.payment_id;
    let pstatus;
    let date_of_payment=new Date(req.body.date);
    let paid_amount=req.body.amount;
    if(req.user.isHOD==true)return res.send('Hods not allowed to update payment')

    try {
        const edata=await Payment.findOne({payment_id:payment_id})
        if(!edata)return res.send('invalid payment id')
        if(edata.status=='paid')return res.send('already paid')
        const fdata=await Fund.findOne({_id:edata.fund_id})
        if(!fdata)return res.send('we have no data on that fund')
        let amnt=edata.paid_amount+paid_amount;
        // console.log(amnt+''+fdata.amount);
        if(amnt>fdata.amount)return res.send('you have pay only '+(fdata.amount-edata.paid_amount))
        if(amnt==fdata.amount) pstatus='paid'
        else pstatus='pending'
        const data=await Payment.updateOne({payment_id:payment_id},{
            $set:{
                status:pstatus,
                date_of_payment,
                paid_amount:amnt,
            }
        })
        if(data)return res.send(data+'updated')
        return res.send('Sorry! unable to update')
    } catch (error) {
        return res.send(error.message)
    }
}
const bulkentry=async(req,res)=>{
    let course=req.body.course;
    let faculty_id=req.user._id;
    let fund=req.body.fund;
    let payment_id;
    let stu_ids=[];
    try {
        const stu=await Student.find({course:course},{_id:1})
        if(stu.length<=0)return res.send('data not available')
        // return res.send(typeof(stu))
        stu.forEach(item=>{
            stu_ids.push(item._id)
        })
        const fid=await Fund.findOne({fund_id:fund})
        if(!fid)return res.send('invalid fund id')
        async function paymentid(){
            let pid=await Payment.find().count()
            if(pid==0) {
               payment_id='p01';
            }
            else{
                let pid2=await Payment.findOne().sort({payment_id:-1})
                payment_id=Number(pid2.payment_id.slice(2))+1
                payment_id='p0'+JSON.stringify(payment_id);
            }
            return payment_id
            
        }
        async function updatefees(item){
        const data= await Payment.insertMany({
            payment_id,
            student_id:item,
            fund_id:fid._id,
            faculty_id,
        })
        if(data) return console.log(data+'added')
       
        }
        let result;
        for(let i=0;i<stu_ids.length;i++){
            let pid=await Payment.find().count()
            if(pid==0) {
               payment_id='p01';
            }
            else{
                let pid2=await Payment.findOne().sort({payment_id:-1})
                payment_id=Number(pid2.payment_id.slice(2))+1
                payment_id='p0'+JSON.stringify(payment_id);
            }
            
                result=updatefees(stu_ids[i])
        }                                                                                       
        return res.send('payment added for '+stu_ids.length)
    } catch (error) {
        return res.send(error.message)
    }
}

const viewmypayment=async(req,res)=>{
    try {
        
        const data=await Payment.find({student_id:req.user._id}).populate([{path:'student_id',select:'name'},{path:'faculty_id',select:'name'},{path:'fund_id'}])
        if(data.length==0)return res.send('no Payment for u')
        let count=data.length;
        const paidcount=await Payment.find({$and:[{student_id:req.user._id},{status:'paid'}]}).count()
        const pendingcount=await Payment.find({$and:[{student_id:req.user._id},{status:'pending'}]}).count()
        const unpaidcount=await Payment.find({$and:[{student_id:req.user._id},{status:'not paid'}]}).count()
        // const totalfund=await Payment.aggregate([{
        //     $lookup:{
        //         from:'funds',
        //         localField:'fund_id',
        //         foreignField:'_id',
        //         as:'fund'
        //     }
        // },{
        //     $unwind:"$fund"
        // },{
        //     $match:{
        //         'fund._id':req.user._id
        //     }
        // },{
        //     $group:{_id:'',tot:{$sum:'fund.amount'}}
        // }])
        // console.log(totalfund);
        return res.send(` Your Total Payment count is  ${count} , paicount is ${paidcount} , pending is ${pendingcount}, unpaid is ${unpaidcount}  `+ data)
    } catch (error) {
        return res.send(error.message)
    }
}
const getpaymentbystudent=async (req,res)=>{
    let register_no=req.body.register_no;
    try {
        const stu=await Student.findOne({register_no:register_no})
        if(!stu)return res.send('invalid register no')
        const data=await Payment.find({student_id:stu._id}).populate([{path:'student_id',select:'name'},{path:'faculty_id',select:'name'},{path:'fund_id'}])
        if(data.length==0)return res.send('no payment for this student')
        return res.send(data)
    } catch (error) {
        return res.send(error.message)
    }
}
const getpaymentbyfaculty=async(req,res)=>{
    let SID=req.body.sid;
    try {
        const staff=await Faculty.findOne({SID:SID})
        if(!staff)return res.send('invalid Staff id')
        const data=await Payment.find({faculty_id:staff._id}).populate([{path:'student_id',select:'name'},{path:'faculty_id',select:'name'},{path:'fund_id'}])
        if(data.length==0)return res.send('no payment made by the staff')
        return res.send(data)

    } catch (error) {
        return res.send(error.message)
    }
}
const getpaymentbytype=async (req,res)=>{
    let type=req.body.type
    let result=[];
    try {
        const data=await Payment.aggregate([
            {
                $lookup:{
                    from:'funds',
                    localField:'fund_id',
                    foreignField:'_id',
                    as:'fund_type'
                }
            },{
                $unwind:"$fund_type"
            },{
                $match:{
                    'fund_type.type':type
                }
            }
        ])
        
        if(data)return res.send(data)

        return res.send(result)
       
    } catch (error) {
        return res.send(error.message)
    }
}
const getpaymentbydept= async (req,res)=>{
    let dept=req.body.dept;
    try {
        const data=await Payment.aggregate([
            {
                $lookup:{
                    from:'students',
                    localField:'student_id',
                    foreignField:'_id',
                    as:'stu'
                }
            },{
                $unwind:"$stu"
            },{ 
                $match:{
                    'stu.dept':dept
                }
            }
        ])
        if(data)return res.send(data)

        return res.send(result)
    } catch (error) {
        
    }
}
const paymentstatus=async(req,res)=>{
    let status=req.body.status
    try {
        const data=await Payment.find({status:status})
        if(data)return res.send(data)
        return res.send("no payments on that status")
    } catch (error) {
        return res.send(error.message)
    }
}
const gettotalfund=async(req,res)=>{
    let funds=0;
    try {
        const data=await Payment.find({},{fund_id:1,_id:0}).populate({path:'fund_id',select:'amount',model:'Fund'})
        if(data.length<=0)return res.send('no data found')
        data.forEach(item=>{
            funds +=item.fund_id.amount
            
        })
        return res.send('Total Fund is ' + funds)
    } catch (error) {
        return res.send(error.message)
    }
    // try {
    //     const data=await Payment.aggregate([{$group:{_id:'',totfee:{$sum:'$fee_amount'}}}])
    //     if(data)return res.send(data)
    //     return res.send("not working")
    // } catch (error) {
    //     return res.send(error.message)
    // }
}

const getbydate=async (req,res)=>{
    let date=req.body.date
    try {
        const data=await Payment.find({date_of_payment:{$ne:null}}).where('date_of_payment').equals(new Date(date))
        if(data.length==0)return res.send('no payment on that date')
        // console.log((JSON.stringify(data[0].date_of_payment).slice(1,11))+' '+date);
        return res.send(data);
    } catch (error) {
        return res.send(error.message)
    }
}

export {insertdata,updatedata,gettotalfund,bulkentry,viewmypayment,paymentstatus,getpaymentbystudent,getpaymentbyfaculty,getpaymentbytype,getbydate,getpaymentbydept}