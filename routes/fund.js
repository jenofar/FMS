import express from 'express';
import { insertdata,viewfunds} from '../controller/fundcontroller.js';
import HOD from '../middleware/HOD.js';

const route=express.Router()

route.post('/insert',HOD,insertdata);
route.get('/viewfunds',viewfunds)

export default route;