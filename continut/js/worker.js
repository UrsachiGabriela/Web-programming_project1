
self.onmessage=function(event){
    console.log("I am the worker and I received "+event.data)

    //event.data is instanceOf Produs
    insertProduct(event.data);

}


function insertProduct(product){
    let json=JSON.parse(product);
    table_row="<tr><td>" + json['id'] +"</td><td>" + json['nume'] + "</td><td>" + json['cantitate'] + "</td></tr>";
    self.postMessage(table_row);
}