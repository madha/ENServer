const mongoose = require('mongoose');

const InstanceSchema = new mongoose.Schema({
    InstanceId: Number,
    InstanceName: String,
    CustomerId:String,
    CustomerName:String,
    HeaderLogo:String,
    footerText:String,
    Clientlogo:String,
    Deleted:Boolean
}, {    
    timestamps: true
});

module.exports = mongoose.model('Instance', InstanceSchema);