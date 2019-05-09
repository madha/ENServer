const UserRole = require('../models/UserRole.js');

// Create and Save a new User
exports.create = (req, res) => {

 // Validate request
    if(!req.body.UserRole) {
        return res.status(400).send({
            message: "User Role can not be empty"
        });
    }
     
    
    // Create a User
    const userrole = new UserRole({
        UserRoleId:req.body.UserRoleId,
        UserRole: req.body.UserRole, 
        UserRoleName: req.body.UserRoleName,
        Deleted:req.body.Deleted
    });
    
   // var input = JSON.parse(JSON.stringify(data));
    // Save User in the database
    userrole.save()
    .then(data => {
      //  var input = JSON.parse(JSON.stringify(data));
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User role."
        });
    });
};

// Retrieve and return all Users from the database.
exports.findAll = (req, res) => {
 UserRole.find()
    .then(userrole => {
        res.send(userrole);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single User with a Userid
exports.findOne = (req, res) => {
UserRole.findById(req.params.UserRoleId)
    .then(userrole => {
        if(!userrole) {
            return res.status(404).send({
                message: "Users not found with id " + req.params.UserRoleId
            });            
        }
        res.send(userrole);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "user not found with Userid " + req.params.UserRoleId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving User with userid " + req.params.UserRoleId
        });
    });
};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
// Validate request
    if(!req.body.UserRole) {
        return res.status(400).send({
            message: "User role can not be empty"
        });
    }
     
    // Find User and update it with the request body
    UserRole.findOneAndUpdate(req.params.UserRoleId, {
        UserRole: req.body.UserRole, 
        UserRoleName: req.body.UserRoleName,
        Deleted:req.body.Deleted
    }, {new: true})
    .then(userrole => {
        if(!userrole) {
            return res.status(404).send({
                message: "user not found with userid " + req.params.UserRoleId
            });
        }
        res.send(userrole);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with userid " + req.params.UserRoleId
            });                
        }
        return res.status(500).send({
            message: "Error updating user with userid " + req.params.UserRoleId
        });
    });
};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {
    UserRole.findByIdAndRemove(req.params.UserRoleId)
    .then(userrole => {
        if(!userrole) {
            return res.status(404).send({
                message: "User not found with userid " + req.params.UserRoleId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with userid " + req.params.UserRoleId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with userid " + req.params.UserRoleId
        });
    });
};