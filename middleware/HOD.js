import env from 'dotenv/config'
import jwt from 'jsonwebtoken'

function  HOD(req,res,next){
    const token=req.header('x-auth-token')
    try {
        console.log(" ready for HOD check");
        const decoded=jwt.verify(token,''+process.env.SECRET)
        req.user=decoded;
        if(req.user.isHOD==false) return res.send('Sorry!, Only HOD can make the changes')
        next();
    } catch (error) {
        res.status(400).send('invalid token'+error.message)
    }
}

export default HOD