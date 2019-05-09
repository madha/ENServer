const Instance = require('../models/Instance.js');

// Create and Save a new User
exports.create = (req, res) => {

 // Validate request
    if(!req.body.InstanceName) {
        return res.status(400).send({
            message: "Instance Name can not be empty"
        });
    }
    if(!req.body.CustomerId) {
        return res.status(400).send({
            message: "CustomerId can not be empty"
        });
    }
    if(!req.body.CustomerName) {
        return res.status(400).send({
            message: "CustomerId can not be empty"
        });
    }
    // Create a User
    const instance = new Instance({
        InstanceId:req.body.InstanceId,
        InstanceName: req.body.InstanceName, 
        CustomerId: req.body.CustomerId,
        CustomerName:req.body.CustomerName,
        HeaderLogo: req.body.HeaderLogo,
        footerText:req.body.footerText,
        Clientlogo:req.body.Clientlogo,
        Deleted:req.body.Deleted
    });
    
   // var input = JSON.parse(JSON.stringify(data));
    // Save User in the database
    instance.save()
    .then(data => {
      //  var input = JSON.parse(JSON.stringify(data));
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Instance."
        });
    });
};

// Retrieve and return all Users from the database.
exports.findAll = (req, res) => {
    Instance.find()
    .then(instance => {
        res.send(instance);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Instance."
        });
    });
};

// Find a single User with a Userid
exports.findOne = (req, res) => {
Instance.findById(req.params.InstanceId)
    .then(instance => {
        if(!instance) {
            return res.status(404).send({
                message: "Instance not found with id " + req.params.InstanceId
            });            
        }
        res.send(instance);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Instance not found with Instanceid " + req.params.InstanceId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving instance with instanceid " + req.params.InstanceId
        });
    });
};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
// Validate request
if(!req.body.InstanceName) {
    return res.status(400).send({
        message: "Instance Name can not be empty"
    });
}
if(!req.body.CustomerId) {
    return res.status(400).send({
        message: "CustomerId can not be empty"
    });
}
if(!req.body.CustomerName) {
    return res.status(400).send({
        message: "CustomerId can not be empty"
    });
}
    
    // Find User and update it with the request body
    Instance.findOneAndUpdate(req.params.InstanceId, {
        InstanceName: req.body.InstanceName, 
        CustomerId: req.body.CustomerId,
        CustomerName:req.body.CustomerName,
        HeaderLogo: req.body.HeaderLogo,
        footerText:req.body.footerText,
        Clientlogo:req.body.Clientlogo,
        Deleted:req.body.Deleted
    }, {new: true})
    .then(instance => {
        if(!instance) {
            return res.status(404).send({
                message: "Instance not found with Instance Id " + req.params.InstanceId
            });
        }
        res.send(instance);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Instance not found with Instanceid" + req.params.InstanceId
            });                
        }
        return res.status(500).send({
            message: "Error updating Instance with Instanceid " + req.params.InstanceId
        });
    });
};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {
    Instance.findByIdAndRemove(req.params.InstanceId)
    .then(instance => {
        if(!instance) {
            return res.status(404).send({
                message: "Instance not found with Instanceid  " + req.params.InstanceId
            });
        }
        res.send({message: "Instance deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Instance not found with InstanceId " + req.params.InstanceId
            });                
        }
        return res.status(500).send({
            message: "Could not delete Instance with Instanceid " + req.params.InstanceId
        });
    });
};