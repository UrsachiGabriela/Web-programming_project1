
function updateInfo()
{
    setInterval(updateTime,1000);
    document.getElementById("url").innerHTML=window.location;

    window.navigator.geolocation.getCurrentPosition(showPosition);

    document.getElementById("browser").innerHTML=navigator.appName;

    document.getElementById("os").innerHTML=navigator.platform;


    //stabilirea fundalului canvasului la incarcarea paginii
    var canvas = document.getElementById("myCanvas");
    canvas.style.background = "url('../Imagini/tennis-court.jpg')";

}

function updateTime()
{
    let e=document.getElementById("timp");
    e.innerHTML=new Date();
}

function showPosition(position) 
{
    document.getElementById("locatie").innerHTML =
    "Latitudine: " + position.coords.latitude + "&ensp;" +
    "Longitudine: " + position.coords.longitude;
}


var x=null;
var y=null;

function drawSection2(event){


    if(x==null){
        x = event.offsetX;
        y = event.offsetY;
    }
    else{

        var canvas = document.getElementById("myCanvas");
        
        
        var ctx = canvas.getContext("2d");

        var x2=event.offsetX;
        var y2=event.offsetY;

        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x2,y);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x,y2);
        ctx.fillStyle =  document.getElementById("fillColor").value;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x2,y);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x,y2);
        ctx.lineTo(x,y);
        ctx.strokeStyle =  document.getElementById("borderColor").value;
        ctx.stroke();
    

        x=null;
        y=null;

    }
}


function row_insert(){
    var table=document.getElementById("js_table");

    //nr de coloane de pe prima linie (considerand ca toate liniile au acelasi nr de coloane)
    var colCount = table.rows[0].cells.length;
    var rowCount=table.rows.length;

    
    var insertPos=document.getElementById("insert_position").value;



    var color=document.getElementById("table_bg").value;

    var newRow=document.createElement("tr"); 
    


    let i=0;
    for(i=0;i<colCount;i++){
        var newCell=document.createElement("td");
        newCell.style.backgroundColor=color;
        newCell.style.height="10px";
        newRow.appendChild(newCell);
    }

    var node=table.tBodies[0];
    console.log("node" + node)
    console.log("rowCount: " +rowCount)
    console.log("node.childNodes.length : "+node.childNodes.length)


    if (insertPos==null || insertPos>rowCount){
        node.appendChild(newRow)
    }
    else{
        
        node.insertBefore(newRow,node.childNodes[insertPos]);
    }



       
}



function column_insert(){
    var table=document.getElementById("js_table");

    
    var colCount = table.rows[0].cells.length;
    var rowCount=table.rows.length;

    
    var insertPos=document.getElementById("insert_position").value;
    if (insertPos==null || insertPos>colCount){
        insertPos=colCount;
    }
    console.log("columns: "+colCount);
    console.log(insertPos);

    var color=document.getElementById("table_bg").value;

    
    let i=0;
    let rows=table.rows;
    for(i=0;i<rowCount;i++){
        var newCell=rows[i].insertCell(insertPos);
        newCell.style.backgroundColor=color;
        newCell.style.width="10px";
    }

 
       
}





function changeContent(resursa,jsFisier,jsFunctie){
    var xhttp  = new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            document.getElementById('continut').innerHTML=this.responseText;

            if (jsFisier) {
                var elementScript = document.createElement('script');
                elementScript.onload = function () {
                    console.log("hello");
                    if (jsFunctie) {
                        window[jsFunctie]();
                    }
                };
                elementScript.src = jsFisier;
                document.head.appendChild(elementScript);
            } else {
                if (jsFunctie) {
                    window[jsFunctie]();
                }
            }
        }
    }
    xhttp.open("GET",resursa,true);
    xhttp.send();

    
}



function verifica_utilizator(){
    var xhttp  = new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            verifica(this.responseText);
        }
    }
    xhttp.open("GET","resurse/utilizatori.json",true);
    xhttp.send();
}


function verifica(textJSON){
    var i;
    let user = document.getElementById("username_verify").value;
    let password = document.getElementById("password_verify").value;

    let obJSON=JSON.parse(textJSON);
    console.log(obJSON);

    for(i=0;i<obJSON.length;i++){
        if(user==obJSON[i].utilizator){
            if(password==obJSON[i].parola){
                document.getElementById("verifica_account").innerHTML = "Username-ul și parola sunt corecte"
                document.getElementById("verifica_account").style="font-wight:bold; color: green";
                return;
            }

            break; 
        }
    
    }

    document.getElementById("verifica_account").innerHTML = "Username-ul și parola sunt incorecte"
    document.getElementById("verifica_account").style="font-wight:bold; color: red";
}


function acceptTerms(){
    document.getElementById("submit_btn").disabled=false;
}