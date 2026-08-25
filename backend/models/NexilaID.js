const mongoose = require("mongoose");


const NexilaIDSchema = new mongoose.Schema(
{
    // Generated Nexila ID
    nexilaID:{
        type:String,
        required:true,
        unique:true,
        index:true
    },


    // Sequence number globally running
    sequence:{
        type:Number,
        required:true,
        unique:true
    },

    // Lead reference
    leadId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Lead",
        required:true,
        unique:true
    },


    // Student after conversion
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        default:null
    },


    // Date when generated
    generatedDate:{
        type:String,
        required:true
    }

},
{
    timestamps:true
});


module.exports = mongoose.model(
    "NexilaID",
    NexilaIDSchema
);