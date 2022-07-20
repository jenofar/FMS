import express from 'express'
import { insertdata,updatedata,gettotalfund,bulkentry,viewmypayment,paymentstatus,getpaymentbystudent,getpaymentbyfaculty,getpaymentbytype,getbydate,getpaymentbydept} from '../controller/paymentcontroller.js'
import faculty from '../middleware/faculty.js';
import auth from '../middleware/auth.js'

const route=express.Router()

route.post('/insert',faculty,insertdata);
route.put('/update',faculty,updatedata);
route.get('/gettotalfund',auth,gettotalfund);
route.post('/bulkentry',faculty,bulkentry);
route.get('/viewmypayment',auth,viewmypayment);
route.get('/paymentstatus',faculty,paymentstatus);
route.get('/getpaymentbystudent',faculty,getpaymentbystudent);
route.get('/getpaymentbyfaculty',faculty,getpaymentbyfaculty);
route.get('/getpaymentbytype',faculty,getpaymentbytype);
route.get('/getpaymentbydept',getpaymentbydept)
route.get('/getbydate',faculty,getbydate)

export default route;