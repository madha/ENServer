var LINQ = require('node-linq').LINQ;
var request = require("request");
//var auth = require('basic-auth')
var json=require("json");
const authconfig = require('../../config/DnacConfig.js');
var xauthtoken="";


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
    errormsg:""
  }
  var DNCpath = 'assets/img/System-Globe-icon.png'

var APimg= 'assets/img/AP.png';
var controllerimg = 'assets/img/wirelessController.png';
var sw1img= 'assets/img/common.png';
var resultt=JSON.parse(body);
var arr =new  LINQ(resultt.response.nodes).Where(function(item){return item.nodeType.toString().toLowerCase()=='device' && item.additionalInfo.siteid==siteid});
var hostcnt =new  LINQ(resultt.response.nodes).Where(function(item){return item.nodeType.toString().toLowerCase()=='host'});
graph.HostdeviceCnt=hostcnt.items.length;
var linkarr =resultt.response.links
var mainsourceid;
graph.totalcnt=arr.items.length
graph.endhostcnt=hostcnt.length;
if(arr.items.length>0){
wirelescontroller=new LINQ(arr.items).Where(function(item){return item.family=="Wireless Controller"})

  graph.nodes.push({id:wirelescontroller.items[0].id,label:wirelescontroller.items[0].label, color: "#e0df41" ,shape:"image",image:controllerimg ,title:wirelescontroller.items[0].ip})
  graph.Controllercnt+=1;
  mainsourceid=wirelescontroller.items[0].id;

  for(var i=0;i<arr.items.length;i++){
    item=arr.items[i];
    
   if(item.family.search(/Switch/)>0){
       graph.nodes.push({id:item.id,label:item.label, color: "#e1ff41" ,shape:"image",image:sw1img ,title:item.ip})
      // graph.edges.push({from:mainsourceid,to:item.id})
       graph.Swcount+=1;
    }
    else if (item.family.search(/AP/)>0){
      graph.nodes.push({id:item.id,label:item.label, color: "#e1ff41" ,shape:"image",image:APimg ,title:item.ip})
     graph.edges.push({from:mainsourceid,to:item.id,title:"<b>Status:</b> UP<br/><b>Bandwidth:</b> 1 GB"})
      graph.apcount+=1;
    }
    else if (item.nodeType.search(/HOST/)>0){
      graph.nodes.push({id:item.id,label:item.label, color: "#e1ff41" ,shape:"image",image:APimg ,title:item.ip})
      //graph.edges.push({from:mainsourceid,to:item.id})
     // graph.apcount+=1;
    }
    
  }
  for(var i=0;i<linkarr.length;i++){
    var itt=linkarr[i];
    graph.edges.push({from:itt.source,to:itt.target,title:itt.status})
  }
  
  graph.body=JSON.parse(body);
  res.send(graph);
  console.log(graph.body);
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

