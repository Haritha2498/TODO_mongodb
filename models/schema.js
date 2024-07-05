const {Schema}=require('mongoose');
const {model}=require('mongoose');


const tododbschema=new Schema({
    id:{type:String,required:true},
    title:{type:String,required:true},
    description:{type:String,required:true}
})
const tododbmodel=model("tododetails",tododbschema);
module.exports=tododbmodel;