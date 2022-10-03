
class AbstractStorage{
    getItem(id,resolve){
        throw new Error("Abstract addItem method");
    }

    setItem(produs){
        throw new Error("Abstract setItem method");
    }



    length(resolve){
        throw new Error("Abstract length method");
    }
}

class ProductLocalStorage extends AbstractStorage{
    getItem(id,resolve){
        let temp = localStorage.getItem(id);
        return resolve(temp);
    }

    setItem(produs){
        let i=localStorage.length
        console.log("Dimensiune : "+i)
        localStorage.setItem(i,produs);
    }




    length(resolve){
        return resolve(localStorage.length);
    }
}

var db;

class ProductIndexedDB extends AbstractStorage{

    constructor(){
        super();
        var request=indexedDB.open('cumparaturi',3);
        request.onupgradeneeded=function(event){
            // Save the IDBDatabase interface
            var db = event.target.result;

            // Create an objectStore for this database
            if (!db.objectStoreNames.contains('produse')) {
                var objectStore = db.createObjectStore('produse', {keyPath: 'id'});
            }
        }
    }


    getItem(id,resolve){
        var openRequest=indexedDB.open('cumparaturi',3);
        openRequest.onsuccess=function(){
            db=openRequest.result;

            var transaction=db.transaction('produse','readwrite');
            var store=transaction.objectStore('produse');
            

            var objectStoreRequest=store.get(id);

            objectStoreRequest.onsuccess = function(event) {
                resolve(JSON.stringify(objectStoreRequest.result.value));
              };
        }

        openRequest.onerror=function(e){
            console.log("Error opening the database for insertion");
        }
    }

    setItem(produs){
        var openRequest=indexedDB.open('cumparaturi',3);
        openRequest.onsuccess=function(){
            db=openRequest.result;

            var transaction=db.transaction('produse','readwrite');
            var store=transaction.objectStore('produse');
            
            let json=JSON.parse(produs);

            store.put({id:json['id'],value:{id:json['id'],nume:json['nume'],cantitate:json['cantitate']}});

 
            transaction.oncomplete=function(){
                console.log('transaction has committed');
            }
        }

        openRequest.onerror=function(e){
            console.log("Error opening the database for insertion");
        }
    }




    length(resolve){
        var openRequest=indexedDB.open('cumparaturi',3);
        openRequest.onsuccess=function(){
            db=openRequest.result;

            var transaction=db.transaction('produse','readonly');
            var store=transaction.objectStore('produse');
            
            var countRequest=store.count();

            countRequest.onsuccess=function(){
                return resolve(countRequest.result);
            }

            countRequest.onerror=function(){
                console.log("EROAREEEE")
            }

            transaction.oncomplete=function(){
                console.log('transaction has committed');
            }
        }

        openRequest.onerror=function(e){
            console.log("Error opening the database for get length");
        }
    }

}


var id=0;
var storage_type = 0;
var storage;

class Produs{

    constructor(id, nume, cantitate){
        this.id = id;
        this.nume = nume;
        this.cantitate = cantitate;
    }

    toString(){
        return "<tr><td>" + this.id +"</td><td>" + this.nume + "</td><td>" + this.cantitate + "</td></tr>";
    }

    toJSON(){
        return{
           id: this.id,
           nume: this.nume,
           cantitate: this.cantitate 
           
        };
    }

}

function cumpara()
{
    
    var numeProdus=document.getElementById('nume').value;
    var cantitateProdus=document.getElementById('cantitate').value;
    
    if(cantitateProdus=="" || numeProdus==""){
        console.log("Camp vid");
        return;
    }

    //preiau dimensiunea storage-ului pentru a determina urmatorul index
    
    var promise=new Promise(function(resolve){
        storage.length(resolve);
    });

    promise.then(function(dim){
        let id=dim;
        console.log("THE NEXT INDEX IS: "+id);
    
        var produs=new Produs(id,numeProdus,cantitateProdus);

        
        storage.setItem(JSON.stringify(produs.toJSON()))


        myWorker.postMessage(JSON.stringify(produs.toJSON()));
    })




}

var myWorker;
function startWorker(){
    console.log('start worker');
    if (typeof(Worker) !== "undefined"){
        if (typeof(myWorker) == "undefined"){
            myWorker=new Worker("js/worker.js");
        }

        myWorker.onmessage=function(event){
            console.log("Message from worker");
            document.getElementById("lista_cumparaturi").innerHTML += event.data;
        }

    }
    else{
        console.log("Sorry! No Web Worker support..");
    }

}



function loadShoppingInfo(){

    //sterg inregistrarile afisate in tabel pentru a nu exista duplicate la fiecare refresh
    document.getElementById("lista_cumparaturi").innerHTML="<tr><th>Id</th><th>Produs</th><th>Cantitate</th></tr>";
    
    if(storage_type==0){
        storage = new ProductLocalStorage();
        console.log('local storage is used');
    }
    else if (storage_type==1){
        storage = new ProductIndexedDB();
        console.log('indexedDB is used');
    }

    startWorker();

    //initializare tabel cu datele existente in storage
    var promise=new Promise(function(resolve){
        storage.length(resolve);
    });

    promise.then(function(dim){
        let len=dim;
        console.log("DIMENSIUNE : "+len);
        for (var i = 0; i < len; i++){
            var promise2=new Promise(function(resolve2){
                storage.getItem(i,resolve2);
            });
        
            promise2.then(function(produs){
                myWorker.postMessage(produs);
            })
            
        }
    })
    

}

function changeStorage(){
    if(document.getElementById("localStorage").checked){
        storage_type=0;
        console.log("Change database to APIstorage");
    }
    else if(document.getElementById("indexedDB").checked){
        storage_type=1;
        console.log("Change database to indexedDB");
    }

    // de fiecare data cand se schimba tipul de storage, 
    // se va instantia un obiect de tipul indexedDB sau localStorage
    loadShoppingInfo();
}