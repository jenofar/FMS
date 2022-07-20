import env from 'dotenv/config'
import jwt from 'jsonwebtoken'

function  faculty(req,res,next){
    const token=req.header('x-auth-token')
    try {
        console.log(" ready for faculty check");
        const decoded=jwt.verify(token,''+process.env.SECRET)
        req.user=decoded;
        if(req.user.isfaculty==false) return res.send('Sorry!, Only Staff can make the changes')
        next();
    } catch (error) {
        res.status(400).send('invalid token'+error.message)
    }
}

export default faculty