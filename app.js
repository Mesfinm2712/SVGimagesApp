'use strict'

var username = null, password = null, database = null;
var dbCredentials = {
      host     : 'dursley.socs.uoguelph.ca',
      user     : username,
      password : password,
      database : database
  };


var username, password, database;
// C library API
let input = null;
var globalCount = 0;
const ffi = require('ffi-napi');

let array = [];
let newArray = [];

let lib = ffi.Library('./libsvgparse', {
  'uploadSVGFiles' : ['string', ['string', 'int', 'string']],
  'credentials' : ['string', ['string', 'string', 'string']],
  'returnCredentials' : ['string', []],
  'editAtt' : ['string', ['string', 'string', 'string', 'string', 'int']],
  'scaleImage' : ['string', ['string', 'int', 'int']]

});


// Express App (Routes)
const express = require("express");
const app     = express();
const path    = require("path");
const fileUpload = require('express-fileupload');

app.use(fileUpload());
app.use(express.static(path.join(__dirname+'/uploads')));

// Minimization
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Important, pass in port as in `npm run dev 1234`, do not change
const portNum = process.argv[2];

// Send HTML at root, do not change
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

// Send Style, do not change
app.get('/style.css',function(req,res){
  //Feel free to change the contents of style.css to prettify your Web app
  res.sendFile(path.join(__dirname+'/public/style.css'));
});

// Send obfuscated JS, do not change
app.get('/index.js',function(req,res){
  fs.readFile(path.join(__dirname+'/public/index.js'), 'utf8', function(err, contents) {
    const minimizedContents = JavaScriptObfuscator.obfuscate(contents, {compact: true, controlFlowFlattening: true});
    res.contentType('application/javascript');
    res.send(minimizedContents._obfuscatedCode);
  });
});

//Respond to POST requests that upload files to uploads/ directory
app.post('/upload', function(req, res) {
  if(!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  let uploadFile = req.files.uploadFile;
 
  // Use the mv() method to place the file somewhere on your server
  uploadFile.mv('uploads/' + uploadFile.name, function(err) {
    if(err) {
      return res.status(500).send(err);
    }


  app.get('/downloadButton', function(req , res){

    let useR = req.query.sendUser;
    let pasS = req.query.sendPass;
    let datA = req.query.sendData;


    dbCredentials.user = useR;
    dbCredentials.password = pasS;
    dbCredentials.database = datA;
    dbCredentials.host = "dursley.socs.uoguelph.ca";

    validateID(res,dbCredentials);

  });

    res.redirect('/');
  });
});

//Respond to GET requests for files in the uploads/ directory
app.get('/uploads/:name', function(req , res){
  fs.stat('uploads/' + req.params.name, function(err, stat) {
    if(err == null) {
      res.sendFile(path.join(__dirname+'/uploads/' + req.params.name));
    } else {
      console.log('Error in file downloading route: '+err);
      res.send('');
    }
  });
});


app.get('/dbstatus', function(req , res){

  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";

  let json = "{}";
  let fileCount = 0;
  let downloadCount = 0;
  let changeCount = 0;


  dbStatus(json, res);


});

async function dbStatus(json, res)
{
  let fileCount = 0;
  let downloadCount = 0;
  let changeCount = 0;
  var json = "{}";

  const mysql = require('mysql2/promise');
  let connection = await mysql.createConnection(dbCredentials);


  var sql = 'SELECT COUNT(*) AS fileCount FROM FILE;';

  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
  fileCount = rows[0].fileCount;
  json = "{\"file\":\"" + fileCount;

  });


  var sql1 = 'SELECT COUNT(*) AS downloadCount FROM DOWNLOAD;';

  connection.query(sql1, function(err, rows1, fields) {
    if (err) throw err;
  downloadCount = rows1[0].downloadCount;
  json = json + "\",\"download\":\"" + downloadCount;

  });


  var sql2 = 'SELECT COUNT(*) AS changeCount FROM IMG_CHANGE;';

  connection.query(sql2, function(err, rows2, fields) {
    if (err) throw err;
  changeCount = rows2[0].changeCount;
  json = json + "\",\"changeCount\":\"" + changeCount + "\"}";
  res.send(json);

  });

}

app.get('/clearData', function(req , res){

  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";

  clearData();


});

//******************** Your code goes here ******************** 
app.get('/updateShape', function(req , res){


  let callFunc = checkFiles();

  var json = "";

  let listOfNames = "";

  for (let i = 0; i < callFunc.length; i++)
  {
    json = JSON.parse(lib.uploadSVGFiles("./uploads/" + callFunc[i], 1, input));
    if(i == 0){
      listOfNames = listOfNames + " NOT fileName = '" + callFunc[i] + "'" ;
    }else{
      listOfNames =  listOfNames + " AND NOT fileName = '" + callFunc[i] + "'" ;
    }
      array.push(json);
  }
  
  let entireQuery = "";
  if(listOfNames == ""){
    entireQuery = "";
  }else{
    listOfNames = listOfNames + ";"
    entireQuery = "SELECT * FROM FILE WHERE" + listOfNames;
  }

  if(globalCount > 0)
  {
    deleteFile(entireQuery);
    let json2 = JSON.parse(lib.returnCredentials());



    dbCredentials.user = json2.user;
    dbCredentials.password = json2.pass;
    dbCredentials.database = json2.data;
    dbCredentials.host = "dursley.socs.uoguelph.ca";



    storeFile(json);
  }

  res.send(array);

  array.length = 0;
});






app.get('/files', function(req , res){


  let callFunc = checkFiles();

  var json = "";

  let listOfNames = "";

  for (let i = 0; i < callFunc.length; i++)
  {
    json = JSON.parse(lib.uploadSVGFiles("./uploads/" + callFunc[i], 1, input));

    if(i == 0){
      listOfNames = listOfNames + " NOT fileName = '" + callFunc[i] + "'" ;
    }else{
      listOfNames =  listOfNames + " AND NOT fileName = '" + callFunc[i] + "'" ;
    }
      array.push(json);
  }
  
  let entireQuery = "";
  if(listOfNames == ""){
    entireQuery = "";
  }else{
    listOfNames = listOfNames + ";"
    entireQuery = "SELECT * FROM FILE WHERE" + listOfNames;
  }

  if(globalCount > 0)
  {
    deleteFile(entireQuery);
    let json2 = JSON.parse(lib.returnCredentials());

    dbCredentials.user = json2.user;
    dbCredentials.password = json2.pass;
    dbCredentials.database = json2.data;
    dbCredentials.host = "dursley.socs.uoguelph.ca";

    // storeFile(json);
  }

  res.send(array);

  array.length = 0;



});
app.get('/updateFileTableData', function(req , res){

  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";

  var json = "[]";
  fileDatabaseTable(json, res);



});
app.get('/query4Update', function(req , res){

  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";

  var json = "[]";
  fileDatabaseTable(json, res);



});
app.get('/updateChangeTableData', function(req , res){

  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";

  var json = "[]";

  changeDatabaseTable(json, res)

});
app.get('/query3', function(req , res){

  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";

  var json = "[]";

  changeDatabaseTable(json, res)

});
app.get('/updateDownTableData', function(req , res){

  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";

  var json = "[]";

  downloadDatabaseTable(json, res);

});


app.get('/viewFile', function(req , res){

  let file = "./uploads/" + req.query.sendFile;
  let json = JSON.parse(lib.uploadSVGFiles(file, 2, input));

  res.send(json);
});
app.get('/updatePicLog', function(req , res){

  let file = "./uploads/" + req.query.sendFile;
  let json = JSON.parse(lib.uploadSVGFiles(file, 2, input));

  res.send(json);
});
app.get('/fileRect', function(req , res){

  let file = req.query.sendFile;
  let json = JSON.parse(lib.uploadSVGFiles("./uploads/" + file, 3, input));

  if (json != null) 
  {
    res.send(json);
  }

});
app.get('/fileCirc', function(req , res){

  let file = req.query.sendFile;
  let json = JSON.parse(lib.uploadSVGFiles("./uploads/" + file, 6, input));

  if (json != null) 
  {
    res.send(json);
  }

});
app.get('/filePath', function(req , res){

  let file = req.query.sendFile;
  let json = JSON.parse(lib.uploadSVGFiles("./uploads/" + file, 7, input));

  if (json != null) 
  {
    res.send(json);
  }

});
app.get('/fileGroup', function(req , res){

  let file = req.query.sendFile;
  let json = JSON.parse(lib.uploadSVGFiles("./uploads/" + file, 8, input));


  if (json != null) 
  {
    res.send(json);
  }

});
app.get('/fileAtt', function(req , res){

  let file = req.query.sendFile;
  let json = JSON.parse(lib.uploadSVGFiles("./uploads/" + file, 9, input));


  if (json != null) 
  {
    res.send(json);
  }

});
app.get('/editTitle', function(req , res){//fix this one
  let callFunc = checkFiles();
  let hello = req.query.sendTitle;
  let file = req.query.sendFile;


  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";


  let json = JSON.parse(lib.uploadSVGFiles("./uploads/" + file, 4, hello));//whichever function


  let uploadFile = file;
  let changeType = "Edited title in " + file;
  let changeSum = "title was edited from (" + json.oldTitle + ") to (" + json.title + ")";
  getChanges(uploadFile, changeType, changeSum)



  res.send(json);


});
app.get('/editAttVal', function(req , res){

  let old = req.query.sendAttName;//just old string on drop down

  let file = req.query.sendFile;
  let attNameNew = req.query.sendAttNewName;
  let attValNew =  req.query.sendAttNewVal;
  
  let json = JSON.parse(lib.editAtt("./uploads/" + file, old, attNameNew, attValNew, 0));//whichever function

  res.send(json);


});
var createFileCount = 0;
app.get('/createFile', function(req , res){//send info back, filename and json string

  let newFile = req.query.sendFile;
  let hello = req.query.image;


  let json = JSON.parse(lib.uploadSVGFiles("./uploads/" + newFile, 10, hello));
  json.file = "./uploads/" + newFile;
  json.fileSize = "0.11";


  let json2 = JSON.parse(lib.returnCredentials());



  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";


  createFileCount++;


  storeFile(json);



  res.send(json);

});
app.get('/createRectFile', function(req , res){//send info back, filename and json string

  let newFile = req.query.sendFile;
  let rectJson = req.query.rect;



  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";



  let json = JSON.parse(lib.uploadSVGFiles("./uploads/" + newFile, 11, rectJson));
  
  let json1 = JSON.parse(rectJson);

  let uploadFile = newFile;
  let changeType = "Created a rectangle in " + newFile;
  let changeSum = "Added rectangle at (" + json1.x + ","+ json1.y + ") with a width of " + json1.w + " and height of " + json1.h + json1.units + ".";
  getChanges(uploadFile, changeType, changeSum)




 res.send(json);

});
app.get('/createCircFile', function(req , res){//send info back, filename and json string

  let newFile = req.query.sendFile;
  let circJson = req.query.circ;


  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";




  let json = JSON.parse(lib.uploadSVGFiles("./uploads/" + newFile, 12, circJson));

  let json1 = JSON.parse(circJson);

  let uploadFile = newFile;
  let changeType = "Created a circle in " + newFile;
  let changeSum = "Added circle at (" + json1.cx + ","+ json1.cy + ") with a radius of " + json1.r + json1.units + ".";
  getChanges(uploadFile, changeType, changeSum)


 res.send(json);

});
app.get('/createAttFile', function(req , res){//send info back, filename and json string

  let old = req.query.sendAttName;//just old string on drop down

  let file = req.query.sendFile;
  let attNameNew = req.query.sendAttNewName;
  let attValNew =  req.query.sendAttNewVal;
  

  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";



  let json = JSON.parse(lib.editAtt("./uploads/" + file, old, attNameNew, attValNew, 1));//whichever function



  let uploadFile = file;
  let changeType = "Created an attribute in " + file;
  let changeSum = "Attribute created, name = (" + attNameNew + ") value= (" + attValNew + ")";
  getChanges(uploadFile, changeType, changeSum)


  res.send(json);




});
app.get('/editDesc', function(req , res){
  let callFunc = checkFiles();
  let hello = req.query.sendDesc;
  let file = req.query.sendFile;

  for (let i = 0; i < callFunc.length; i++)
  {
  }
  let json = JSON.parse(lib.uploadSVGFiles("./uploads/" + file, 5, hello));//whichever function


  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";



  let uploadFile = file;
  let changeType = "Edited Description in " + file;
  let changeSum = "Description was edited from (" + json.oldDesc + ") to (" + json.desc + ")";
  getChanges(uploadFile, changeType, changeSum)


  res.send(json);


});



function checkFiles()
{
  let allFiles = [];
  let readFiles = fs.readdirSync('./uploads');

  for(let i in readFiles)
  {
    let fileName = readFiles[i];
    let checker = fileName.includes(".svg");

    if(checker == true)
    {
        let json = JSON.parse(lib.uploadSVGFiles("./uploads/" + fileName, 1, input));

        if(json != null)
        {
            allFiles.push(fileName);
        }
    }
  }
  return allFiles;
}


app.get('/scaleImageRect', function(req , res){

  let file =  req.query.sendFile;

  let scale =  req.query.rect;
  
  let json = JSON.parse(lib.scaleImage("./uploads/" + file, scale, 0));//whichever function


  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";

  let uploadFile = file;
  let changeType = "Scaled rectangles in " + file;
  let changeSum = "Scaled all rectangles by a value of " + scale + ".";
  getChanges(uploadFile, changeType, changeSum)


  res.send(json);


});
app.get('/scaleImageCirc', function(req , res){

  let file =  req.query.sendFile;

  let scale =  req.query.circ;
  
  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";

  let json = JSON.parse(lib.scaleImage("./uploads/" + file, scale, 1));//whichever function

  let uploadFile = file;
  let changeType = "Scaled circles in " + file;
  let changeSum = "Scaled all circles by a value of " + scale + ".";
  getChanges(uploadFile, changeType, changeSum)


  res.send(json);


});

async function deleteFile(entireQuery)
{

  if(entireQuery != ""){
    const mysql = require('mysql2/promise');
    let connection = await mysql.createConnection(dbCredentials);
    let checkRec = "";

    const [rows2, fields2] = await connection.execute(entireQuery);

    for(let row of rows2){
        checkRec = "DELETE FROM FILE WHERE fileName = '" +  row.fileName + "';";
        await connection.execute(checkRec);
    }
  }

}


async function storeFile(fileInfo){

  let tempFile = fileInfo.file.substring(10, fileInfo.file.length);
  var title = fileInfo.title; 
  var description = fileInfo.desc; 
  var rectTemp = fileInfo.numRect; 
  var circTemp = fileInfo.numCirc; 
  var pathTemp = fileInfo.numPaths; 
  var groupTemp = fileInfo.numGroups; 

  const mysql = require('mysql2/promise');
  let connection = await mysql.createConnection(dbCredentials);

  let checkRec = "SELECT * FROM FILE WHERE fileName = '" +  fileInfo.file.substring(10, fileInfo.file.length) + "';";

  // let checkRec = "SELECT * FROM FILE ;";


  const [rows2, fields2] = await connection.execute(checkRec);
  let counter = 0;
  try{

  for (let row of rows2){
    ++counter;
  }

  }catch(error){
    counter = 0;
  }
  if(counter != 0){
    //you have duplicate
    console.log("file is being duplicated!! " + fileInfo.file);
    return;
  }else{

  	console.log(fileInfo.file + " is forsure duplicated");
  const [rows1, fields1] = await connection.execute('SELECT * from `FILE` ORDER BY `fileName`');

  try{

          for (let fileInfo of rows1){
              console.log("fileName: "+tempFile+
                " fileSize: "+fileInfo.fileSize+" title: "+ title + " description: "+ description + " rectangles: "+ rectTemp +" circles: "+circTemp +" paths: "+pathTemp+" groups: "+groupTemp);
          }

  }catch(error){
    // console.log("checking file table caused an error");
  }
  var date = new Date();

  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();

  if(m < 10)
  {
    m = '0' + m;
  }
  if(s < 10)
  {
    s = '0' + m;
  }
  var timestamp =  h + ":" + m + ":" + s;

  let insRec = "INSERT INTO FILE ( fileName, fileSize, title, description, rectangles, circles, paths, groups, timeStamp) VALUES ('" + 

  tempFile +"','" + fileInfo.fileSize + " KB','"+ title + "','" + description + "',"+ rectTemp+"," + circTemp
  +"," + pathTemp + ","+ groupTemp + ",'" + timestamp +"');";


  // console.log(insRec);
  try{

  await connection.execute(insRec);
  // console.log("works");
  }catch(error){
    // console.log("trying to insert the record did not work ");
  }
}

}

app.get('/downloadTrack', function(req , res){

  let file = req.query.sendFile;

  let useR = req.query.sendUser;
  let pasS = req.query.sendPass;
  let datA = req.query.sendData;


  dbCredentials.user = useR;
  dbCredentials.password = pasS;
  dbCredentials.database = datA;
  dbCredentials.host = "dursley.socs.uoguelph.ca";

  getUploadFile(file);

});


async function getChanges(uploadFile, changeType, changeSum)
{

    const mysql = require('mysql2/promise');

    let connection;
    let downloadTable = "CREATE TABLE IF NOT EXISTS IMG_CHANGE (change_id INT NOT NULL AUTO_INCREMENT, change_type VARCHAR(255), change_summary VARCHAR(255), change_time VARCHAR(255), svg_id VARCHAR(255), PRIMARY KEY (change_id)) ENGINE=INNODB;";

    try{
    connection = await mysql.createConnection(dbCredentials);
    await connection.execute(downloadTable);


    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    
    if(m < 10)
    {
      m = '0' + m;
    }
    if(s < 10)
    {
      s = '0' + m;
    }
    var timestamp =  h + ":" + m + ":" + s;

    let findSVGId = "SELECT * FROM FILE WHERE fileName = '" + uploadFile + "';";

    const [rows3, fields3] = await connection.execute(findSVGId);
    let svgId = "1";
    for(let row of rows3){
      svgId = row.ID;
    }



    let json = JSON.parse("{\"change_type\":\"" + changeType + "\",\"change_summary\":\"" + changeSum + "\",\"change_time\":\"" + timestamp + "\",\"svg_id\":\"" + svgId + "\"}");


    storeChanges(json);

    globalCount++;
    // console.log("track changes table works");

  }catch(error){
    // console.log("change table did not connect");

  }





}
async function storeChanges(fileInfo){

  var type = fileInfo.change_type; 
  var sum = fileInfo.change_summary; 
  var svgId = fileInfo.svg_id; 
  var time = fileInfo.change_time; 
  var changeId = fileInfo.change_id; 


  const mysql = require('mysql2/promise');
  let connection = await mysql.createConnection(dbCredentials);

  let checkRec = "SELECT * FROM IMG_CHANGE WHERE change_id = '" +  changeId + "';";


  const [rows2, fields2] = await connection.execute(checkRec);
  let counter = 0;

  try{

  for (let row of rows2){
    ++counter;
  }

  }catch(error){
    counter = 0;
  }
  // if(counter != 0){
  //   //you have duplicate
  // }else{


  const [rows1, fields1] = await connection.execute('SELECT * from `IMG_CHANGE` ORDER BY `change_id`');

    try{

            for (let fileInfo of rows1){
                console.log("change_type: "+type +" change_summary: "+ sum +" change_time: "+ time + " svg_id: "+svgId);                
            }

      // console.log("works");

    }catch(error){
      // console.log("checking file table caused an error");
    }
    let insRec = "INSERT INTO IMG_CHANGE ( change_type, change_summary, change_time, svg_id) VALUES ('" + type +"','" + sum + "','" + time + "','" + svgId + "');";

    try{

    await connection.execute(insRec);
    // console.log("final insert change works");
    }catch(error){
      // console.log("trying to insert the change did not work ");
    }
  // }
}


function getUploadFile(uploadFile)
{
  trackDownloads(uploadFile);
}


async function trackDownloads(uploadFile)
{

    const mysql = require('mysql2/promise');

 
    let connection;
    let downloadTable = "CREATE TABLE IF NOT EXISTS DOWNLOAD (download_id INT NOT NULL AUTO_INCREMENT, d_description VARCHAR(255), svg_id VARCHAR(255), PRIMARY KEY (download_id)) ENGINE=INNODB;";
      
    try{
    connection = await mysql.createConnection(dbCredentials);
    await connection.execute(downloadTable);


    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    if(m < 10)
    {
      m = '0' + m;
    }
    if(s < 10)
    {
      s = '0' + m;
    }
    var timestamp =  h + ":" + m + ":" + s;

    let downloadDes = "file name downloaded: " + uploadFile + " ,at " + timestamp;
    let findSVGId = "SELECT * FROM FILE WHERE fileName = '" + uploadFile + "';";

    const [rows3, fields3] = await connection.execute(findSVGId);
    let svgId = "1";
    for(let row of rows3){
      svgId = row.ID;
    }


    let json = JSON.parse("{\"d_description\":\"" + downloadDes + "\",\"svg_id\":\"" + svgId + "\",\"file\":\"" + uploadFile + "\"}");

    storeDownloads(json);


    globalCount++;
    // console.log("track download table works");

  }catch(error){
    // console.log("upload table did not connect");

  }
}
async function storeDownloads(fileInfo){

  var description = fileInfo.d_description; 
  var file = fileInfo.file; 
  var svgId = fileInfo.svg_id; 
  var downloadId = fileInfo.download_id; 

  const mysql = require('mysql2/promise');
  let connection = await mysql.createConnection(dbCredentials);

  let checkRec = "SELECT * FROM DOWNLOAD WHERE download_id = '" +  downloadId + "';";

  const [rows2, fields2] = await connection.execute(checkRec);
  let counter = 0;
  try{

  for (let row of rows2){
    ++counter;
  }

  }catch(error){
    counter = 0;
  }
  if(counter != 0){
    //you have duplicate
  }else{

    const [rows1, fields1] = await connection.execute('SELECT * from `DOWNLOAD` ORDER BY `download_id`');

    try{

            for (let fileInfo of rows1){
                console.log("d_description: "+description+" svg_id: "+svgId);
            }

      // console.log("works");

    }catch(error){
      // console.log("checking file table caused an error");
    }


    let insRec = "INSERT INTO DOWNLOAD ( d_description, svg_id) VALUES ('" + description +"','" + svgId + "');";

    try{

    await connection.execute(insRec);
    // console.log("final insert download works");
    }catch(error){
      // console.log("trying to insert the download did not work ");
    }
  }
}


//database

async function validateID(res,dbConf){//add an id number and add creationTime

    const mysql = require('mysql2/promise');
    
    let connection;
    let createFileTable = "CREATE TABLE IF NOT EXISTS FILE (ID INT NOT NULL AUTO_INCREMENT, fileName VARCHAR(255), fileSize VARCHAR(255), title VARCHAR(255), description VARCHAR(255), rectangles VARCHAR(255), circles VARCHAR(255), paths VARCHAR(255), groups VARCHAR(255), timeStamp VARCHAR(255), PRIMARY KEY (ID)) ENGINE=INNODB;";
      
    try{
    connection = await mysql.createConnection(dbConf);
    await connection.execute(createFileTable);

    dbCredentials.host = dbConf.host;
    dbCredentials.user = dbConf.user;
    dbCredentials.password = dbConf.password;
    dbCredentials.database = dbConf.database;



    let callFunc = checkFiles();

    for (let i = 0; i < callFunc.length; i++)
    {
      let json = JSON.parse(lib.uploadSVGFiles("./uploads/" + callFunc[i], 1, input));
      storeFile(json);
    }
    let errorMess = "{\"answer\": \"connected\"}";   
    globalCount++;

    res.send(errorMess);
  }catch(error){
    let errorMess = "{\"answer\": \"incorrect credentials, please try again\"}";
    res.send(errorMess);

  }
}

app.get('/dataBaseButton', function(req , res){
  let database = req.query.sendData;
  let username = req.query.sendUser;
  let password = req.query.sendPass;


  // database credentials
  let dbConf = {
      host     : 'dursley.socs.uoguelph.ca',
      user     : username,
      password : password,
      database : database
  };

  username = dbConf.user;
  password = dbConf.password;
  database = dbConf.database;

  dbCredentials.user = username;
  dbCredentials.password = password;
  dbCredentials.database = database;
  dbCredentials.host = "dursley.socs.uoguelph.ca";



  let json1 = JSON.parse(lib.credentials(username, password, database));

  let json2 = JSON.parse(lib.returnCredentials());

   username = json2.user;
   password = json2.pass;
   database = json2.data;
  

  validateID(res,dbConf);


});

async function clearData()
{
  const mysql = require('mysql2/promise');
  let connection = await mysql.createConnection(dbCredentials);

  let fileDel = "DELETE FROM FILE;";

  await connection.execute(fileDel);


    try{

      // console.log("file delete works");

    }catch(error){
      // console.log("not deleted file");
    }

         

  let downDel = "DELETE FROM DOWNLOAD;";

  await connection.execute(downDel);


    try{

      // console.log("download delete works");

    }catch(error){
      // console.log("not deleted download");
    }

  let changeDel = "DELETE FROM IMG_CHANGE;";

  await connection.execute(changeDel);


    try{

      // console.log("change delete works");

    }catch(error){
      // console.log("change not deleted");
    }



}
async function fileDatabaseTable(json, res)
{

  const mysql = require('mysql2/promise');
  let connection = await mysql.createConnection(dbCredentials);



    let tableFile = "SELECT * FROM FILE;";
    var arrayFile = [];
    var arrayFileSize = [];
    var arrayTitle = [];
    var arrayDesc = [];
    var arrayRect = [];
    var arrayCirc = [];
    var arrayPath = [];
    var arrayGroup = [];
    var arrayTime = [];

    const [rows3, fields3] = await connection.execute(tableFile);
    let svgId = "1";
    let i = 0;
    for(let row of rows3){
      arrayFile[i] = row.fileName;
      arrayFileSize[i] = row.fileSize;
      arrayTitle[i] = row.title;
      arrayDesc[i] = row.description;
      arrayRect[i] = row.rectangles;
      arrayCirc[i] = row.circles;
      arrayPath[i] = row.paths;
      arrayGroup[i] = row.groups;
      arrayTime[i] = row.timeStamp;

      i++;

    }
    var length = 0;
    var jsonSend
    for(let j = 0; j < i; j ++ )
    {


      if(length ==0)
      {
        json = "[{\"fileName\":\""+ arrayFile[j]+ "\",\"fileSize\":\""+ arrayFileSize[j]+ "\",\"title\":\""+ arrayTitle[j]+ "\",\"description\":\""+ arrayDesc[j]+ "\",\"rectangles\":"+ arrayRect[j]+ ",\"circles\":" + arrayCirc[j]+ ",\"paths\":" + arrayPath[j]+ ",\"groups\":"+ arrayGroup[j]+ ",\"timeStamp\":\""+ arrayTime[j]+ "\"}";
      }
      else
      {
        json = json + "{\"fileName\":\""+ arrayFile[j]+ "\",\"fileSize\":\""+ arrayFileSize[j]+ "\",\"title\":\""+ arrayTitle[j]+ "\",\"description\":\""+ arrayDesc[j]+ "\",\"rectangles\":"+ arrayRect[j]+ ",\"circles\":" + arrayCirc[j]+ ",\"paths\":" + arrayPath[j]+ ",\"groups\":"+ arrayGroup[j]+ ",\"timeStamp\":\""+ arrayTime[j]+ "\"}";
      }

        length++;

        if(j != i - 1)
        {
        json = json + ",";
      }
      else
      {
        json = json + "]";
        jsonSend = JSON.parse(json);
        array.push(jsonSend);
        res.send(array);
      }

    }
}

async function changeDatabaseTable(json, res)
{

  const mysql = require('mysql2/promise');
  let connection = await mysql.createConnection(dbCredentials);



    let tableFile = "SELECT * FROM IMG_CHANGE;";
    var changeType = [];
    var changeSum = [];
    var changeTime = [];
    var fileName = [];

    const [rows3, fields3] = await connection.execute(tableFile);
    let svgId = "1";
    let i = 0;
    for(let row of rows3){
      changeType[i] = row.change_type;
      changeSum[i] = row.change_summary;
      changeTime[i] = row.change_time;
      let n = row.change_type.split(" ");
      fileName[i] = n[n.length - 1];
      i++;
    }
    var length = 0;
    var jsonSend




    for(let j = 0; j < i; j ++ )
    {
      let fileSizeVal = "";
      let findFileSize = "SELECT * FROM FILE WHERE fileName = '" + fileName[j] + "';";

      const [rows3, fields3] = await connection.execute(findFileSize);
      for(let row of rows3){
        fileSizeVal = row.fileSize;
      }


      if(length ==0)
      {
        json = "[{\"fileName\":\""+ fileName[j]+ "\",\"fileSize\":\""+ fileSizeVal + "\",\"changeType\":\""+ changeType[j]+ "\",\"changeSum\":\""+ changeSum[j]+ "\",\"changeTime\":\""+ changeTime[j]+ "\"}";
      }
      else
      {
        json = json + "{\"fileName\":\""+ fileName[j]+ "\",\"fileSize\":\""+ fileSizeVal + "\",\"changeType\":\""+ changeType[j]+ "\",\"changeSum\":\""+ changeSum[j]+ "\",\"changeTime\":\""+ changeTime[j]+ "\"}";
      }

        length++;

        if(j != i - 1)
        {
        json = json + ",";
      }
      else
      {
        json = json + "]";
        jsonSend = JSON.parse(json);
        let array1 = [];
        array1.push(jsonSend);
        res.send(array1);
      }

    }
}
async function downloadDatabaseTable(json, res)
{

  const mysql = require('mysql2/promise');
  let connection = await mysql.createConnection(dbCredentials);



    let tableFile = "SELECT * FROM DOWNLOAD;";
    var downloadDesc = [];
    // var changeSum = [];
    var downloadTime = [];
    var fileName = [];

    const [rows3, fields3] = await connection.execute(tableFile);
    let svgId = "1";
    let i = 0;
    for(let row of rows3){
      downloadDesc[i] = row.d_description;
      let n = row.d_description.split(" ");
      downloadTime[i] = n[n.length - 1];
      var words = downloadDesc[i].split(' ');
      fileName[i] = words[3];
      i++;
    }
    var length = 0;
    var jsonSend
    for(let j = 0; j < i; j ++ )
    {


      if(length ==0)
      {
        json = "[{\"fileName\":\""+ fileName[j]+ "\",\"downloadTime\":\""+ downloadTime[j]+ "\",\"downloadDesc\":\""+ downloadDesc[j]+ "\"}";
      }
      else
      {
        json = json + "{\"fileName\":\""+ fileName[j]+ "\",\"downloadTime\":\""+ downloadTime[j]+ "\",\"downloadDesc\":\""+ downloadDesc[j]+ "\"}";
      }

        length++;

        if(j != i - 1)
        {
        json = json + ",";
      }
      else
      {
        json = json + "]";
        jsonSend = JSON.parse(json);
        let array2 = [];
        array2.push(jsonSend);
        res.send(array2);
      }

    }
}



app.listen(portNum);
console.log('Running app at localhost: ' + portNum);