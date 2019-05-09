const mongoose = require('mongoose');

const MenuRoleMappingSchema = new mongoose.Schema({
    MappingId: Number,
    MenuId: String,
    RoleId:String,
    Deleted:Boolean
}, {    
    timestamps: true
});

module.exports = mongoose.model('MenuRoleMapping', MenuRoleMappingSchema);