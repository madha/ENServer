const Users = require('../models/Users.js');

// Create and Save a new User
exports.create = (req, res) => {

 // Validate request
    if(!req.body.UserName) {
        return res.status(400).send({
            message: "User name can not be empty"
        });
    }
     if(!req.body.Email) {
        return res.status(400).send({
            message: "User email can not be empty"
        });
    }

 if(!req.body.Password) {
        return res.status(400).send({
            message: "User Password can not be empty"
        });
    }
     if(!req.body.EmployeeId) {
        return res.status(400).send({
            message: "User EmployeeId can not be empty"
        });
    }
      if(!req.body.InstanceId) {
        return res.status(400).send({
            message: "User InstanceId can not be empty"
        });
    }
        if(!req.body.RoleId) {
        return res.status(400).send({
            message: "User RoleId can not be empty"
        });
    }
    
    // Create a User
    const user = new Users({
        UserId:req.body.UserId,
        DisplayName: req.body.DisplayName, 
        UserName: req.body.UserName,
        FirstName:req.body.FirstName,
        LastName:req.body.LastName,
        Email:req.body.Email,
        Mobile:req.body.Mobile,
        Password:req.body.Password,
        RoleId:req.body.RoleId,
        EmployeeId:req.body.EmployeeId,
        profilepicture:req.body.profilepicture,
        InstanceId:req.body.InstanceId,
        Deleted:req.body.Deleted
    });
    
   // var input = JSON.parse(JSON.stringify(data));
    // Save User in the database
    user.save()
    .then(data => {
      //  var input = JSON.parse(JSON.stringify(data));
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
};

// Retrieve and return all Users from the database.
exports.findAll = (req, res) => {
 Users.find()
    .populate({path:"Role"})
     .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single User with a Userid
exports.findOne = (req, res) => {
Users.findById(req.params.UserId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "Users not found with id " + req.params.UserId
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "user not found with Userid " + req.params.UserId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving User with userid " + req.params.UserId
        });
    });
};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
// Validate request
    if(!req.body.UserName) {
        return res.status(400).send({
            message: "User name can not be empty"
        });
    }
     if(!req.body.Email) {
        return res.status(400).send({
            message: "User email can not be empty"
        });
    }

 if(!req.body.Password) {
        return res.status(400).send({
            message: "User Password can not be empty"
        });
    }
     if(!req.body.EmployeeId) {
        return res.status(400).send({
            message: "User EmployeeId can not be empty"
        });
    }
      if(!req.body.InstanceId) {
        return res.status(400).send({
            message: "User InstanceId can not be empty"
        });
    }
        if(!req.body.UserRole) {
        return res.status(400).send({
            message: "User RoleId can not be empty"
        });
    }
    // Find User and update it with the request body
    Users.findOneAndUpdate(req.params.UserId, {
        DisplayName: req.body.DisplayName, 
        UserName: req.body.UserName,
        FirstName:req.body.FirstName,
        LastName:req.body.LastName,
        Email:req.body.Email,
        Mobile:req.body.Mobile,
        Password:req.body.Password,
        RoleId:req.body.RoleId,
        EmployeeId:req.body.EmployeeId,
        profilepicture:req.body.profilepicture,
        InstanceId:req.body.InstanceId,
        Deleted:req.body.Deleted
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "user not found with userid " + req.params.UserId
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with userid " + req.params.UserId
            });                
        }
        return res.status(500).send({
            message: "Error updating user with userid " + req.params.UserId
        });
    });
};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {
    Users.findByIdAndRemove(req.params.UserId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with userid " + req.params.UserId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with userid " + req.params.UserId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with userid " + req.params.UserId
        });
    });
};