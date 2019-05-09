const mongoose = require('mongoose');

const MenuMasterSchema = new mongoose.Schema({
    MenuMasterId: Number,
    Menuname: String,
    MenuUrl:String,
    MenuDescription:String,
    Deleted:Boolean
}, {    
    timestamps: true
});

module.exports = mongoose.model('MenuMaster', MenuMasterSchema);