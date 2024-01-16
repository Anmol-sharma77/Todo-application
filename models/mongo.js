const mongoose=require("mongoose");
module.exports.init= async function(){
    await mongoose.connect("mongodb+srv://sharmaanmol7837:123454321@cluster0.wuwgufu.mongodb.net/?retryWrites=true&w=majority");
    console.log("connected to mongodb");
} 