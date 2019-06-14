module.exports = (app) => {
    const users = require('../controllers/Users.controller.js');
    const userrole=require('../controllers/UserRole.controller.js');
     const menumaster=require('../controllers/Menucontroller.js');
     const menumapping=require('../controllers/Menurolemappingcontroller.js');
     const instance=require('../controllers/Instancecontroller.js');
     const Dnac=require('../controllers/DnaCcontroller.js');
    // const Instance=require('../controllers/insta.js')
   //#region " user routes"
    // Create a new User
    app.post('/createUser', users.create);

    // Retrieve all Users
    app.get('/getAllUsers', users.findAll);

    // Retrieve a single User with Userid
    app.get('/getUserbyId/:UserId', users.findOne);

    // Update a User with Userid
    app.put('/UpdateUserbyId/:UserId', users.update);

    // Delete a User with Userid
    app.delete('/DeleteUserbyId/:UserId', users.delete);
    //#endregion " end user routes"
    //#region "userrolerouts"
    // Create a new Userrole
    app.post('/createUserRole', userrole.create);

    // Retrieve all Userroles
    app.get('/getAllUserRole', userrole.findAll);

    // Retrieve a single Userrole with roleid
    app.get('/getUserRolebyId/:UserRoleId', userrole.findOne);

    // Update a userRole with roleid
    app.put('/UpdateUserRolebyId/:UserRoleId', userrole.update);

    // Delete a userRole with userRoleid
    app.delete('/DeleteUserRolebyId/:UserRoleId', userrole.delete);

    //#endregion

    //#region "menumaster"
    // Create a new menumaster
    app.post('/createmenumaster', menumaster.create);

    // Retrieve all menumaster
    app.get('/getAllmenus', menumaster.findAll);

    // Retrieve a single menumaster with menumasterid
    app.get('/getMenubyId/:MenuMasterId', menumaster.findOne);

    // Update a menumaster with menumasterid
    app.put('/UpdateMenubyId/:MenuMasterId', menumaster.update);

    // Delete a menumaster with menumasterId
    app.delete('/DeleteMenubyId/:MenuMasterId', menumaster.delete);
    //#endregion

    //#region "menumaster mapping"
    // Create a new menumapping
    app.post('/createmenuMapping', menumapping.create);

    // Retrieve all menumapping
    app.get('/getAllmenumapping', menumapping.findAll);

    // Retrieve a single menumapping with menumappingid
    app.get('/getMenumappingbyId/:MenuMappingId', menumapping.findOne);

    // Update a menumapping with menumappingid
    app.put('/UpdatemappingbyId/:MenuMappingId', menumapping.update);

    // Delete a menumapping with menumappingid
    app.delete('/DeleteMappingbyId/:MenuMappingId', menumapping.delete);
    //#endregion

    //#region "Instance"
    // Create a new Instance
    app.post('/createrInstance', instance.create);

    // Retrieve all Instance
    app.get('/getAllInstance', instance.findAll);

    // Retrieve a single Instance with InstanceId
    app.get('/getInstancebyId/:InstanceId', instance.findOne);

    // Update a Instance with InstanceId
    app.put('/UpdateInstancebyId/:InstanceId', instance.update);

    // Delete a Instance with InstanceId
    app.delete('/DeleteInstancebyId/:InstanceId', instance.delete);
    //#endregion
    app.post("/getsitetopology",Dnac.getSitetopology);
    app.post("/getL2topology",Dnac.getL2topology);
    app.post("/getL3topology",Dnac.getL3topology)
    app.post("/getDeviceInfoById",Dnac.getDeviceDetailsById);
    app.post("/getLinkinformation",Dnac.getLinkInformation);
    app.post("/getSiteFilter",Dnac.getSiteFilter);
    app.post("/getdevicebytype",Dnac.getInforByType);
    app.post("/getEdgeLinkinfo",Dnac.getLinkInformationbylinkId);
    app.post("/getDevicelist",Dnac.getDeviceList);
    app.post("/getDeviceConfig",Dnac.getDeviceConfigByDeviceId);
    app.post("/getNetworkHealth",Dnac.getNetworkHealth);
    app.post("/getClientHealth",Dnac.getClientHealth);
    app.post("/complaince",Dnac.complaincecount);
  
}