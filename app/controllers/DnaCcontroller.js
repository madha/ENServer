var LINQ = require('node-linq').LINQ;
var request = require("request");
//var auth = require('basic-auth')
const pretty = require('prettysize');
var json=require("json");
const authconfig = require('../../config/DnacConfig.js');
var xauthtoken="";
const fs = require('fs');  
const readline = require('readline');  
var stream = require('stream');
const templatepath='../ENOfferingsServer/templates/IOS_Hardening_Command.txt';



exports.getSitetopology=(req,res)=>{
var auth = 'Basic ' + Buffer.from(authconfig.UserName + ':' + authconfig.password).toString('base64');
  var options = { method: 'POST',
  url: 'https://100.64.0.81/dna/system/api/v1/auth/token',
  headers : {
      "authorization":auth,
        "content-type": "application/json"
    },
     rejectUnauthorized: false
 };
 request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var keydata=JSON.parse(body);
  xauthtoken=keydata.Token;
  var options = { method: 'GET',
  url: 'https://100.64.0.81/dna/intent/api/v1/topology/site-topology',
  headers : {
        "x-auth-token" : xauthtoken,
        "content-type": "application/json"
    },
    rejectUnauthorized: false
 };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var resultt=JSON.parse(body);
  var result=new  LINQ(resultt.response.sites).Where(function(item){return item.latitude.toString().toLowerCase()!=""});
  if(result.items.length>0){
    for(var i=0;i<result.items.length;i++){
      var id="";
      data=result.items[i]
      id =data.id +"|"+data.parentId
      presult=new  LINQ(resultt.response.sites).Where(function(item){return item.parentId==data.id});
      if(presult.items.length>0)id=id+"|"+presult.items[0].id;
      result.items[i].id=id;
    }
   
  }
  res.send(result);
  //consoleconsole.log(body);
});
});
}
exports.getSiteFilter=(req,res)=>{
  
  treeView={
    treeData:[],
  openNodes:[]
  }
  openNodes=[];
  treeData=[];
  var auth = 'Basic ' + Buffer.from(authconfig.UserName + ':' + authconfig.password).toString('base64');
    var options = { method: 'POST',
    url: 'https://100.64.0.81/dna/system/api/v1/auth/token',
    headers : {
        "authorization":auth,
          "content-type": "application/json"
      },
       rejectUnauthorized: false
   };
   request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var keydata=JSON.parse(body);
    xauthtoken=keydata.Token;
    var options = { method: 'GET',
    url: 'https://100.64.0.81/dna/intent/api/v1/topology/site-topology',
    headers : {
          "x-auth-token" : xauthtoken,
          "content-type": "application/json"
      },
      rejectUnauthorized: false
   };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var resultt=JSON.parse(body);
    var data=new  LINQ(resultt.response.sites);
    
    var arearesult=new  LINQ(resultt.response.sites).Where(function(item){return item.locationType.toString().toLowerCase()=="area"});
    for (var i =0 ; i<arearesult.items.length;i++){
      var element=arearesult.items[i]
      var mainkey,mainlabel,nodes1=[];
      mainkey=element.id;
      mainlabel=element.name;
      openNodes.push(mainkey)
     //console.log(element.id)
      var childnodes=data.Where(function(item){return item.locationType.toString().toLowerCase()=="building" && item.parentId==element.id})
      if(childnodes!=null && childnodes.items.length>0)
      {
        for(var child=0;child<childnodes.items.length;child++){
          var el1=childnodes.items[child];
          var childkey,nodes2=[];
          var nameprop="";
          childkey=el1.id;
          nameprop=el1.name;
         // console.log(el1.id)
          openNodes.push(childkey)
          var childnodes1=data.Where(function(item){return item.locationType.toString().toLowerCase()=="floor"&& item.parentId==el1.id})
          nodes3=[];
          if(childnodes1!=null && childnodes1.items.length>0){
            for(var child1=0;child1<childnodes.items.length;child1++){
              var el2=childnodes1.items[child1];
              var childkey1,childlabel1,nodes3=[];
              childkey1=el2.id
              childlabel1=el2.name;
              openNodes.push(childkey1)
              nodes3.push({key:childkey1,label:childlabel1,nodes:[],isOpen:true})
            }
          }
          nodes2.push({key:childkey,label:nameprop,nodes:nodes3,isOpen:true})
        }
      }
      treeData.push({key:mainkey,label:mainlabel,nodes:nodes2,isOpen:true})
    };
  // treeData=nodes1
   //console.log(treeData)
   treeView.treeData=treeData;
   treeView.openNodes=openNodes;
    res.send(treeView);
    //consoleconsole.log(body);
  });
  });
  }
exports.getDeviceDetailsById=(req,res)=>{
  var auth = 'Basic ' + Buffer.from(authconfig.UserName + ':' + authconfig.password).toString('base64');
    var options = { method: 'POST',
    url: 'https://100.64.0.81/dna/system/api/v1/auth/token',
    headers : {
        "authorization":auth,
          "content-type": "application/json"
      },
       rejectUnauthorized: false
   };
   request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var keydata=JSON.parse(body);
    xauthtoken=keydata.Token;
    var deviceid=req.body.DeviceId
    var options = { method: 'GET',
    url: 'https://100.64.0.81/dna/intent/api/v1/network-device/'+deviceid,
    headers : {
          "x-auth-token" : xauthtoken,
          "content-type": "application/json"
      },
      rejectUnauthorized: false
   };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    res.send(body);
    //console.log(body);
  });
  });
  }
  exports.getNetworkHealth=(req,res)=>{
    var auth = 'Basic ' + Buffer.from(authconfig.UserName + ':' + authconfig.password).toString('base64');
      var options = { method: 'POST',
      url: 'https://100.64.0.81/dna/system/api/v1/auth/token',
      headers : {
          "authorization":auth,
            "content-type": "application/json"
        },
         rejectUnauthorized: false
     };
     request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var keydata=JSON.parse(body);
      xauthtoken=keydata.Token;
   var milliseconds = (new Date).getTime();
      
      var options = { method: 'GET',
      url: ' https://100.64.0.81/dna/intent/api/v1/network-health/',
      headers : {
            "x-auth-token" : xauthtoken,
            "content-type": "application/json"
        },
        rejectUnauthorized: false,
        qs: { timestamp: milliseconds } 
     };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(body);
      //console.log(body);
    });
    });
    }
 
    exports.getClientHealth=(req,res)=>{
      var auth = 'Basic ' + Buffer.from(authconfig.UserName + ':' + authconfig.password).toString('base64');
        var options = { method: 'POST',
        url: 'https://100.64.0.81/dna/system/api/v1/auth/token',
        headers : {
            "authorization":auth,
              "content-type": "application/json"
          },
           rejectUnauthorized: false
       };
       request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var keydata=JSON.parse(body);
        xauthtoken=keydata.Token;
     var milliseconds = (new Date).getTime();
        
        var options = { method: 'GET',
        url: 'https://100.64.0.81/dna/intent/api/v1/client-health',
        headers : {
              "x-auth-token" : xauthtoken,
              "content-type": "application/json"
          },
          rejectUnauthorized: false,
          qs: { timestamp: milliseconds } 
       };
      
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.send(body);
        //console.log(body);
      });
      });
      }
   
exports.getL2topology=(req,res)=>{
  var auth = 'Basic ' + Buffer.from(authconfig.UserName + ':' + authconfig.password).toString('base64');
  var options = { method: 'POST',
  url: 'https://100.64.0.81/dna/system/api/v1/auth/token',
  headers : {
      "authorization":auth,
        "content-type": "application/json"
    },
     rejectUnauthorized: false
 };
 request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var keydata=JSON.parse(body);
  xauthtoken=keydata.Token;
var Vlantype=req.body.Vlantype
var options = { method: 'GET',
  url:  'https://100.64.0.81/dna/intent/api/v1/topology/l2/'+Vlantype,
  headers : {
        "x-auth-token" : xauthtoken,
        "content-type": "application/json"
    },
    rejectUnauthorized: false
 };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  res.send(body);
  //console.log(body);
});
});
}
exports.getInforByType=(req,res)=>{
  var auth = 'Basic ' + Buffer.from(authconfig.UserName + ':' + authconfig.password).toString('base64');
  var options = { method: 'POST',
  url: 'https://100.64.0.81/dna/system/api/v1/auth/token',
  headers : {
      "authorization":auth,
        "content-type": "application/json"
    },
     rejectUnauthorized: false
 };
 request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var keydata=JSON.parse(body);
  xauthtoken=keydata.Token;
  var topologytype=req.body.topologytype
  var siteid=req.body.siteId
  var type=req.body.type
  var options = { method: 'GET',
  url:  'https://100.64.0.81/dna/intent/api/v1/topology/l3/'+topologytype,
  headers : {
        "x-auth-token" : xauthtoken,
        "content-type": "application/json"
    },
    rejectUnauthorized: false
 };

  request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var resultt=JSON.parse(body);
var finalresult=[];
Allresult=[]
sites=[]
sites=siteid.split('|')
if(sites.length>0){
for(var i=0;i<sites.length;i++){
  siteid=sites[i]
  if(Allresult.length==0){
  Allresult =new  LINQ(resultt.response.nodes).Where(function(item){return  item.additionalInfo.siteid==siteid});
  }
  else {
    var newdata=new  LINQ(resultt.response.nodes).Where(function(item){return  item.additionalInfo.siteid==siteid});
    if(newdata!=null&& newdata.items.length>0){
      for(ival=0;ival<newdata.items.length;ival++){
        var data=newdata.items[ival]
        Allresult.items.push(data);
      }
    }
  }
}
}
    if(type.toString().toLowerCase()=="all"){
      finalresult=Allresult;
    }
    else if(type.toString().toLowerCase()=="wireless"){
      finalresult =new LINQ(Allresult.items).Where(function(item){return item.family.toLowerCase()=="wireless controller"});
     }
     else if(type.toString().toLowerCase()=="ap"){
      finalresult =new LINQ(Allresult.items).Where(function(item){return item.family.toLowerCase()=="unified ap"});
     }
     else if(type.toString().toLowerCase()=="router"){
      finalresult =new LINQ(Allresult.items).Where(function(item){return item.family.toLowerCase()=="router"});
     }
     else if(type.toString().toLowerCase()=="switch"){
      finalresult =new LINQ(Allresult.items).Where(function(item){return item.family.toLowerCase()=="switches and hubs"});
     }
     else if(type.toString().toLowerCase()=="host"){
      finalresult =new LINQ(resultt.response.nodes).Where(function(item){return item.nodeType.toLowerCase()=="host"});
     }
    
  
    res.send(finalresult);
  });
});
}


exports.getL3topology=(req,res)=>{
  var auth = 'Basic ' + Buffer.from(authconfig.UserName + ':' + authconfig.password).toString('base64');
  var options = { method: 'POST',
  url: 'https://100.64.0.81/dna/system/api/v1/auth/token',
  headers : {
      "authorization":auth,
        "content-type": "application/json"
    },
     rejectUnauthorized: false
 };
 request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var keydata=JSON.parse(body);
  xauthtoken=keydata.Token;
var topologytype=req.body.topologytype
var siteid=req.body.siteId
var options = { method: 'GET',
  url:  'https://100.64.0.81/dna/intent/api/v1/topology/l3/'+topologytype,
  headers : {
        "x-auth-token" : xauthtoken,
        "content-type": "application/json"
    },
    rejectUnauthorized: false
 };

  request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var graph={
    nodes: [],
    edges: [],
    apcount:0,
    Swcount:0,
    Controllercnt:0,
    totalcnt:0,
    routercount:0,
    HostdeviceCnt:0,
    body,
    errormsg:"",
    linkpopupdata:[]
  }
  var routerimg = 'assets/img/router.png'
  var serverimg = 'assets/img/server.png'
var APimg= 'assets/img/AP.png';
var controllerimg = 'assets/img/wirelessController.png';
var sw1img= 'assets/img/common.png';

var resultt=JSON.parse(body);
var arr =[]
allresultbyloc=[]
sites=[]
sites=siteid.split('|')
if(sites.length>0){
for(var i=0;i<sites.length;i++){
  siteid=sites[i]
  //allresultbyloc=new  LINQ(resultt.response.nodes).Where(function(item){return item.additionalInfo.siteid==siteid});
  if(arr.length==0){
  arr=new  LINQ(resultt.response.nodes).Where(function(item){return item.nodeType.toString().toLowerCase()=='device' && item.additionalInfo.siteid==siteid});
  }else{
    var locationdata=new  LINQ(resultt.response.nodes).Where(function(item){return item.nodeType.toString().toLowerCase()=='device' && item.additionalInfo.siteid==siteid});
    if(locationdata!=null && locationdata.items.length>0){
      for(var lid=0;lid<locationdata.items.length;lid++){
        arr.items.push(locationdata.items[lid]);
      }
    }
  }
  if(allresultbyloc.length==0){
    allresultbyloc=new  LINQ(resultt.response.nodes).Where(function(item){return item.additionalInfo.siteid==siteid});
    }else{
      var locationdata=new  LINQ(resultt.response.nodes).Where(function(item){return item.additionalInfo.siteid==siteid});
      if(locationdata!=null && locationdata.items.length>0){
        for(var lid=0;lid<locationdata.items.length;lid++){
          allresultbyloc.items.push(locationdata.items[lid]);
        }
      }
    }
}
}
else{
allresultbyloc=new  LINQ(resultt.response.nodes).Where(function(item){return item.additionalInfo.siteid==siteid});
arr=new  LINQ(resultt.response.nodes).Where(function(item){return item.nodeType.toString().toLowerCase()=='device' && item.additionalInfo.siteid==siteid});
}

var hostcnt =new  LINQ(resultt.response.nodes).Where(function(item){return item.nodeType.toString().toLowerCase()=='host'});
graph.HostdeviceCnt=hostcnt.items.length;
var linkarr =resultt.response.links
graph.totalcnt=allresultbyloc.items.length;
graph.endhostcnt=hostcnt.length;
if(arr.items.length>0){
wirelescontroller=new LINQ(arr.items).Where(function(item){return item.family=="Wireless Controller"})
if(wirelescontroller.items.length>0){
  graph.nodes.push({id:wirelescontroller.items[0].id,label:wirelescontroller.items[0].label, color: "#e0df41" ,shape:"image",image:controllerimg ,title:wirelescontroller.items[0].ip})
  graph.Controllercnt+=1;
  mainsourceid=wirelescontroller.items[0].id;
}
  for(var i=0;i<arr.items.length;i++){
    item=arr.items[i];
    var comparearray=item.deviceType.toString().split(" ");
    switctnt=new LINQ(comparearray).Where(function(item){return item.toLowerCase()=="switch"||item.toLowerCase()=='switches'});
    routertnt=new LINQ(comparearray).Where(function(item){return item.toLowerCase()=="router"});
    servercnt=new LINQ(comparearray).Where(function(item){return item.toLowerCase()=="server"});
    apcount=new LINQ(comparearray).Where(function(item){return item.toLowerCase()=="access"||item.toLowerCase()=="point"});
   if(switctnt.items.length>0){
       graph.nodes.push({id:item.id,label:item.label, color: "#e1ff41" ,shape:"image",image:sw1img ,title:item.ip})
      // graph.edges.push({from:mainsourceid,to:item.id})
       graph.Swcount+=1;
    }
    if(routertnt.items.length>0){
      graph.nodes.push({id:item.id,label:item.label, color: "#e1ff41" ,shape:"image",image:routerimg ,title:item.ip})
     // graph.edges.push({from:mainsourceid,to:item.id})
      graph.Swcount+=1;
   }
   if(servercnt.items.length>0){
    graph.nodes.push({id:item.id,label:item.label, color: "#e1ff41" ,shape:"image",image:serverimg ,title:item.ip})
   // graph.edges.push({from:mainsourceid,to:item.id})
    graph.Swcount+=1;
 }
   if (apcount.items.length>0){
      graph.nodes.push({id:item.id,label:item.label, color: "#e1ff41" ,shape:"image",image:APimg ,title:item.ip})
     //graph.edges.push({from:mainsourceid,to:item.id,title:"<b>Status:</b> UP<br/><b>Bandwidth:</b> 1 GB"})
      graph.apcount+=1;
    }
    
    
  }
  for(var i=0;i<linkarr.length;i++){ //a7b73be3-49fe-49bd-91d8-c58b234cf0cf
    var itt=linkarr[i];
    endspeed= pretty(itt.endPortSpeed);
    startspeed=pretty(itt.startPortSpeed);
    var dd=new LINQ(arr.items).Where(function(item){return item.id==itt.source});
    var dd1=new LINQ(arr.items).Where(function(item){return item.id==itt.target});

    var edgetitle="<b> Status:</b> "+itt.linkStatus+"<br/><b> Interface: </b>"+itt.endPortName +"<br/><b> Speed :</b>" +endspeed;
    graph.edges.push({id:itt.endPortID,from:itt.source,to:itt.target,title:edgetitle})
  }
  
  graph.body=JSON.parse(body);
  res.send(graph);
  //console.log(graph.body);
}else{
  graph.errormsg="No Device mapped for the selected location";
  res.send(graph);
}
});
});
}


exports.getLinkInformation=(req,res)=>{
  var auth = 'Basic ' + Buffer.from(authconfig.UserName + ':' + authconfig.password).toString('base64');
  var sourceid=req.body.DeviceId;
  var options = { method: 'POST',
  url: 'https://100.64.0.81/dna/system/api/v1/auth/token',
  headers : {
      "authorization":auth,
        "content-type": "application/json"
    },
     rejectUnauthorized: false
 };
 request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var keydata=JSON.parse(body);
  xauthtoken=keydata.Token;
var topologytype=req.body.topologytype
var options = { method: 'GET',
  url:  'https://100.64.0.81/dna/intent/api/v1/topology/l3/'+topologytype,
  headers : {
        "x-auth-token" : xauthtoken,
        "content-type": "application/json"
    },
    rejectUnauthorized: false
 };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
 
  var resultt=JSON.parse(body);
  var nodes=resultt.response.nodes;
  var links=resultt.response.links;
  var linkdata={
    linklst:[],
    devicelst:[]
  }
  var linkarr = new LINQ(links).Where(function(item){return item.source==sourceid});
  var devicearr = new LINQ(nodes).Where(function(item){return item.id==sourceid});
  
  linkdata.linklst.push(linkarr);
  linkdata.devicelst.push(devicearr);
  res.send(linkdata);
});
});
}
exports.getLinkInformationbylinkId=(req,res)=>{
  var auth = 'Basic ' + Buffer.from(authconfig.UserName + ':' + authconfig.password).toString('base64');
  var sourceid=req.body.edges;
  var options = { method: 'POST',
  url: 'https://100.64.0.81/dna/system/api/v1/auth/token',
  headers : {
      "authorization":auth,
        "content-type": "application/json"
    },
     rejectUnauthorized: false
 };
 request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var keydata=JSON.parse(body);
  xauthtoken=keydata.Token;
var topologytype=req.body.topologytype
var options = { method: 'GET',
  url:  'https://100.64.0.81/dna/intent/api/v1/topology/l3/'+topologytype,
  headers : {
        "x-auth-token" : xauthtoken,
        "content-type": "application/json"
    },
    rejectUnauthorized: false
 };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
 
  var resultt=JSON.parse(body);
  var nodes=resultt.response.nodes;
  var links=resultt.response.links;
  var linkdata=[];
  var linkarr = new LINQ(links).Where(function(item){return item.endPortID==sourceid});
  if(linkarr.items.length>0){
    for (var li=0;li<linkarr.items.length;li++){
      var linkitem=linkarr.items[li]
 physiclalink=pretty(linkitem.endPortSpeed);
 var src=new LINQ(nodes).Where(function(item){return item.id==linkitem.source});
 var trget=new LINQ(nodes).Where(function(item){return item.id==linkitem.target});
 srcdevicename=src.items[0].label;
 trgtdevicename=trget.items[0].label;
  startinterface=linkitem.startPortName
  endinterface=linkitem.endPortName
  status=linkitem.linkStatus;
  srcip=src.items[0].ip;
  trgtip=trget.items[0].ip;

  linkdata.push({"id":src.items[0].id,"physiclalink":physiclalink,"Devicename":srcdevicename,"Interface":startinterface,"IPAddress":srcip,"Status":status});
  linkdata.push({"id":trget.items[0].id,"physiclalink":physiclalink,"Devicename":trgtdevicename,"Interface":endinterface,"IPAddress":trgtip,"Status":status});
  }
}
  console.log(linkdata)
  res.send(linkdata);
});
});
}

exports.getDeviceList=(req,res)=>{
  var auth = 'Basic ' + Buffer.from(authconfig.UserName + ':' + authconfig.password).toString('base64');
  var options = { method: 'POST',
  url: 'https://100.64.0.81/dna/system/api/v1/auth/token',
  headers : {
      "authorization":auth,
        "content-type": "application/json"
    },
     rejectUnauthorized: false
 };
 request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var keydata=JSON.parse(body);
  xauthtoken=keydata.Token;
  data=[]
var options = { method: 'GET',
  url:  'https://100.64.0.81/dna/intent/api/v1/network-device',
  headers : {
        "x-auth-token" : xauthtoken,
        "content-type": "application/json"
    },
    rejectUnauthorized: false
 };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
 data=[]
  var resultt=JSON.parse(body);
  for (var i=0;i<resultt.response.length;i++){
    var rr=resultt.response[i];
    data.push({"hostname":rr.hostname,"managementIpAddress":rr.managementIpAddress,
    "reachabilityStatus":rr.reachabilityStatus,
    "macAddress":rr.macAddress,
    "softwareType":rr.softwareType,
    "softwareVersion":rr.softwareVersion,
    "platformId":rr.platformId,
    "serialNumber":rr.serialNumber,
    "upTime":rr.upTime,
    "lastUpdated":rr.lastUpdated,
    "interfaceCount":rr.interfaceCount,
    "collectionStatus":rr.collectionStatus,
    "collectionInterval":rr.collectionInterval,
    "series":rr.series,
    "roleSource":rr.roleSource,
    "type":rr.type,
    "id":rr.id
  })
  }
 res.send(data);
});
 });
}
exports.getDeviceConfigByDeviceId=(req,res)=>{
  var DeviceId=req.body.DeviceId;
  var auth = 'Basic ' + Buffer.from(authconfig.UserName + ':' + authconfig.password).toString('base64');
  var options = { method: 'POST',
  url: 'https://100.64.0.81/dna/system/api/v1/auth/token',
  headers : {
      "authorization":auth,
        "content-type": "application/json"
    },
     rejectUnauthorized: false
 };
 request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var keydata=JSON.parse(body);
  xauthtoken=keydata.Token;

var options = { method: 'GET',
  url:  'https://100.64.0.81/dna/intent/api/v1/network-device/'+DeviceId+'/config',
  headers : {
        "x-auth-token" : xauthtoken,
        "content-type": "application/json"
    },
    rejectUnauthorized: false
 };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
 
  var resultt=JSON.parse(body);
 res.send(resultt);
});
 });
}
exports.complaincecount=(req,res)=>{
  templatearr=[]
  complianceresult=[]
  finalresult=[]
  comcount=0;
  noncomcount=0;
  var instream = fs.createReadStream(templatepath);
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);
  rl.on('line', function(line) {
    // process line here
    if(line.length>0 && line!=""){
      templatearr.push(line)
    }
  });
  
  var auth = 'Basic ' + Buffer.from(authconfig.UserName + ':' + authconfig.password).toString('base64');
  var options = { method: 'POST',
  url: 'https://100.64.0.81/dna/system/api/v1/auth/token',
  headers : {
      "authorization":auth,
        "content-type": "application/json"
    },
     rejectUnauthorized: false
 };
 request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var keydata=JSON.parse(body);
  xauthtoken=keydata.Token;
var topologytype=req.body.topologytype
var siteid=req.body.siteId
var options = { method: 'GET',
  url:  'https://100.64.0.81/dna/intent/api/v1/topology/l3/'+topologytype,
  headers : {
        "x-auth-token" : xauthtoken,
        "content-type": "application/json"
    },
    rejectUnauthorized: false
 };

  request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var data=[]
  execnt=0
  ismismatched=false;
  missingcommandLabel=[];
  missingcmdvalue=[]
  linecount=1;  
  var resultt=JSON.parse(body);
  var arr=new LINQ(resultt.response.nodes).Where(function(item){return item.nodeType.toString().toLowerCase()=='device' });
  if(arr.items.length>0){
    for(var i=0;i<arr.items.length;i++){
      var currentitem=arr.items[i];
      var options = { method: 'GET',
        url:  'https://100.64.0.81/dna/intent/api/v1/network-device/'+currentitem.id+'/config',
        headers : {
              "x-auth-token" : xauthtoken,
              "content-type": "application/json"
          },
          rejectUnauthorized: false
         };

      request(options, function (error, response, body) {
      if (error) throw new Error(error);
        result=JSON.parse(body);
        execnt+=1;
        currentresult=result.response;
       
        for( var templn =0; templn<templatearr.length;templn++){
          var currentline=templatearr[templn];
          
          if(currentresult!="" && currentresult!=undefined){
            if(currentresult.search(currentline)==-1){
              if(finalresult!=null && finalresult.length==0){
               finalresult.push({"Command":currentline,found:false,count:linecount})
              }else{
                var lineexist=new LINQ(finalresult).Where(function(item){return item.Command==currentline });
                if(lineexist.items.length>0){
                  
                  finalresult.pop(lineexist);
                  finalresult.push({"Command":currentline,found:false,count:linecount})
                }
                else{
                  finalresult.push({"Command":currentline,found:false,count:linecount})
                }
              }
               ismismatched=false
              }
            else{
              if(finalresult!=null && finalresult.length==0){
              finalresult.push({"Command":currentline,found:true,count:linecount})
              }
              else{
                var lineexist=new LINQ(finalresult).Where(function(item){return item.Command==currentline });
                if(lineexist.items.length>0){
                  var lncnt=lineexist.items[0].count+=1;
                  finalresult.pop(lineexist);
                  finalresult.push({"Command":currentline,found:false,count:linecount})
                }
                else{
                  finalresult.push({"Command":currentline,found:false,count:linecount})
                }
              }
              ismismatched=true;
            }
        }
        }
        linecount+=1;
        
        if(ismismatched){noncomcount+=1;}else{comcount+=1;}
      if(arr.items.length==execnt){
        for(var item =0;item<finalresult.length;item++){
          var iitem1=finalresult[item];
          missingcommandLabel.push(iitem1.Command)
          missingcmdvalue.push(iitem1.count)
        }
        complianceresult.push({comcount,noncomcount,'label':missingcommandLabel,'value':missingcmdvalue})
        res.send(complianceresult)
      }
        //console.log(result.response)
      });
    }
   
  }
  
  
  })
});

}
