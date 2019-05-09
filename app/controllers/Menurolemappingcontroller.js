const Menurolemapping = require('../models/MenuRoleMapping.js');

// Create and Save a new User
exports.create = (req, res) => {

 // Validate request
    if(!req.body.MenuId) {
        return res.status(400).send({
            message: "MenuId can not be empty"
        });
    }
    if(!req.body.RoleId) {
        return res.status(400).send({
            message: "MenuUrl can not be empty"
        });
    }
    
    // Create a User
    const menurolemapping = new MenuRoleMapping({
        MappingId:req.body.MappingId,
        RoleId: req.body.RoleId, 
        MenuId: req.body.MenuId,
        Deleted:req.body.Deleted
    });
    
   // var input = JSON.parse(JSON.stringify(data));
    // Save User in the database
    menurolemapping.save()
    .then(data => {
      //  var input = JSON.parse(JSON.stringify(data));
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Menu Master mapping."
        });
    });
};

// Retrieve and return all Users from the database.
exports.findAll = (req, res) => {
    Menurolemapping.find()
    .then(menurolemapping => {
        res.send(menurolemapping);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving menu role mapping."
        });
    });
};

// Find a single User with a Userid
exports.findOne = (req, res) => {
Menurolemapping.findById(req.params.MappingId)
    .then(menurolemapping => {
        if(!menurolemapping) {
            return res.status(404).send({
                message: "menu not found with id " + req.params.MappingId
            });            
        }
        res.send(menumaster);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Menu not found with Menuid " + req.params.MappingId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving User with userid " + req.params.MappingId
        });
    });
};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
// Validate request
    if(!req.body.MenuId) {
        return res.status(400).send({
        message: "MenuId can not be empty"
        });
    }
    if(!req.body.RoleId) {
        return res.status(400).send({
        message: "MenuUrl can not be empty"
        });
    }
    
    // Find User and update it with the request body
    Menurolemapping.findOneAndUpdate(req.params.MappingId, {
        RoleId: req.body.RoleId, 
        MenuId: req.body.MenuId,
        Deleted:req.body.Deleted
    }, {new: true})
    .then(menurolemapping => {
        if(!menurolemapping) {
            return res.status(404).send({
                message: "Menu mapping not found with Mappingid " + req.params.MappingId
            });
        }
        res.send(menurolemapping);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Menu mapping not found with Mappingid" + req.params.MappingId
            });                
        }
        return res.status(500).send({
            message: "Error updating MenuMapping with Mappingid " + req.params.MappingId
        });
    });
};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {
    Menurolemapping.findByIdAndRemove(req.params.MappingId)
    .then(menurolemapping => {
        if(!menurolemapping) {
            return res.status(404).send({
                message: "Menu mapping not found with MappingId " + req.params.MappingId
            });
        }
        res.send({message: "Menu mapping deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Menu mapping not found with MappingId " + req.params.MappingId
            });                
        }
        return res.status(500).send({
            message: "Could not delete Menu mapping with MappingId " + req.params.MappingId
        });
    });
};