const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    UserId: Number,
    DisplayName: String,
    UserName:String,
    FirstName:String,
    LastName:String,
    Email:String,
    Mobile:String,
    Password:String,
    Role:Number,
    EmployeeId:String,
    profilepicture:String,
    InstanceId:Number,
    Deleted:Boolean
}, {
    timestamps: true
});
UsersSchema.virtual('UsrRole', {
    ref: 'UserRole', // The model to use
    localField: 'Role', // Find people where `localField`
    foreignField: 'UserRoleId', // is equal to `foreignField`
    justOne: false,
  options: { sort: { Role: -1 }, limit: 5 }
  });
  

module.exports = mongoose.model('Users', UsersSchema);