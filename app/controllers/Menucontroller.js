const UserRole = require('../models/MenuMaster.js');

// Create and Save a new User
exports.create = (req, res) => {

 // Validate request
    if(!req.body.Menuname) {
        return res.status(400).send({
            message: "Menuname can not be empty"
        });
    }
    if(!req.body.MenuUrl) {
        return res.status(400).send({
            message: "MenuUrl can not be empty"
        });
    }
    
    // Create a User
    const menumaster = new MenuMaster({
        MenuMasterId:req.body.MenuMasterId,
        Menuname: req.body.Menuname, 
        MenuUrl: req.body.MenuUrl,
        MenuDescription:req.body.MenuDescription,
        Deleted:req.body.Deleted
    });
    
   // var input = JSON.parse(JSON.stringify(data));
    // Save User in the database
    menumaster.save()
    .then(data => {
      //  var input = JSON.parse(JSON.stringify(data));
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Menu Master."
        });
    });
};

// Retrieve and return all Users from the database.
exports.findAll = (req, res) => {
 MenuMaster.find()
    .then(menumaster => {
        res.send(menumaster);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving menu master."
        });
    });
};

// Find a single User with a Userid
exports.findOne = (req, res) => {
MenuMaster.findById(req.params.MenuMasterId)
    .then(menumaster => {
        if(!menumaster) {
            return res.status(404).send({
                message: "menu not found with id " + req.params.MenuMasterId
            });            
        }
        res.send(menumaster);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Menu not found with Menuid " + req.params.MenuMasterId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving User with userid " + req.params.MenuMasterId
        });
    });
};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
// Validate request
if(!req.body.Menuname) {
    return res.status(400).send({
        message: "Menuname can not be empty"
    });
}
if(!req.body.MenuUrl) {
    return res.status(400).send({
        message: "MenuUrl can not be empty"
    });
}
     
    // Find User and update it with the request body
    MenuMaster.findOneAndUpdate(req.params.MenuMasterId, {
        Menuname: req.body.Menuname, 
        MenuUrl: req.body.MenuUrl,
        MenuDescription:req.body.MenuDescription,
        Deleted:req.body.Deleted
    }, {new: true})
    .then(menumaster => {
        if(!menumaster) {
            return res.status(404).send({
                message: "user not found with userid " + req.params.MenuMasterId
            });
        }
        res.send(menumaster);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with userid " + req.params.MenuMasterId
            });                
        }
        return res.status(500).send({
            message: "Error updating user with userid " + req.params.MenuMasterId
        });
    });
};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {
    MenuMaster.findByIdAndRemove(req.params.MenuMasterId)
    .then(menumaster => {
        if(!menumaster) {
            return res.status(404).send({
                message: "Menu not found with Menuid " + req.params.MenuMasterId
            });
        }
        res.send({message: "Menu deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Menu not found with Menuid " + req.params.MenuMasterId
            });                
        }
        return res.status(500).send({
            message: "Could not delete Menu with MenuID " + req.params.MenuMasterId
        });
    });
};