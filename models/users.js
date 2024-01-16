const mongoose=require("mongoose"); 
const usersschema=new mongoose.Schema({
    name:"string",
    email:"string",
    password:"string",
});
const User=mongoose.model("users",usersschema);
module.exports=User;