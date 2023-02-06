const express=require("express")
const {Usermodel}=require("../models/user.model")
const bcrypt=require("bcrypt")
var jwt=require("jsonwebtoken")
require("dotenv").config()
const userRouter=express.Router()


userRouter.get("/",async(req,res)=>
{
    try {
        res.send("user router")
    } catch (error) {
        
    }
})
userRouter.post("/signup",async(req,res)=>
{
    const {name,email,password,role}=req.body
    try {
        const existinguser=await Usermodel.find({email})
        if(existinguser.length>0)
        {
            res.send("already a user please login")
        }
        else{   
            bcrypt.hash(password,5,function (err,hash){
                if(err)
                {
                    res.send(err)
                }else{
                    const newuser=Usermodel({name,email,role,password:hash})
                    newuser.save()
                    res.send("registerd")
                }
            })
        }
       
    } catch (error) {
        res.end(error)
    }
})




userRouter.post("/login",async(req,res)=>
{
    const {email,password}=req.body
    try {
        const user =await Usermodel.find({email})
        if(user.length>0)
        {
            bcrypt.compare(password,user[0].password,function(err,result){
                if(err){
                    res.send(err)
                }else{
                    const normal_token=jwt.sign({userID:user[0]._id,role:user[0].role},process.env.normal_token)
                    const refresh_token=jwt.sign({userID:user[0]._id,role:user[0].role},process.env.refresh_token)

                    res.send({"message":"login sucessful",normal_token:normal_token,refresh_token:refresh_token})
                }
            })
        }
    } catch (error) {
            res.send(error)
    }
})

userRouter.get("/logout",(req,res)=>
{
    const token=req.headers
})




module.exports={
    userRouter
}