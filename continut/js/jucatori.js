function incarcaJucatori()
{
    var xhttp  = new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            creeazaTabel(this);
        }
    }
    xhttp.open("GET","resurse/jucatori.xml",true);
    xhttp.send();
}


function creeazaTabel(xml)
{
    var i,j;
    xmlDoc=xml.responseXML;
    //console.log(xmlDoc);

    var tabel="<table class=\"tabel_jucatori\"><tr><th>Nume</th><th>Vârstă</th><th>Țara</th><th>Clasament</th><th>Titluri</th><th>Victorii</th><th>Înfrângeri</th></tr>";


    let jucatori=xmlDoc.getElementsByTagName("jucator")

    let lenJ=jucatori.length;

    
    for(i=0;i<lenJ;i++){
        let nume=jucatori[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue;
        let prenume=jucatori[i].getElementsByTagName("prenume")[0].childNodes[0].nodeValue;

        nume=prenume+" "+nume;

        let varsta=jucatori[i].getElementsByTagName("varsta")[0].childNodes[0].nodeValue;
        let tara=jucatori[i].getElementsByTagName("tara")[0].childNodes[0].nodeValue;

        tabel+= "<tr><td>" + nume + "</td><td>" + varsta + "</td><td>" + tara + "</td>";
        
        let simplu=jucatori[i].getElementsByTagName("simplu")[0];
        let clasament=simplu.getElementsByTagName("pozitie_clasament")[0].childNodes[0].nodeValue;
        let titluri=simplu.getElementsByTagName("numar_titluri")[0].childNodes[0].nodeValue;
        let victorii=simplu.getElementsByTagName("victorii")[0].childNodes[0].nodeValue;
        let infrangeri=simplu.getElementsByTagName("infrangeri")[0].childNodes[0].nodeValue;

        tabel+= "<td>" + clasament + "</td><td>" + titluri + "</td><td>" + victorii + "</td><td>" + infrangeri + "</td></tr>";
    }




    tabel+="</table>";
    text="<p><b> JUCĂTORI DE TENIS </b></p>";
    document.getElementById("persoane_xml").innerHTML = text+tabel;


    console.log(xmlDoc.getElementsByTagName("masculin").length)
}