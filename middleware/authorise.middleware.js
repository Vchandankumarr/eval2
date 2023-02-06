


const authorise=(role_array)=>
{
    return (req,res,next)=>
    {
        const user_role=req.body.userrole
        if(role_array.includes(user_role))
        {
            console.log(user_role)
            next()
        }
        else{
            res.send("you are not authorised")
        }
    }
}

module.exports={
    authorise
}