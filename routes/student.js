import express from 'express';
import { insertdata,login,updatedata,viewprof } from '../controller/studentcontroller.js';
import auth from '../middleware/auth.js'

const route=express.Router()

route.post('/register',insertdata);
route.post('/login',login);
route.put('/update',auth,updatedata);
route.get('/viewprofile',auth,viewprof);


export default route;