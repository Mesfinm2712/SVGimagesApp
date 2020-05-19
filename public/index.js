/************************************************************************************/
let listArray = [], result = null, dropdown, editTitle = null, title = null, description = null, createSVGTitle = null, createSVGDesc = null, fileName = null;
let createSVG = null;
let createRectObj = null, createCircObj = null, xVal = null; yVal = null, width = null, height = null, units = null;
let desc = null;
let attName = null, attVal = null;
let dropDownFile = null;
var temp = [], tempVal = [];
var total = 0, counterCirc = 0, counterRect = 0, circScale = 0, rectScale;
var databaseName = null, username = null, password = null;
var dbConnect = false;
var databaseCount = 0;
var globalCount = 0;
var downloadFile = null;
var shapeChosen = "";
var oldRec = 0;
var newRec = 0;
var tempRange = [], tempFileName4 = [], tempFileSize4 = [], tempRect = [];


var load = new Date();


function displayDBFunc()
{
    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 

     $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/dbstatus',   //The server endpoint we are connecting to
            data: {
                sendData: o,
                sendUser: m,
                sendPass: n
            },
            success: function (data) {
                
                alert("Database has " + data.file + " files, " +data.changeCount + " changes, and " +data.download + " downloads.");
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log("e:"+error); 
            } 
        });

}



function clearDataFunc()
{


    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 

     $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/clearData',   //The server endpoint we are connecting to
            data: {
                sendData: o,
                sendUser: m,
                sendPass: n
            },
            success: function (data) {
                
            
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log("e:"+error); 
            } 
        });
                $(".dataFile tbody").remove();
                $(".query2 tbody").remove();
                $(".query3 tbody").remove();
                $(".query4 tbody").remove();
                $(".query5 tbody").remove();
                $(".query6 tbody").remove();



}



function updateTable1()
{

    let x = 0;
    let element = document.getElementById('dropdownId');
    let fileSelected = element.options[element.selectedIndex].text;

    $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/updatePicLog',   //The server endpoint we are connecting to
            data: {
                sendFile: fileSelected //change this
            },
            success: function (data) {
                
                let newFileTable;
                let titleDescTable;

                if (data.length != 0)
                {
                    $(".viewPanel tbody").remove();

                    let newFileTable = "<tbody align = \"center\"><tr>"
                            + "<td><center> <img src=\"" + data.file + "\"\"width=\"110\" height=\"135\"></center></td> </tr> </tbody>"

                    $(".viewPanel").append(newFileTable);
      
                }
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log("e:"+error); 
            } 
        });



   $.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/updateShape',   //The server endpoint we are connecting to

        success: function (data) {


            $(".fileTable tbody").remove();

            dropdown = document.getElementById('dropdownId');


            for(x = 0; x < data.length; x++)
            {

                let name = "./uploads/" + data[x].file;

                let fileName = data[x].file.substring(10, data[x].file.length);

                downloadFile = fileName;
                //make it downloadable


                let newFileTable = "<tbody align = \"center\"><tr>"

                    + "<td><center> <img src=\"" + data[x].file + "\"width=\"110\" height=\"135\"></center></td>"
                    + "<td><center><a href=\"" + data[x].file + "\"download onclick='downloadClick(this)'>" + fileName + "</a></center></td>"                    
                    + "<td><center>" + data[x].fileSize + "KB</center></td>"
                    + "<td><center>" + data[x].numRect + "</center></td>"
                    + "<td><center>" + data[x].numCirc + "</center></td>"
                    + "<td><center>" + data[x].numPaths + "</center></td>"
                    + "<td><center>" + data[x].numGroups + "</center></td>"
                    + "</tr> </tbody>"


                $(".fileTable").append(newFileTable);

            }

            if (data.length == 0) 
            {
                let temp = "<tbody><th>NA</th></tr></tbody>"
            }


        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        } 
    });



}






function createCookie(name, value) {
  document.cookie = name + "=" + value + "; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}



downloadClick = function(link)
{

  var t = link.innerText || link.textContent;
  // alert(t);

    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 


    $.ajax({

      type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/downloadTrack',   //The server endpoint we are connecting to
        data: {
            sendFile: t,
            sendData: o,
            sendUser: m,
            sendPass: n
        },
        success: function (data) {

        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        } 

    });

}

//make all buttons disabled
function dataBaseLogin() {


    if(databaseCount >= 1)
    {

        var bt = document.getElementById('myFile');
        bt.disabled = false;

        bt = document.getElementById('query4Button');
        bt.disabled = false;

        bt = document.getElementById('submitFile');
        bt.disabled = false;

        bt = document.getElementById('editTitleVal');
        bt.disabled = false;
        
        bt = document.getElementById('editDescVal');
        bt.disabled = false;
        
        bt = document.getElementById('createAttId');
        bt.disabled = false;
        
        var bt = document.getElementById('createSVGId');
        bt.disabled = false;


        bt = document.getElementById('createRectId');
        bt.disabled = false;

        bt = document.getElementById('createCircId');
        bt.disabled = false;

        bt = document.getElementById('scaleCircId');
        bt.disabled = false;

        bt = document.getElementById('scaleRectId');
        bt.disabled = false;

        bt = document.getElementById('clearData');
        bt.disabled = false;
        
        bt = document.getElementById('displayDB');
        bt.disabled = false;

        $("#orderFile").prop("disabled", false);
        $("#orderQuery2").prop("disabled", false); 
        $("#orderQuery3").prop("disabled", false); 
        $("#orderQuery4").prop("disabled", false); 
        $("#orderQuery5").prop("disabled", false); 
        $("#orderQuery6").prop("disabled", false); 

    }
    else
    {


        databaseName = prompt("Enter the Database Name", "");
        username = prompt("Database username", "");
        password = prompt("Database password", "");

        createCookie("username", username, 365); //save input in cookie
        createCookie("password", password, 365); //save input in cookie
        createCookie("databaseName", databaseName, 365); //save input in cookie



    }

}



function editTitleFunc() {
  createSVG = null;
  title = prompt("Edit the Title", "edit title");
  if(title.length <= 256) {


  }
  else
  {
    while(title.length > 256)
    {
        title = prompt("Error: Title is too long, try again", "edit title");

    }
  }


}

function editDescFunc() {
  description = prompt("Edit the Description", "edit description");
  if(description.length <= 256) 
  {


  }
  else
  {
    while(description.length > 256)
    {
        description = prompt("Error: description is too long, try again", "edit description");

    }
  }


}
function editAtt() {//needs to modify existing attribute
    attName= prompt("Edit the attribute name", "text");


    if(attName === "viewBox" || attName === "height" || attName === "width" || attName === "stroke-width"|| attName === "enable-background" || attName === "version")
    {
        boolVal = 1;
    }
    else
    {

        let boolVal = 0;
        while(attName.length == 0 || boolVal == 0)
        {
            attName = prompt("Error Invalid attribute name\nTry Again", "text");


            if(attName === "viewBox" || attName === "height" || attName === "width" || attName === "stroke-width"|| attName === "enable-background" || attName === "version")
            {
                boolVal = 1;
                break;
            }

        }
    }
    boolVal = 0;
    attVal= prompt("Edit the attribute value", "text");//
    if(isNaN(attVal))
    {
        while(attVal.length == 0 || boolVal == 0)
        {
            attVal = prompt("Error Invalid attribute value\nTry Again", "text");
            if(isNaN(attVal))
            {
               
            }
            else
            {
                boolVal = 1;
                break;
            }
        }
    }
    else
    {
        boolVal = 1;
    }


    }
function createSVGImage() {

    let boolVal = 0; 

    for(let x = 0; x < 3; x++)
    {
        
        if(boolVal == 0)
        {
          fileName = prompt("Input Filename", "type(.svg)");
          boolVal = 1;
          
            while(fileName.length == 0)
            {

                fileName = prompt("Error Invalid Filename\n Input FileName", "type(.svg)");

                if(fileName.length!= 0)
                {
                    break;
                }
          }
        }
        else if (boolVal == 1)
        {
          createSVGTitle = prompt("Input title", "title");
          boolVal = 2;
        }
        else if (boolVal == 2)
        {
         createSVGDesc = prompt("Input Description", "description");
        }
    }
    fileName = fileName + ".svg";
    createSVG = "{\"title\":\"" + createSVGTitle + "\",\"descr\":\"" + createSVGDesc + "\"}";
}


function createRect() //add to a function in the server
{
    let boolVal = 0; 

    for(let x = 0; x < 5; x++)
    {


        if(boolVal == 0)
        {
            xVal = prompt("x value", "0");
            boolVal = 1;
            if(isNaN(xVal)){
                while(xVal.length == 0 || isNaN(xVal))
                {
                    xVal = prompt("Error:\n\tMust input proper x value", "0");//check if they are float vals
                    if(xVal.length!= 0 && isNaN(xVal) == false)
                    {
                        break;
                    }
                }
            }else{
                //valid number
            }
        }
        else if (boolVal == 1)
        {
         yVal = prompt("y value", "0");
          boolVal = 2;
            if(isNaN(yVal)){
                while(yVal.length == 0 || isNaN(yVal))
                {
                    yVal = prompt("Error:\n\tMust input proper y value", "0");//check if they are float vals
                    if(yVal.length!= 0 && isNaN(yVal) == false)
                    {
                        break;
                    }
                }
            }else{
                //valid number
            }
        }
        else if (boolVal == 2)
        {
         width = prompt("Input width", "0");
          boolVal = 3;
            if(isNaN(width)){
                while(width.length == 0 || isNaN(width))
                {
                    width = prompt("Error:\n\tMust input proper width value", "0");//check if they are float vals
                    if(width.length!= 0 && isNaN(width) == false)
                    {
                        break;
                    }
                }
            }else{
                //valid number
            }
        }
        else if (boolVal == 3)
        {
          height = prompt("Input height", "0");
          boolVal = 4;
            if(isNaN(height)){
                while(height.length == 0 || isNaN(height))
                {
                    height = prompt("Error:\n\tMust input proper height value", "0");//check if they are float vals
                    if(height.length!= 0 && isNaN(height) == false)
                    {
                        break;
                    }
                }
            }else{
                //valid number
            }
        }
        else if (boolVal == 4)
        {
          units = prompt("Input the units", "cm");
          if (units != null) {
          }
        }
    }


    createRectObj= "{\"x\":" + xVal + ",\"y\":" + yVal + ",\"w\":" + width + ",\"h\":" + height +  ",\"units\":\"" + units + "\"}";


}
function createCirc() //add to a function in the server
{
    let boolVal = 0; 

    for(let x = 0; x < 4; x++)
    {


        if(boolVal == 0)
        {
            xVal = prompt("cx value", "0");
            boolVal = 1;
            if(isNaN(xVal)){
                while(xVal.length == 0 || isNaN(xVal))
                {
                    xVal = prompt("Error:\n\tMust input proper x value", "0");//check if they are float vals
                    if(xVal.length!= 0 && isNaN(xVal) == false)
                    {
                        break;
                    }
                }
            }else{
                //valid number
            }
        }
        else if (boolVal == 1)
        {
         yVal = prompt("cy value", "0");
          boolVal = 2;
            if(isNaN(yVal)){
                while(yVal.length == 0 || isNaN(yVal))
                {
                    yVal = prompt("Error:\n\tMust input proper y value", "0");//check if they are float vals
                    if(yVal.length!= 0 && isNaN(yVal) == false)
                    {
                        break;
                    }
                }
            }else{
                //valid number
            }
        }
        else if (boolVal == 2)
        {
         width = prompt("input radius", "0");
          boolVal = 3;
            if(isNaN(width)){
                while(width.length == 0 || isNaN(width))
                {
                    width = prompt("Error:\n\tMust input proper width value", "0");//check if they are float vals
                    if(width.length!= 0 && isNaN(width) == false)
                    {
                        break;
                    }
                }
            }else{
                //valid number
            }
        }
        else if (boolVal == 3)
        {
          units = prompt("Input the units", "cm");
          if(units === "cm" || units === "")
          {
            // alert("equal");
          }
          else
          {
              while(units != "cm" || units != "")
              {
                units = prompt("Error:\n\tMust input proper units", "0");//check if they are float vals

                  if(units === "cm" || units === "")
                  {
                    break;
                  }

              }
          }

        }
    }


    createCircObj= "{\"cx\":" + xVal + ",\"cy\":" + yVal + ",\"r\":" + width + ",\"units\":\"" + units + "\"}";

}
function getScaleCirc()
{
    let boolVal = 0;
    if(boolVal == 0)
    {
        circScale = prompt("input scale factor", "0");
        boolVal = 1;
        if(isNaN(circScale)){
            while(circScale.length == 0 || isNaN(circScale))
            {
                circScale = prompt("Error:\n\tMust input proper x value", "0");//check if they are float vals
                if(circScale.length!= 0 && isNaN(circScale) == false)
                {
                    break;
                }
            }
        }else{
            //valid number
        }
    }
}
function getScaleRect()
{
    let boolVal = 0;
    if(boolVal == 0)
    {
        rectScale = prompt("input scale factor", "0");
        boolVal = 1;
        if(isNaN(rectScale)){
            while(rectScale.length == 0 || isNaN(rectScale))
            {
                rectScale = prompt("Error:\n\tMust input proper x value", "0");//check if they are float vals
                if(rectScale.length!= 0 && isNaN(rectScale) == false)
                {
                    break;
                }
            }
        }else{
            //valid number
        }
    }
}

function alertBox() {
  alert("Both attempts were incorrect, please try again!");
}
function connectedAlert() {
  alert("Connect successfully!");
}


function updateDownTableData(fileSelected)
{

    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 

 $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/updateDownTableData',   //The server endpoint we are connecting to
            data: {
                sendData: o,
                sendUser: m,
                sendPass: n
            },
            success: function (data) {
            var fileName = [];
            var downloadDesc = [];
            var downloadTime= [];

            $(".query5 tbody").remove();

            let numOfDown = 1;
            let tempFileName = [];
            let arrayFileName = [], arrayCount = [];
            for(let x = 0; x < data[0].length; x++)
            {
                tempFileName[x] = data[0][x].fileName;
            }

            tempFileName.sort();

            let num = 0;
            var current = null;
            var cnt = 0;
            for (var i = 0; i < tempFileName.length; i++) {
                if (tempFileName[i] != current) {
                    if (cnt > 0) {
                        arrayFileName[num] = current;
                        arrayCount[num] = cnt;
                        num++;
                        // let tempNummer = num;
                    }
                    current = tempFileName[i];
                    cnt = 1;
                } else {
                    cnt++;
                }
            }
            if (cnt > 0) {
                arrayFileName[num] = current;
                arrayCount[num] = cnt;
                num++;
            }

            let counter = 0, compareNum = 0;

            let x = 0;
                while(arrayFileName.length != counter)
                {
                        var words = data[0][x].downloadDesc.split(' ');

                        if(words[3] == arrayFileName[counter])
                        {
                        let query5 = "<tbody align = \"center\"><tr>"

                            + "<td><center>" + arrayFileName[counter] + "</center></td>"
                            + "<td><center>" + data[0][x].downloadDesc + "</center></td>"
                            + "<td><center>" + data[0][x].downloadTime + "</center></td>"
                            + "<td><center>" + arrayCount[counter] + "</center></td>"
                            + "</tr> </tbody>";
                            $(".query5").append(query5);
                        fileName[counter] = arrayFileName[counter];
                        downloadDesc[counter] = data[0][x].downloadDesc;
                        downloadTime[counter] = data[0][x].downloadTime;
                        counter++;
                        x = 0;
                        }

                    x++;

            }

            var tempArr = [];

            for(x = 0; x < fileName.length; x++)
            {
                 tempArr[x] = fileName[x];
            }

            tempArr.sort(function(s1, s2){
                var l=s1.toLowerCase(), m=s2.toLowerCase();
                return l===m?0:l>m?1:-1;
            });

            if(fileSelected == "order by file name")
            {
                $(".query5 tbody").remove();

                
                for(let y = 0; y < fileName.length ; y++)
                {

                    for(x = 0; x < fileName.length + 1; x++)
                    {


                        if(tempArr[y] == fileName[x])
                        {

                        let query5 = "<tbody align = \"center\"><tr>"

                            + "<td><center>" + fileName[x] + "</center></td>"                    
                            + "<td><center>" + downloadDesc[x] + "</center></td>"
                            + "<td><center>" + downloadTime[x] + "</center></td>"
                            + "<td><center>" + arrayCount[x]+ "</center></td>"

                            + "</tr> </tbody>"

                        $(".query5").append(query5);
                        break;

                        }

                    }

                }
            }

            var tempNum = [];

            for(x = 0; x < arrayCount.length; x++)
            {
                 tempNum[x] = arrayCount[x];
            }
            tempNum.sort();
            tempNum.reverse();

            if(fileSelected == "order by download count")
            {
                $(".query5 tbody").remove();

                
                for(let y = 0; y < arrayCount.length ; y++)
                {

                    for(x = 0; x < arrayCount.length + 1; x++)
                    {


                        if(tempNum[y] == arrayCount[x])
                        {

                        let query5 = "<tbody align = \"center\"><tr>"

                            + "<td><center>" + fileName[x] + "</center></td>"                    
                            + "<td><center>" + downloadDesc[x] + "</center></td>"
                            + "<td><center>" + downloadTime[x] + "</center></td>"
                            + "<td><center>" + arrayCount[x]+ "</center></td>"

                            + "</tr> </tbody>"

                        $(".query5").append(query5);
                        break;

                        }

                    }

                }
            }

            var tempNum1 = [];

            for(x = 0; x < arrayCount.length; x++)
            {
                 tempNum1[x] = downloadTime[x];
            }
            tempNum1.sort();
            tempNum1.reverse();

            if(fileSelected == "order by most recent download date")
            {
                $(".query5 tbody").remove();

                
                for(let y = 0; y < arrayCount.length ; y++)
                {

                    for(x = 0; x < arrayCount.length + 1; x++)
                    {


                        if(tempNum1[y] == downloadTime[x])
                        {

                        let query5 = "<tbody align = \"center\"><tr>"

                            + "<td><center>" + fileName[x] + "</center></td>"                    
                            + "<td><center>" + downloadDesc[x] + "</center></td>"
                            + "<td><center>" + downloadTime[x] + "</center></td>"
                            + "<td><center>" + arrayCount[x]+ "</center></td>"

                            + "</tr> </tbody>"

                        $(".query5").append(query5);
                        break;

                        }

                    }

                }
            }
    

            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            } 
        });
}



function updateChangeTableData(fileSelected)
{

    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 

 $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/updateChangeTableData',   //The server endpoint we are connecting to
            data: {
                sendData: o,
                sendUser: m,
                sendPass: n
            },
            success: function (data) {

            $(".query6 tbody").remove();

            for(let x = 0; x < data[0].length; x++)
            {

                let query6 = "<tbody align = \"center\"><tr>"

                    + "<td><center>" + data[0][x].fileName + "</center></td>"                    
                    + "<td><center>" + data[0][x].changeType + "</center></td>"
                    + "<td><center>" + data[0][x].changeSum + "</center></td>"
                    + "<td><center>" + data[0][x].changeTime + "</center></td>"
                    + "<td><center>1</center></td>"


                    + "</tr> </tbody>"

                $(".query6").append(query6);
            }


            var tempArr = [];
            var tempNum = [];

            for(x = 0; x < data[0].length; x++)
            {
                 tempArr[x] = data[0][x].changeType;
            }

            tempArr.sort(function(s1, s2){
                var l=s1.toLowerCase(), m=s2.toLowerCase();
                return l===m?0:l>m?1:-1;
            });

            for(x = 0; x < data[0].length; x++)
            {
                 tempNum[x] = data[0][x].changeTime;
            }
            tempNum.sort();

            if(fileSelected == "order by change type")
            {
                $(".query6 tbody").remove();

                
                for(let y = 0; y < data[0].length ; y++)
                {

                    for(x = 0; x < data[0].length + 1; x++)
                    {


                        if(tempArr[y] == data[0][x].changeType)
                        {

                        let query6 = "<tbody align = \"center\"><tr>"

                            + "<td><center>" + data[0][x].fileName + "</center></td>"                    
                            + "<td><center>" + data[0][x].changeType + "</center></td>"
                            + "<td><center>" + data[0][x].changeSum + "</center></td>"
                            + "<td><center>" + data[0][x].changeTime + "</center></td>"
                            + "<td><center>1</center></td>"


                            + "</tr> </tbody>"

                        $(".query6").append(query6);
                        break;

                        }

                    }

                }
            }
            if(fileSelected == "order by change date")
            {
                $(".query6 tbody").remove();

                
                for(y = 0; y < data[0].length; y++)
                {

                    for(x = 0; x < data[0].length + 1; x++)
                    {


                        if(tempNum[y] == data[0][x].changeTime)
                        {

                            let query6 = "<tbody align = \"center\"><tr>"

                                + "<td><center>" + data[0][x].fileName + "</center></td>"                    
                                + "<td><center>" + data[0][x].changeType + "</center></td>"
                                + "<td><center>" + data[0][x].changeSum + "</center></td>"
                                + "<td><center>" + data[0][x].changeTime + "</center></td>"
                                + "<td><center>1</center></td>"

                                + "</tr> </tbody>"

                            $(".query6").append(query6);
                            break;

                        }

                    }

                }
            }
            var tempNum2 = [];
            tempNum2=tempNum.reverse();  
            if(fileSelected == "order by most recent changes")
            {
                $(".query6 tbody").remove();

                
                for(y = 0; y < data[0].length; y++)
                {

                    for(x = 0; x < data[0].length + 1; x++)
                    {


                        if(tempNum2[y] == data[0][x].changeTime)
                        {

                            let query6 = "<tbody align = \"center\"><tr>"

                                + "<td><center>" + data[0][x].fileName + "</center></td>"                    
                                + "<td><center>" + data[0][x].changeType + "</center></td>"
                                + "<td><center>" + data[0][x].changeSum + "</center></td>"
                                + "<td><center>" + data[0][x].changeTime + "</center></td>"
                                + "<td><center>1</center></td>"

                                + "</tr> </tbody>"

                            $(".query6").append(query6);
                            break;

                        }

                    }

                }
            }          

            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            } 
        });
}





function updateFileTableData(fileSelected, number)
{

    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 


        $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/updateFileTableData',   //The server endpoint we are connecting to
            data: {
                sendData: o,
                sendUser: m,
                sendPass: n
            },
            success: function (data) {


            if( number == 1 || number == 3)
            {
                $(".dataFile tbody").remove();

                for(let x = 0; x < data[0].length; x++)
                {

                    let dataFile = "<tbody align = \"center\"><tr>"

                        + "<td><center>" + data[0][x].fileName + "</center></td>"                    
                        + "<td><center>" + data[0][x].fileSize + "</center></td>"
                        + "<td><center>" + data[0][x].title + "</center></td>"
                        + "<td><center>" + data[0][x].description + "</center></td>"
                        + "<td><center>" + data[0][x].rectangles + "</center></td>"
                        + "<td><center>" + data[0][x].circles + "</center></td>"
                        + "<td><center>" + data[0][x].paths + "</center></td>"
                        + "<td><center>" + data[0][x].groups + "</center></td>"
                        + "<td><center>" + data[0][x].timeStamp + "</center></td>"

                        + "</tr> </tbody>"

                    $(".dataFile").append(dataFile);

                }

            }
            dropdown = document.getElementById('orderFile');

            var tempArr = [];
            var tempNum = [];

            for(x = 0; x < data[0].length; x++)
            {
                 tempArr[x] = data[0][x].fileName;
            }

            tempArr.sort(function(s1, s2){
                var l=s1.toLowerCase(), m=s2.toLowerCase();
                return l===m?0:l>m?1:-1;
            });

            for(x = 0; x < data[0].length; x++)
            {
                 tempNum[x] = data[0][x].fileSize;
            }
            tempNum.sort();



            if(fileSelected == "order by filename")
            {
                $(".dataFile tbody").remove();

                
                for(let y = 0; y < data[0].length ; y++)
                {

                    for(x = 0; x < data[0].length + 1; x++)
                    {


                        if(tempArr[y] == data[0][x].fileName)
                        {


                        let dataFile = "<tbody align = \"center\"><tr>"

                            + "<td><center>" + data[0][x].fileName + "</center></td>"                    
                            + "<td><center>" + data[0][x].fileSize + "</center></td>"
                            + "<td><center>" + data[0][x].title + "</center></td>"
                            + "<td><center>" + data[0][x].description + "</center></td>"
                            + "<td><center>" + data[0][x].rectangles + "</center></td>"
                            + "<td><center>" + data[0][x].circles + "</center></td>"
                            + "<td><center>" + data[0][x].paths + "</center></td>"
                            + "<td><center>" + data[0][x].groups + "</center></td>"
                            + "<td><center>" + data[0][x].timeStamp + "</center></td>"

                            + "</tr> </tbody>"

                        $(".dataFile").append(dataFile);
                        break;

                        }

                    }

                }
            }
            tempNum.reverse();
            if(fileSelected == "order by file size")
            {
                $(".dataFile tbody").remove();

                
                for(y = 0; y < data[0].length; y++)
                {

                    for(x = 0; x < data[0].length + 1; x++)
                    {


                        if(tempNum[y] == data[0][x].fileSize)
                        {


                        let dataFile = "<tbody align = \"center\"><tr>"

                            + "<td><center>" + data[0][x].fileName + "</center></td>"                    
                            + "<td><center>" + data[0][x].fileSize + "</center></td>"
                            + "<td><center>" + data[0][x].title + "</center></td>"
                            + "<td><center>" + data[0][x].description + "</center></td>"
                            + "<td><center>" + data[0][x].rectangles + "</center></td>"
                            + "<td><center>" + data[0][x].circles + "</center></td>"
                            + "<td><center>" + data[0][x].paths + "</center></td>"
                            + "<td><center>" + data[0][x].groups + "</center></td>"
                            + "<td><center>" + data[0][x].timeStamp + "</center></td>"

                            + "</tr> </tbody>"

                        $(".dataFile").append(dataFile);
                        break;

                        }

                    }

                }
            }          


            //query 2
            var timeArr = [];
            for(x = 0; x < data[0].length; x++)
            {
                 timeArr[x] = data[0][x].timeStamp;
            }
            timeArr.sort();


            if(number == 2 || number == 3)
            {

            $(".query2 tbody").remove();

                
                for(y = 0; y < data[0].length; y++)
                {

                    for(x = 0; x < data[0].length + 1; x++)
                    {


                        if(timeArr[y] == data[0][x].timeStamp)
                        {


                        let query2 = "<tbody align = \"center\"><tr>"

                            + "<td><center>" + data[0][x].fileName + "</center></td>"                    
                            + "<td><center>" + data[0][x].fileSize + "</center></td>"
                            + "<td><center>" + data[0][x].title + "</center></td>"
                            + "<td><center>" + data[0][x].description + "</center></td>"
                            + "<td><center>" + data[0][x].rectangles + "</center></td>"
                            + "<td><center>" + data[0][x].circles + "</center></td>"
                            + "<td><center>" + data[0][x].paths + "</center></td>"
                            + "<td><center>" + data[0][x].groups + "</center></td>"
                            + "<td><center>" + data[0][x].timeStamp + "</center></td>"

                            + "</tr> </tbody>"

                        $(".query2").append(query2);
                        break;

                        }

                    }

                }
            }
            if(fileSelected == "order by filenames")
            {
                $(".query2 tbody").remove();

                
                for(let y = 0; y < data[0].length ; y++)
                {

                    for(x = 0; x < data[0].length + 1; x++)
                    {


                        if(tempArr[y] == data[0][x].fileName)
                        {


                        let query2 = "<tbody align = \"center\"><tr>"

                            + "<td><center>" + data[0][x].fileName + "</center></td>"                    
                            + "<td><center>" + data[0][x].fileSize + "</center></td>"
                            + "<td><center>" + data[0][x].title + "</center></td>"
                            + "<td><center>" + data[0][x].description + "</center></td>"
                            + "<td><center>" + data[0][x].rectangles + "</center></td>"
                            + "<td><center>" + data[0][x].circles + "</center></td>"
                            + "<td><center>" + data[0][x].paths + "</center></td>"
                            + "<td><center>" + data[0][x].groups + "</center></td>"
                            + "<td><center>" + data[0][x].timeStamp + "</center></td>"

                            + "</tr> </tbody>"

                        $(".query2").append(query2);
                        break;

                        }

                    }

                }

            }
            if(fileSelected == "order by file sizes")
            {
                $(".query2 tbody").remove();

                
                for(y = 0; y < data[0].length; y++)
                {

                    for(x = 0; x < data[0].length + 1; x++)
                    {


                        if(tempNum[y] == data[0][x].fileSize)
                        {


                        let query2 = "<tbody align = \"center\"><tr>"

                            + "<td><center>" + data[0][x].fileName + "</center></td>"                    
                            + "<td><center>" + data[0][x].fileSize + "</center></td>"
                            + "<td><center>" + data[0][x].title + "</center></td>"
                            + "<td><center>" + data[0][x].description + "</center></td>"
                            + "<td><center>" + data[0][x].rectangles + "</center></td>"
                            + "<td><center>" + data[0][x].circles + "</center></td>"
                            + "<td><center>" + data[0][x].paths + "</center></td>"
                            + "<td><center>" + data[0][x].groups + "</center></td>"
                            + "<td><center>" + data[0][x].timeStamp + "</center></td>"

                            + "</tr> </tbody>"

                        $(".query2").append(query2);
                        break;

                        }

                    }

                }
                
            }

            if(fileSelected == "order by creation dates")
            {
                // var timeArr = [];
                for(x = 0; x < data[0].length; x++)
                {
                     timeArr[x] = data[0][x].timeStamp;
                }
                timeArr.sort();

                $(".query2 tbody").remove();

                
                for(y = 0; y < data[0].length; y++)
                {

                    for(x = 0; x < data[0].length + 1; x++)
                    {


                        if(timeArr[y] == data[0][x].timeStamp)
                        {

                            if(data[0][y].fileName != data[0][x].fileName)
                            {

                            let query2 = "<tbody align = \"center\"><tr>"

                                + "<td><center>" + data[0][y].fileName + "</center></td>"                    
                                + "<td><center>" + data[0][y].fileSize + "</center></td>"
                                + "<td><center>" + data[0][y].title + "</center></td>"
                                + "<td><center>" + data[0][y].description + "</center></td>"
                                + "<td><center>" + data[0][y].rectangles + "</center></td>"
                                + "<td><center>" + data[0][y].circles + "</center></td>"
                                + "<td><center>" + data[0][y].paths + "</center></td>"
                                + "<td><center>" + data[0][y].groups + "</center></td>"
                                + "<td><center>" + data[0][y].timeStamp + "</center></td>"

                                + "</tr> </tbody>"

                                $(".query2").append(query2);
                            }
                            else
                            {


                            let query2 = "<tbody align = \"center\"><tr>"

                                + "<td><center>" + data[0][x].fileName + "</center></td>"                    
                                + "<td><center>" + data[0][x].fileSize + "</center></td>"
                                + "<td><center>" + data[0][x].title + "</center></td>"
                                + "<td><center>" + data[0][x].description + "</center></td>"
                                + "<td><center>" + data[0][x].rectangles + "</center></td>"
                                + "<td><center>" + data[0][x].circles + "</center></td>"
                                + "<td><center>" + data[0][x].paths + "</center></td>"
                                + "<td><center>" + data[0][x].groups + "</center></td>"
                                + "<td><center>" + data[0][x].timeStamp + "</center></td>"

                                + "</tr> </tbody>"

                                $(".query2").append(query2);
                            }


                        break;

                        }

                    }

                }
            }


            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            } 
        });


}
function getRangeAndShape()
{

    shapeChosen = prompt("Input shape ('rectangle', 'circle', 'path' or 'group') ", "0");
    while(shapeChosen != "rectangle" ||shapeChosen != "circle" ||shapeChosen != "path" ||shapeChosen != "group" )
    {


        if(shapeChosen == "rectangle" ||shapeChosen == "circle" ||shapeChosen == "path" ||shapeChosen == "group" )
        {
            break;
        }
        else
        {
        shapeChosen = prompt("Incorrect input, try again ('rectangle', 'circle', 'path' or 'group') ", "shape");

        }

    }

    oldRec = prompt("Input first number of the range to sort table ", "0");
    while(isNaN(oldRec))
    {
        if(isNaN(oldRec))
        {
            oldRec = prompt("Incorrect input, please enter a number. \nInput first number of the range to sort table ", "0");

         }
         else
         {
            break;
         }
     }

    newRec = prompt("Input second number of the range to sort table ", "0");

    while(shapeChosen != "rectangle" ||shapeChosen != "circle" ||shapeChosen != "path" ||shapeChosen != "group" )
    {
        if(isNaN(newRec))
        {
            //error
            newRec = prompt("Incorrect input, please enter a number. \nInput second number of the range to sort table ", "0");

         }
         else
         {
            break;
         }
     }

}
function updateQuery4()
{

    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 

    $.ajax({


      type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/query4Update',   //The server endpoint we are connecting to
        data: {
            sendData: o,
            sendUser: m,
            sendPass: n
        },
        success: function (data) {

            var counterForArr = 0;
            getRangeAndShape();

            $(".query4 tbody").remove();

            if(shapeChosen == "rectangle")
            {
                for(x = 0; x < data[0].length; x++)
                {

                    if(data[0][x].rectangles >= oldRec && data[0][x].rectangles <= newRec)
                    {
                    let query4 = "<tbody align = \"center\"><tr>"
                        + "<td><center>" +oldRec + " to "+ newRec+ "</center></td>"                    
                        + "<td><center>" + data[0][x].fileName + "</center></td>"      
                        + "<td><center>" + data[0][x].fileSize + "</center></td>"                    
                        + "<td><center>" + data[0][x].rectangles + " rectangles</center></td>"
                        + "</tr> </tbody>"

                    $(".query4").append(query4);

                    tempRange[counterForArr] = oldRec + " to "+ newRec;
                    tempFileName4[counterForArr] = data[0][x].fileName;
                    tempFileSize4[counterForArr] = data[0][x].fileSize;
                    tempRect[counterForArr] = data[0][x].rectangles + " rectangles";
                    counterForArr++;


                    }

                }

            }
            else if(shapeChosen == "circle")//take car if there are capital letters
            {
                 for(x = 0; x < data[0].length; x++)
                {

                    if(data[0][x].circles >= oldRec && data[0][x].circles <= newRec)
                    {
                    let query4 = "<tbody align = \"center\"><tr>"
                        + "<td><center>" +oldRec + " to "+ newRec+ "</center></td>"                    
                        + "<td><center>" + data[0][x].fileName + "</center></td>"   
                        + "<td><center>" + data[0][x].fileSize + "</center></td>"                                     
                        + "<td><center>" + data[0][x].circles + " circles</center></td>"

                        + "</tr> </tbody>"

                    $(".query4").append(query4);
                    tempRange[counterForArr] = oldRec + " to "+ newRec;
                    tempFileName4[counterForArr] = data[0][x].fileName;
                    tempFileSize4[counterForArr] = data[0][x].fileSize;
                    tempRect[counterForArr] = data[0][x].circles + " circles";
                    counterForArr++;
                    }

                }
            }
            else if(shapeChosen == "path")
            {
                 for(x = 0; x < data[0].length; x++)
                {

                    if(data[0][x].paths >= oldRec && data[0][x].paths <= newRec)
                    {
                    let query4 = "<tbody align = \"center\"><tr>"
                        + "<td><center>" +oldRec + " to "+ newRec+ "</center></td>"                    
                        + "<td><center>" + data[0][x].fileName + "</center></td>"   
                        + "<td><center>" + data[0][x].fileSize + "</center></td>"                                     
                        + "<td><center>" + data[0][x].paths + " paths</center></td>"

                        + "</tr> </tbody>"

                    $(".query4").append(query4);

                    tempRange[counterForArr] = oldRec + " to "+ newRec;
                    tempFileName4[counterForArr] = data[0][x].fileName;
                    tempFileSize4[counterForArr] = data[0][x].fileSize;
                    tempRect[counterForArr] = data[0][x].paths + " paths";
                    counterForArr++;
                    }

                }
            }
            else if(shapeChosen == "group")
            {
                for(x = 0; x < data[0].length; x++)
                {

                    if(data[0][x].groups >= oldRec && data[0][x].groups <= newRec)
                    {
                    let query4 = "<tbody align = \"center\"><tr>"
                        + "<td><center>" +oldRec + " to "+ newRec+ "</center></td>"                    
                        + "<td><center>" + data[0][x].fileName + "</center></td>"    
                        + "<td><center>" + data[0][x].fileSize + "</center></td>"                                    
                        + "<td><center>" + data[0][x].groups + " groups</center></td>"

                        + "</tr> </tbody>"

                    $(".query4").append(query4);

                    tempRange[counterForArr] = oldRec + " to "+ newRec;
                    tempFileName4[counterForArr] = data[0][x].fileName;
                    tempFileSize4[counterForArr] = data[0][x].fileSize;
                    tempRect[counterForArr] = data[0][x].groups + " groups";
                    counterForArr++;
                    }

                }
            }
            


        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        } 

    });

}
function sortQuery4(fileSelected)
{

            $(".query4 tbody").remove();

            var tempArr = [];
            var tempNum = [];

            for(x = 0; x < tempFileName4.length; x++)
            {
                 tempArr[x] = tempFileName4[x];
            }

            tempArr.sort(function(s1, s2){
                var l=s1.toLowerCase(), m=s2.toLowerCase();
                return l===m?0:l>m?1:-1;
            });


           if(fileSelected == "order by file name")
            {
            $(".query4 tbody").remove();

                
                for(let y = 0; y < tempFileName4.length ; y++)
                {

                    for(x = 0; x < tempFileName4.length + 1; x++)
                    {


                        if(tempArr[y] == tempFileName4[x])
                        {

                            let query4 = "<tbody align = \"center\"><tr>"
                                + "<td><center>" + tempRange[x] + "</center></td>"                    
                                + "<td><center>" + tempFileName4[x] + "</center></td>"    
                                + "<td><center>" + tempFileSize4[x] + "</center></td>"                                    
                                + "<td><center>" + tempRect[x] + "</center></td>"

                                + "</tr> </tbody>"

                            $(".query4").append(query4);
                            break;

                        }

                    }

                }

            }
            for(x = 0; x < tempFileSize4.length; x++)
            {
                 tempNum[x] = tempFileSize4[x];
            }

            tempNum.sort(function(s1, s2){
                var l=s1.toLowerCase(), m=s2.toLowerCase();
                return l===m?0:l>m?1:-1;
            });
            tempNum.reverse();
           if(fileSelected == "order by file size")
            {
            $(".query4 tbody").remove();

                
                for(let y = 0; y < tempFileSize4.length ; y++)
                {

                    for(x = 0; x < tempFileSize4.length + 1; x++)
                    {


                        if(tempNum[y] == tempFileSize4[x])
                        {

                            let query4 = "<tbody align = \"center\"><tr>"
                                + "<td><center>" + tempRange[x] + "</center></td>"                    
                                + "<td><center>" + tempFileName4[x] + "</center></td>"    
                                + "<td><center>" + tempFileSize4[x] + "</center></td>"                                    
                                + "<td><center>" + tempRect[x] + "</center></td>"

                                + "</tr> </tbody>"

                            $(".query4").append(query4);
                            break;

                        }

                    }

                }

            }

            for(x = 0; x < tempRect.length; x++)
            {
                 tempNum[x] = tempRect[x];
            }

            tempNum.sort(function(s1, s2){
                var l=s1.toLowerCase(), m=s2.toLowerCase();
                return l===m?0:l>m?1:-1;
            });
            tempNum.reverse();


           if(fileSelected == "order by shape count")
            {
            $(".query4 tbody").remove();

                
                for(let y = 0; y < tempRect.length ; y++)
                {

                    for(x = 0; x < tempRect.length + 1; x++)
                    {


                        if(tempNum[y] == tempRect[x])
                        {

                            let query4 = "<tbody align = \"center\"><tr>"
                                + "<td><center>" + tempRange[x] + "</center></td>"                    
                                + "<td><center>" + tempFileName4[x] + "</center></td>"    
                                + "<td><center>" + tempFileSize4[x] + "</center></td>"                                    
                                + "<td><center>" + tempRect[x] + "</center></td>"

                                + "</tr> </tbody>"

                            $(".query4").append(query4);
                            break;

                        }

                    }

                }

            }
}

function query3Update(fileSelected)
{

    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 

    var range1 = "", range2 = "";
 $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/query3',   //The server endpoint we are connecting to
            data: {
                sendData: o,
                sendUser: m,
                sendPass: n
            },
            success: function (data) {

            var tempNum = [];
            for(x = 0; x < data[0].length; x++)
            {
                 tempNum[x] = data[0][x].changeTime;
            }

            var numOfChanges = 1;

            tempNum.sort(function(s1, s2){
                var l=s1.toLowerCase(), m=s2.toLowerCase();
                return l===m?0:l>m?1:-1;
            });
            tempNum.reverse();

            $(".query3 tbody").remove();

            for(let y = 0; y < data[0].length ; y++)
            {

                for(x = 0; x < data[0].length + 1; x++)
                {


                    if(tempNum[y] == data[0][x].changeTime)
                    {

                        if(y == 1)
                        {
                            range1 = data[0][x].changeTime;
                        }
                        if (y == data[0].length - 1)
                        {
                            range2 = data[0][x].changeTime;
                        }
                        let query3 = "<tbody align = \"center\"><tr>"
                            + "<td><center>" + range1+  " to " + range2 +"</center></td>"
                            + "<td><center>" + data[0][x].fileName + "</center></td>"  
                            + "<td><center>" + data[0][x].fileSize + "</center></td>"
                            + "<td><center>" + data[0][x].changeType + "</center></td>"
                            + "<td><center>" + data[0][x].changeSum + "</center></td>"
                            + "<td><center>" + data[0][x].changeTime + "</center></td>"
                            + "<td><center>" + numOfChanges + "</center></td>"

                            + "</tr> </tbody>"

                        $(".query3").append(query3);
                        break;
                    }
                }
            }
            
            var tempNum = [];
            for(x = 0; x < data[0].length; x++)
            {
                 tempNum[x] = data[0][x].fileName;
            }

            tempNum.sort(function(s1, s2){
                var l=s1.toLowerCase(), m=s2.toLowerCase();
                return l===m?0:l>m?1:-1;
            });

            var tempDesc = [];

            if(fileSelected == "order by file name")
            {
                $(".query3 tbody").remove();
                for(let y = 0; y < data[0].length ; y++)
                {

                    for(x = 0; x < data[0].length + 1; x++)
                    {

                        if(tempNum[y] == data[0][x].fileName && !(tempDesc.includes(data[0][x].changeSum)))
                        {


                            let query3 = "<tbody align = \"center\"><tr>"
                                + "<td><center>" + range1+  " to " + range2 +"</center></td>"
                                + "<td><center>" + data[0][x].fileName + "</center></td>"   
                                + "<td><center>" + data[0][x].fileSize + "</center></td>"
                                + "<td><center>" + data[0][x].changeType + "</center></td>"
                                + "<td><center>" + data[0][x].changeSum + "</center></td>"
                                + "<td><center>" + data[0][x].changeTime + "</center></td>"
                                + "<td><center>" + numOfChanges + "</center></td>"
                                + "</tr> </tbody>"

                            $(".query3").append(query3);

                            tempDesc[y] = data[0][x].changeSum;
                            break;
                        }
                    }
                }

            }   

            for(x = 0; x < data[0].length; x++)
            {
                 tempNum[x] = data[0][x].fileSize;
            }

            tempNum.sort(function(s1, s2){
                var l=s1.toLowerCase(), m=s2.toLowerCase();
                return l===m?0:l>m?1:-1;
            });
            tempNum.reverse();

            var tempSum = [];
            if(fileSelected == "order by file size")
            {
                $(".query3 tbody").remove();
                for(let y = 0; y < data[0].length ; y++)
                {

                    for(x = 0; x < data[0].length + 1; x++)
                    {

                        if(tempNum[y] == data[0][x].fileSize && !(tempSum.includes(data[0][x].changeSum)))
                        {


                            let query3 = "<tbody align = \"center\"><tr>"
                                + "<td><center>" + range1+  " to " + range2 +"</center></td>"
                                + "<td><center>" + data[0][x].fileName + "</center></td>"   
                                + "<td><center>" + data[0][x].fileSize + "</center></td>"
                                + "<td><center>" + data[0][x].changeType + "</center></td>"
                                + "<td><center>" + data[0][x].changeSum + "</center></td>"
                                + "<td><center>" + data[0][x].changeTime + "</center></td>"
                                + "<td><center>" + numOfChanges + "</center></td>"
                                + "</tr> </tbody>"

                            $(".query3").append(query3);
                            tempSum[y] = data[0][x].changeSum;
                            break;
                        }
                    }
                }

            }   
            var tempNum = [];
            for(x = 0; x < data[0].length; x++)
            {
                 tempNum[x] = data[0][x].changeTime;
            }

            tempNum.sort(function(s1, s2){
                var l=s1.toLowerCase(), m=s2.toLowerCase();
                return l===m?0:l>m?1:-1;
            });
            tempNum.reverse();
            if(fileSelected == "order by most recent modification date")
            {
                $(".query3 tbody").remove();

                for(let y = 0; y < data[0].length ; y++)
                {

                    for(x = 0; x < data[0].length + 1; x++)
                    {


                        if(tempNum[y] == data[0][x].changeTime)
                        {

                            let query3 = "<tbody align = \"center\"><tr>"
                                + "<td><center>" + range1+  " to " + range2 +"</center></td>"
                                + "<td><center>" + data[0][x].fileName + "</center></td>"
                                + "<td><center>" + data[0][x].fileSize + "</center></td>"
                                + "<td><center>" + data[0][x].changeType + "</center></td>"
                                + "<td><center>" + data[0][x].changeSum + "</center></td>"
                                + "<td><center>" + data[0][x].changeTime + "</center></td>"
                                + "<td><center>" + numOfChanges + "</center></td>"
                                + "</tr> </tbody>"

                            $(".query3").append(query3);
                            break;
                        }
                    }
                }


            }   
                     

            },

                        fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            } 

        });
}

/************************************************************************************/
// Put all onload AJAX calls here, and event listeners
$(document).ready(function() {
    // updateQuery4();
    $("#orderFile").prop("disabled", true);
    $("#orderQuery2").prop("disabled", true); 
    $("#orderQuery3").prop("disabled", true); 
    $("#orderQuery4").prop("disabled", true); 
    $("#orderQuery5").prop("disabled", true); 
    $("#orderQuery6").prop("disabled", true); 


    //query1
    dropdown = document.getElementById('orderFile');

    let choice = document.createElement('option');
    choice.text = choice.value = "order by filename";

    dropdown.add(choice, 0);

    choice = document.createElement('option');
    choice.text = choice.value = "order by file size";

    dropdown.add(choice, 0);

    //query 2
    dropdown1 = document.getElementById('orderQuery2');

    let choice1 = document.createElement('option');
    choice1.text = choice1.value = "order by filenames";

    dropdown1.add(choice1, 0);

    choice1 = document.createElement('option');
    choice1.text = choice1.value = "order by file sizes";

    dropdown1.add(choice1, 0);

    choice1 = document.createElement('option');
    choice1.text = choice1.value = "order by creation dates";

    dropdown1.add(choice1, 0);

   //query 3
    dropdown5 = document.getElementById('orderQuery3');

    let choice5 = document.createElement('option');
    choice5.text = choice5.value = "order by file name";

    dropdown5.add(choice5, 0);

    choice5 = document.createElement('option');
    choice5.text = choice5.value = "order by file size";

    dropdown5.add(choice5, 0);

    choice5 = document.createElement('option');
    choice5.text = choice5.value = "order by most recent modification date";

    dropdown5.add(choice5, 0);

 
    //query 4
    dropdown4 = document.getElementById('orderQuery4');

    let choice4 = document.createElement('option');
    choice4.text = choice4.value = "order by file name";

    dropdown4.add(choice4, 0);

    choice4 = document.createElement('option');
    choice4.text = choice4.value = "order by file size";

    dropdown4.add(choice4, 0);

    choice4 = document.createElement('option');
    choice4.text = choice4.value = "order by shape count";

    dropdown4.add(choice4, 0);

    //query 5
    dropdown3 = document.getElementById('orderQuery5');

    let choice3 = document.createElement('option');
    choice3.text = choice3.value = "order by file name";

    dropdown3.add(choice3, 0);

    choice3 = document.createElement('option');
    choice3.text = choice3.value = "order by download count";

    dropdown3.add(choice3, 0);

    choice3 = document.createElement('option');
    choice3.text = choice3.value = "order by most recent download date";

    dropdown3.add(choice3, 0);
    //query 6
    dropdown2 = document.getElementById('orderQuery6');

    let choice2 = document.createElement('option');
    choice2.text = choice2.value = "order by change date";

    dropdown2.add(choice2, 0);

    choice2 = document.createElement('option');
    choice2.text = choice2.value = "order by change type";

    dropdown2.add(choice2, 0);

    choice2 = document.createElement('option');
    choice2.text = choice2.value = "order by most recent changes";

    dropdown2.add(choice2, 0);

    bt = document.getElementById('submitFile');
    bt.disabled = true;

    bt = document.getElementById('query4Button');
    bt.disabled = true;


    $('#orderFile').change('click', function(event)
    {
        let element = document.getElementById('orderFile');
        let textSelected = element.options[element.selectedIndex].text;
        updateFileTableData(textSelected, 1);
    });
    $('#orderQuery2').change('click', function(event)
    {
        let element = document.getElementById('orderQuery2');
        let textSelected = element.options[element.selectedIndex].text;
        updateFileTableData(textSelected, 2);
    });
    $('#orderQuery6').change('click', function(event)
    {
        let element1 = document.getElementById('orderQuery6');
        let textSelected1 = element1.options[element1.selectedIndex].text;
        updateChangeTableData(textSelected1);
    });
    $('#orderQuery5').change('click', function(event)
    {
        let element2 = document.getElementById('orderQuery5');
        let textSelected2 = element2.options[element2.selectedIndex].text;
        updateDownTableData(textSelected2);
    });
    $('#orderQuery4').change('click', function(event)
    {
        let element3 = document.getElementById('orderQuery4');
        let textSelected3 = element3.options[element3.selectedIndex].text;
        sortQuery4(textSelected3);
    });
    $('#orderQuery3').change('click', function(event)
    {
        let element4 = document.getElementById('orderQuery3');
        let textSelected4 = element4.options[element4.selectedIndex].text;
        query3Update(textSelected4);
    });


  $("#dataBaseButton").click(function(){

    let element = document.getElementById('orderFile');
    let textSelected = element.options[element.selectedIndex].text;

    let element1 = document.getElementById('orderQuery6');
    let textSelected1 = element1.options[element1.selectedIndex].text;



        $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/query4Button',   //The server endpoint we are connecting to
            data: {
                sendData: databaseName,
                sendUser: username,
                sendPass: password
            },
            success: function (data) {

            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            } 

        });
    });

    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 

    $.ajax({


      type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/downloadButton',   //The server endpoint we are connecting to
        data: {
            sendData: o,
            sendUser: m,
            sendPass: n
        },
        success: function (data) {
                updateTable1();
                let textSelected = "";
                updateFileTableData(textSelected,3);
                updateChangeTableData(textSelected);


        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        } 

    });


    //login to database
  $("#dataBaseButton").click(function(){

    let element = document.getElementById('orderFile');
    let textSelected = element.options[element.selectedIndex].text;

    let element1 = document.getElementById('orderQuery6');
    let textSelected1 = element1.options[element1.selectedIndex].text;


        $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/dataBaseButton',   //The server endpoint we are connecting to
            data: {
                sendData: databaseName,
                sendUser: username,
                sendPass: password
            },
            success: function (data) {

                updateFileTableData(textSelected, 3);
                updateChangeTableData(textSelected1);
                updateDownTableData(textSelected);
                query3Update(textSelected);



                if(data.answer == "connected")
                {
                    $("#orderFile").prop("disabled", false);
                    $("#orderQuery2").prop("disabled", false); 
                    $("#orderQuery3").prop("disabled", false); 
                    $("#orderQuery4").prop("disabled", false); 
                    $("#orderQuery5").prop("disabled", false); 
                    $("#orderQuery6").prop("disabled", false); 

                    bt = document.getElementById('query4Button');
                    bt.disabled = false;

                    dbConnect = true;
                    // globalCount++;
                    bt = document.getElementById('submitFile');
                    bt.disabled = false;

                    var bt = document.getElementById('myFile');
                    bt.disabled = false;

                    bt = document.getElementById('editTitleVal');
                    bt.disabled = false;
                    
                    bt = document.getElementById('editDescVal');
                    bt.disabled = false;
                    
                    bt = document.getElementById('createAttId');
                    bt.disabled = false;
                    
                    var bt = document.getElementById('createSVGId');
                    bt.disabled = false;


                    bt = document.getElementById('createRectId');
                    bt.disabled = false;

                    bt = document.getElementById('createCircId');
                    bt.disabled = false;

                    bt = document.getElementById('scaleCircId');
                    bt.disabled = false;

                    bt = document.getElementById('scaleRectId');
                    bt.disabled = false;

                    bt = document.getElementById('clearData');
                    bt.disabled = false;

                    bt = document.getElementById('displayDB');
                    bt.disabled = false;

                    databaseCount++;
                    dataBaseLogin();
                    connectedAlert();
                }
                else
                {
                    alert(data.answer);
                    databaseCount = 0;
                    dataBaseLogin();
                
                    if(data.answer != "connected")
                    {
                        $.ajax({
                                    type: 'get',            //Request type
                                    dataType: 'json',       //Data type - we will use JSON for almost everything 
                                    url: '/dataBaseButton',   //The server endpoint we are connecting to
                                    data: {
                                        sendData: databaseName,
                                        sendUser: username,
                                        sendPass: password
                                    },
                                    success: function (data) {
                                        updateFileTableData(textSelected, 3);
                                        updateChangeTableData(textSelected1);
                                        updateDownTableData(textSelected);

                                        if(data.answer == "connected")
                                        {
                                            $("#orderFile").prop("disabled", false);
                                            $("#orderQuery2").prop("disabled", false); 
                                            $("#orderQuery3").prop("disabled", false); 
                                            $("#orderQuery4").prop("disabled", false); 
                                            $("#orderQuery5").prop("disabled", false); 
                                            $("#orderQuery6").prop("disabled", false); 

                                            bt = document.getElementById('query4Button');
                                            bt.disabled = false;

                                            dbConnect = true;
                                            databaseCount++;
                                            bt = document.getElementById('submitFile');
                                            bt.disabled = false;
                                            var bt = document.getElementById('myFile');
                                            bt.disabled = false;

                                            bt = document.getElementById('editTitleVal');
                                            bt.disabled = false;
                                            
                                            bt = document.getElementById('editDescVal');
                                            bt.disabled = false;
                                            
                                            bt = document.getElementById('createAttId');
                                            bt.disabled = false;
                                            
                                            var bt = document.getElementById('createSVGId');
                                            bt.disabled = false;


                                            bt = document.getElementById('createRectId');
                                            bt.disabled = false;

                                            bt = document.getElementById('createCircId');
                                            bt.disabled = false;

                                            bt = document.getElementById('scaleCircId');
                                            bt.disabled = false;

                                            bt = document.getElementById('scaleRectId');
                                            bt.disabled = false;
                                            
                                            bt = document.getElementById('clearData');
                                            bt.disabled = false;

                                            bt = document.getElementById('displayDB');
                                            bt.disabled = false;
                                            // globalCount++;
                                            dataBaseLogin();
                                            connectedAlert();
                                        }
                                        else
                                        {
                                            // alert(data.answer);
                                            databaseCount = 0;
                                            alertBox();
                                        }
                                    },
                                    fail: function(error) {
                                        // Non-200 return, do something with error
                                        $('#blah').html("On page load, received error from server");
                                        console.log(error); 
                                    } 
                                });

                    }
                }



                // updateChangeTableData(textSelected1);
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            } 

        });
    });





    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 


  $("#scaleRectId").click(function(){
   // var total = temp.length;
        let element = document.getElementById('dropdownId');
        let fileSelected = element.options[element.selectedIndex].text;
    $.ajax({


      type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/scaleImageRect',   //The server endpoint we are connecting to
        data: {
            sendFile: fileSelected,
            rect: rectScale,
            sendData: o,
            sendUser: m,
            sendPass: n
        },
        success: function (data) {
                updateTable1();

        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        } 

    });
});

    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 

  $("#scaleCircId").click(function(){

        $("#attListDrop").empty();
        let element = document.getElementById('dropdownId');
        let fileSelected = element.options[element.selectedIndex].text;

        // Title and description ajax
        $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/scaleImageCirc',   //The server endpoint we are connecting to
        data: {
            sendFile: fileSelected,
            circ: circScale,
            sendData: o,
            sendUser: m,
            sendPass: n
        },
            success: function (data) {
                
                updateTable1();

            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log("e:"+error); 
            } 
        });

});


    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 

   $("#createSVGId").click(function(){
    $.ajax({

      type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/createFile',   //The server endpoint we are connecting to
        data: {
            sendFile: fileName,//name of file
            image: createSVG,
            sendData: o,
            sendUser: m,
            sendPass: n
        },
        success: function (data) {


            dropdown = document.getElementById('dropdownId');

                //fix filesize

            let newFileTable = "<tbody align = \"center\"><tr>"

                + "<td><center> <img src=\"" + fileName + "\"width=\"110\" height=\"135\"></center></td>"
                + "<td><center><a href=\"./uploads/" + fileName + "\"download>" + fileName + "</a></center></td>"
                + "<td><center>0.11KB</center></td>"
                + "<td><center>0</center></td>"
                + "<td><center>0</center></td>"
                + "<td><center>0</center></td>"
                + "<td><center>0<//center></td>"
                + "</tr> </tbody>"


            $(".fileTable").append(newFileTable);
            let choice = document.createElement('option');
            choice.text = choice.value = fileName;            
            dropdown.add(choice, 0);


            if (fileName == 0) 
            {
                let temp = "<tbody><th>NA</th></tr></tbody>"
            }
            let temp = "";
            updateFileTableData(temp, 3);
            updateChangeTableData(temp);

        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        } 

    });
    });


    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 

   $("#createRectId").click(function(){
        let element = document.getElementById('dropdownId');
        let fileSelected = element.options[element.selectedIndex].text;
    $.ajax({


      type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/createRectFile',   //The server endpoint we are connecting to
        data: {
            sendFile: fileSelected,
            rect: createRectObj,
            sendData: o,
            sendUser: m,
            sendPass: n

        },
        success: function (data) {

            let newFileTable;
            let count = 0;

            counterRect = counterRect + 1;
                     newFileTable = "<tbody align = \"center\"><tr>"
                        + "<td><center>Rectangle " + counterRect + "</center></td>"
                        + "<td><center>Upper Left Corner x=" + xVal + units + ", y=" + yVal + units + ",  width=" + width + units + ", height=" + height + units + "</center></td>"
                            + "<td><center>" + 0 + "</center></td> </tr> </tbody>"

                updateTable1();

                $(".titleDesc").append(newFileTable);

        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        } 

    });
    });


    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 


   $("#createCircId").click(function(){
        let element = document.getElementById('dropdownId');
        let fileSelected = element.options[element.selectedIndex].text;
    $.ajax({


      type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/createCircFile',   //The server endpoint we are connecting to
        data: {
            sendFile: fileSelected,
            circ: createCircObj,
            sendData: o,
            sendUser: m,
            sendPass: n
        },
        success: function (data) {

            let newFileTable;
            let count = 0;

            counterCirc = counterCirc + 1;
                     newFileTable = "<tbody align = \"center\"><tr>"
                        + "<td><center>Circle " + counterCirc + "</center></td>"
                            + "<td><center> Center x=" +xVal+ ",y=" + yVal+ ",r=" + width +"</center></td>"
                            + "<td><center>" + 0 + "</center></td> </tr> </tbody>"


                $(".titleDesc").append(newFileTable);

                updateTable1();

        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        } 

    });
    });


    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 


  $("#createAttId").click(function(){
   // var total = temp.length;
        let element = document.getElementById('dropdownId');
        let attDropDown = document.getElementById('attListDrop');

        let fileSelected = element.options[element.selectedIndex].text;
    $.ajax({


      type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/createAttFile',   //The server endpoint we are connecting to
        data: {
            sendFile: fileSelected,
            sendAttName: name,
            sendAttNewName: attName,
            sendAttNewVal: attVal,
            sendData: o,
            sendUser: m,
            sendPass: n
        },
        success: function (data) {

            let newFileTable;
            let count = 0;

            total = total + 1;

                     newFileTable = "<tbody align = \"center\"><tr>"
                        + "<td><center>" + total + "</center></td>"
                            + "<td><center>" +attName+ "</center></td>"
                            + "<td><center>" + attVal + "</center></td> </tr> </tbody>"


                $(".attTable").append(newFileTable);

                updateTable1();


                let choice = document.createElement('option');
                choice.text = choice.value = attName;
            
                attDropDown.add(choice, 0);

        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        } 

    });
    });

    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 


    $("#editTitleVal").click(function(){

        let element = document.getElementById('dropdownId');
        let fileSelected = element.options[element.selectedIndex].text;


      $.ajax({
        type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/editTitle',   //The server endpoint we are connecting to

        data: {
            sendTitle: title,
            sendFile: fileSelected,
            sendData: o,
            sendUser: m,
            sendPass: n
        },
            success: function (data) {

                    if(description == null)
                    {
                        description = data.desc;
                    }

                    $(".row2 tbody").remove();

                    newFileTable = "<tbody align = \"center\"><tr>"
                            + "<td><center>" + title + "</center></td>"
                            + "<td><center>" + description + "</center></td> </tr> </tbody>"

                    $(".row2").append(newFileTable);

            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            } 

        });
    });


    var m = readCookie("username", username); 
    var n = readCookie("password", password); 
    var o = readCookie("databaseName", databaseName); 


    $("#editDescVal").click(function(){
            let element = document.getElementById('dropdownId');
        let fileSelected = element.options[element.selectedIndex].text;
    $.ajax({

      type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 

        url: '/editDesc',   //The server endpoint we are connecting to
        data: {
            sendDesc: description,
            sendFile: fileSelected,
            sendData: o,
            sendUser: m,
            sendPass: n
        },
        success: function (data) {

            let count = 0;
            if (data.length != 0)
            {

                if(title == null)
                {
                    title = data.title;
                }

                $(".row2 tbody").remove();

                newFileTable = "<tbody align = \"center\"><tr>"
                        + "<td><center>" + title + "</center></td>"
                        + "<td><center>" + description + "</center></td> </tr> </tbody>"

                $(".row2").append(newFileTable);


            }


        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        } 

    });

    });  


    $.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/files',   //The server endpoint we are connecting to

        success: function (data) {

        	$(".fileTable tbody").remove();

            dropdown = document.getElementById('dropdownId');

            for(let x = 0; x < data.length; x++)
        	{

            if(data[x].file != null) 
            {
                $("#orderFile").prop("disabled", false);
                $("#orderQuery2").prop("disabled", false); 
                $("#orderQuery3").prop("disabled", false); 
                $("#orderQuery4").prop("disabled", false); 
                $("#orderQuery5").prop("disabled", false); 
                $("#orderQuery6").prop("disabled", false); 

                bt = document.getElementById('query4Button');
                bt.disabled = false;

                bt = document.getElementById('submitFile');
                bt.disabled = false;

                var bt = document.getElementById('myFile');
                bt.disabled = false;

                bt = document.getElementById('editTitleVal');
                bt.disabled = false;
                
                bt = document.getElementById('editDescVal');
                bt.disabled = false;
                
                bt = document.getElementById('createAttId');
                bt.disabled = false;
                
                var bt = document.getElementById('createSVGId');
                bt.disabled = false;


                bt = document.getElementById('createRectId');
                bt.disabled = false;

                bt = document.getElementById('createCircId');
                bt.disabled = false;

                bt = document.getElementById('scaleCircId');
                bt.disabled = false;

                bt = document.getElementById('scaleRectId');
                bt.disabled = false;

                bt = document.getElementById('clearData');
                bt.disabled = false;

                bt = document.getElementById('displayDB');
                bt.disabled = false;

        		// let name = "./uploads/" + data[x].file;

                let fileName = data[x].file.substring(10, data[x].file.length);

                downloadFile = fileName;


        		let newFileTable = "<tbody align = \"center\"><tr>"
              
                    + "<td><center> <img src=\"" + data[x].file + "\"width=\"110\" height=\"135\"></center></td>"
                    + "<td><center><a href=\"" + data[x].file + "\"download onclick='downloadClick(this)'>" + fileName + "</a></center></td>"           
                    + "<td><center>" + data[x].fileSize + "KB</center></td>"
        			+ "<td><center>" + data[x].numRect + "</center></td>"
        			+ "<td><center>" + data[x].numCirc + "</center></td>"
        			+ "<td><center>" + data[x].numPaths + "</center></td>"
        			+ "<td><center>" + data[x].numGroups + "</center></td>"
        			+ "</tr> </tbody>"


        		$(".fileTable").append(newFileTable);

                listArray[x] = data[x].file;
                let choice = document.createElement('option');
                choice.text = choice.value = data[x].file.substring(10, data[x].file.length);
            
                dropdown.add(choice, 0);
        	}

            }
        	if (data.length == 0) 
        	{
        		let temp = "<tbody><th>NA</th></tr></tbody>"
        	}


        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        } 
    });


    $('#dropdownId').change('click', function(event)
    {
        $("#attListDrop").empty();
        let element = document.getElementById('dropdownId');
        let fileSelected = element.options[element.selectedIndex].text;

        // Title and description ajax
        $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/viewFile',   //The server endpoint we are connecting to
            data: {
                sendFile: fileSelected //change this
            },
            success: function (data) {
                
                let newFileTable;
                let titleDescTable;

                if (data.length != 0)
                {
                    $(".row2 tbody").remove();
                    $(".viewPanel tbody").remove();

                    newFileTable = "<tbody align = \"center\"><tr>"
                            + "<td><center> <img src=\"" + data.file + "\"\"width=\"110\" height=\"135\"></center></td> </tr> </tbody>"

                    $(".viewPanel").append(newFileTable);
                    
                    titleDescTable = "<tbody align = \"center\"><tr>"
                                + "<td><center> No title </center></td>"
                                + "<td><center> No description </center></td> </tr> </tbody>"

                    if (data.title.length != 0 && data.desc.length != 0)
                    {
                        titleDescTable = "<tbody align = \"center\"><tr>"
                                + "<td><center>" + data.title + "</center></td>"
                                + "<td><center>" + data.desc + "</center></td> </tr> </tbody>"
                    }
                    else if (data.title.length == 0 && data.desc.length != 0) 
                    {
                        titleDescTable = "<tbody align = \"center\"><tr>"
                                + "<td><center> No title </center></td>"
                                + "<td><center>" + data.desc + "</center></td> </tr> </tbody>"
                    }
                    else if (data.title.length != 0 && data.desc.length == 0) 
                    {
                        titleDescTable = "<tbody align = \"center\"><tr>"
                                + "<td><center>" + data.title + " </center></td>"
                                + "<td><center> No description </center></td> </tr> </tbody>"
                    }

                    $(".row2").append(titleDescTable);
                    
                    title = data.title;
                    desc = data.desc;
                }
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log("e:"+error); 
            } 
        });

        // Rect ajax
        $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/fileRect',   //The server endpoint we are connecting to
            data: {
                sendFile: fileSelected
            },
            success: function (data) {

                if (data.length != 0) 
                {
                    $(".titleDesc tbody").remove();
                    let count = 0;
                    counterRect = data.length;
                    for(let i = 0; i < data.length; i++)
                    {

                        count++;

                        let newFileTable = "<tbody align = \"center\"><tr>"
                                + "<td><center>Rectangle " + count + "</center></td>"

                                + "<td><center>Upper Left Corner x=" + data[i].x + data[i].units + ", y=" + data[i].y + data[i].units + ",  width=" + data[i].w + data[i].units + ", height=" + data[i].h + data[i].units + "</center></td>"
                                + "<td><center>" + data[i].numAttr + "</center></td> </tr> </tbody>"

                        $(".titleDesc").append(newFileTable);
                    }
                }
                else
                {
                    $(".titleDesc tbody").remove();
                }
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log("er:"+error); 
            } 
        });

        // Circle ajax
        $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/fileCirc',   //The server endpoint we are connecting to
            data: {
                sendFile: fileSelected
            },
            success: function (data) {
                if (data.length != 0) 
                {

                    counterCirc = data.length;

                    let count = 0;
                    for(let i = 0; i < data.length; i++)
                    {

                        count++;

                        newFileTable = "<tbody align = \"center\"><tr>"
                                + "<td><center>Circle " + count + "</center></td>"

                                + "<td><center>Center x=" + data[i].cx + data[i].units + ", y=" + data[i].cy + data[i].units + ",  radius=" + data[i].r + data[i].units + "</center></td>"
                                + "<td><center>" + data[i].numAttr + "</center></td> </tr> </tbody>"

                        $(".titleDesc").append(newFileTable);
                    }
                }
                else
                {
                }

            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            } 
        });

        // Path ajax
        $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/filePath',   //The server endpoint we are connecting to
            data: {
                sendFile: fileSelected
            },
            success: function (data) {

                if (data.length != 0) 
                {
                    let count = 0;

                    for(let i = 0; i < data.length; i++)
                    {

                        count++;

                        let newFileTable = "<tbody align = \"center\"><tr>"
                                + "<td><center>Path " + count + "</center></td>"

                                + "<td><center>Path data =" + data[i].d + "</center></td>"
                                + "<td><center>" + data[i].numAttr + "</center></td> </tr> </tbody>"

                        $(".titleDesc").append(newFileTable);
                    }
                }                

            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            } 
        });

        // Group ajax
        $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/fileGroup',   //The server endpoint we are connecting to
            data: {
                sendFile: fileSelected
            },
            success: function (data) {

                if (data.length != 0) 
                {
                    let count = 0;
                    let newFileTable;

                    for(let i = 0; i < data.length; i++)
                    {

                        count++;
                        
                        if(data[i].children == 1)
                        {
                            newFileTable = "<tbody align = \"center\"><tr>"
                                + "<td><center>Group " + count + "</center></td>"

                                + "<td><center>" + data[i].children + " child element</center></td>"
                                + "<td><center>" + data[i].numAttr + "</center></td> </tr> </tbody>"

                        $(".titleDesc").append(newFileTable);
                        }
                        else
                        {


                        newFileTable = "<tbody align = \"center\"><tr>"
                                + "<td><center>Group " + count + "</center></td>"

                                + "<td><center>" + data[i].children + " child elements</center></td>"
                                + "<td><center>" + data[i].numAttr + "</center></td> </tr> </tbody>"

                        $(".titleDesc").append(newFileTable);
                        }
                    }
                }

            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            } 
        });



       $.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/fileAtt',   //The server endpoint we are connecting to
            data: {
                sendFile: fileSelected //change this
            },
            success: function (data) {

            var attDropDown = document.getElementById('attListDrop');


                if (data.length != 0) 
                {
                    $(".attTable tbody").remove();

                    let count = 0;

                    for(let i = 0; i < data.length; i++)
                    {
                        total++;
                        count++;

                        let newFileTable = "<tbody align = \"center\"><tr>"
                                + "<td><center>" + count + "</center></td>"

                                + "<td><center>" + data[i].name + "</center></td>"
                                + "<td><center>" + data[i].value + "</center></td> </tr> </tbody>"

                        $(".attTable").append(newFileTable);
                        temp[i] = data[i].name;
                        tempVal[i] = data[i].value;

                        let choice = document.createElement('option');
                        choice.text = choice.value = temp[i];
                
                        attDropDown.add(choice, 0);
                    }


                }

            $('#attListDrop').change('click', function(event)
                {

                    let element = document.getElementById('attListDrop');
                    let name = element.options[element.selectedIndex].text;


                    let element1 = document.getElementById('dropdownId');
                    let fileSelected = element1.options[element1.selectedIndex].text;
                    editAtt();

                    $.ajax({
                        type: 'get',            //Request type
                        dataType: 'json',       //Data type - we will use JSON for almost everything 
                        url: '/editAttVal',   //The server endpoint we are connecting to
                        data: {
                            sendFile: fileSelected,
                            sendAttName: name,
                            sendAttNewName: attName,
                            sendAttNewVal: attVal
                        },
                        success: function (data) {
 
                        let newFileTable;
                        let count = 0;
                        $(".attTable tbody").remove();

                        for(let i = 0; i < temp.length; i++)
                        {

                                if(temp[i] === name) 
                                {
                                    total = i + 1;

                                 newFileTable = "<tbody align = \"center\"><tr>"
                                    + "<td><center>" + total + "</center></td>"
                                        + "<td><center>" +attName+ "</center></td>"
                                        + "<td><center>" + attVal + "</center></td> </tr> </tbody>"
                                }
                                else
                                {
                                    total = i + 1;

                                    newFileTable = "<tbody align = \"center\"><tr>"
                                            + "<td><center>" + total+ "</center></td>"

                                            + "<td><center>" + temp[i] + "</center></td>"
                                            + "<td><center>" + tempVal[i] + "</center></td> </tr> </tbody>"

                                }

                            $(".attTable").append(newFileTable);
                            updateTable1();

                            let choice = document.createElement('option');
                            choice.text = choice.value = attName;
                        
                            element.add(choice, 0);

                        }

                        },
                        fail: function(error) {
                            // Non-200 return, do something with error
                            $('#blah').html("On page load, received error from server");
                            console.log(error); 
                        } 
                    });

                    $('#someform').submit(function(e){
                        $('#blah').html("Form has data: "+$('#entryBox').val());
                        e.preventDefault();
                        //Pass data to the Ajax call, so it gets passed to the server
                        $.ajax({
                            //Create an object for connecting to another waypoint
                        });
                    });


                });

            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log("e:"+error); 
            } 
        });

    });
     


});




