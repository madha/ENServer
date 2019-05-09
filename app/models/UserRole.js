const mongoose = require('mongoose');

const UserRoleSchema = new mongoose.Schema({
    UserRoleId: Number,
    UserRole: String,
    UserRoleName:String,
     Deleted:Boolean
}, {    
    timestamps: true
});

module.exports = mongoose.model('UserRole', UserRoleSchema);