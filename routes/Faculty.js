import express from 'express';
import { insertdata,login } from '../controller/facultycontroller.js';
import auth from '../middleware/auth.js';
import faculty from '../middleware/faculty.js';
import HOD from '../middleware/HOD.js';

const route=express.Router()

route.post('/register',HOD,insertdata);
route.post('/login',login);

export default route;