import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import student from './routes/student.js'
import faculty from './routes/Faculty.js'
import fund from './routes/fund.js';
import payment from './routes/payment.js'

const app=express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost/deptfinemanagement')
.then(()=>console.log('db connected'))
.catch((e)=>console.log('error'))

app.use('/api/student',student);
app.use('/api/faculty',faculty);
app.use('/api/fund',fund);
app.use('/api/payment',payment);

const port=process.env.PORT || 3002
app.listen(port,()=>{
    console.log(`server running at ${port}`);
})