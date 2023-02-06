const express=require("express")
const { connection } = require("./config/db")
const { userRouter } = require("./routees/userRouter")
const {Usermodel}=require("./models/user.model")
const {authentication}=require("./middleware/authentication.middleware")
const {authorise}=require("./middleware/authorise.middleware")

const bcrypt=require("bcrypt")
var jwt=require("jsonwebtoken")
const fs=require("fs")
require("dotenv").config()
const app=express()



app.use(express.json())



app.get("/",(req,res)=>
{
    res.send("home page")
    
})

// app.use("/users",userRouter)

app.post("/signup",async(req,res)=>
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

app.post("/login",async(req,res)=>
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
                    const normal_token=jwt.sign({userID:user[0]._id,role:user[0].role},process.env.normal_token,{expiresIn:"1min"})
                    const refresh_token=jwt.sign({userID:user[0]._id,role:user[0].role},process.env.refresh_token,{expiresIn:"7min"})

                    res.send({"message":"login sucessful",normal_token:normal_token,refresh_token:refresh_token})
                }
            })
        }
    } catch (error) {
            res.send(error)
    }
})

app.get("/goldrate",authentication,async(req,res)=>
{
    try {
        res.send("goldrate")
    } catch (error) {
        res.send(error)
    }
})

app.get("/userstats",authentication,authorise(["manager"]),async(req,res)=>
{
    try {
        res.send("userstats")
    } catch (error) {
        
    }
})


app.get("/getnewtoken",(req,res)=>
{
    const refresh_token=req.headers.authorization
    if(!refresh_token)
    {
        res.send("please login")
    }
    else{
        jwt.verify(token, process.env.refresh_token, function (err, decoded)
        {
            if(err){
                res.send("please login")
            }else{
                const normal_token=jwt.sign({userID:user[0]._id,role:user[0].role},process.env.normal_token)
                res.send({"message":"login sucessful",normal_token:normal_token,refresh_token:refresh_token})
            }
            
        })
        
    }
})

app.get("/logout",authentication,(req,res)=>
{
    const token=req.headers.authorization
    const blacklisttoken=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
    blacklisttoken.push(token)
    fs.writeFileSync("./blacklist.json",JSON.stringify(blacklisttoken))
    res.send("logout")
})




app.listen(process.env.port,async()=>
{
    try {
        await connection
        console.log("connected to data base")
        console.log("server is running in port ")
    } catch (error) {
        console.log(error)
    }
})