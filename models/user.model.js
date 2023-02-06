const mongoose=require("mongoose")

const Createuserschema=mongoose.Schema({
    name:{type:String},
    email:{type:String},
    password:{type:String},
    role:{type:String}
    // ,enum:["customer,manager"],default:"customer"
})


const Usermodel=mongoose.model("user",Createuserschema)


module.exports={
    Usermodel
}