import Fund from "../model/fundschema.js";

const insertdata=async(req,res)=>{
    let fund_id;
    let type=req.body.type;
    let amount=req.body.amount;
    let fund_name=req.body.fund_name;

    try {
        let fid=await Fund.find().count()
        if(fid==0) {
            fund_id='f01';
        }
        else{
            let fid1=await Fund.findOne().sort({fund_id:-1})
            fund_id=Number(fid1.fund_id.slice(2))+1
            fund_id='f0'+JSON.stringify(fund_id);
        }
        const edata=await Fund.findOne({fund_name:fund_name})
        if(edata) return res.send("fund name is existing")
          const data= await Fund.insertMany({
                fund_id,
                type,
                amount,
                fund_name
            })
            if(data) return res.send(data+"added")
        
    } catch (error) {
        return res.send(error.message)
    }
}

const viewfunds=async(req,res)=>{
    try {
        const data=await Fund.find()
        if(data) return res.send(data)
        return res.send('no funds founded')
    } catch (error) {
        return res.send(error.message)
    }
}

export {insertdata,viewfunds}