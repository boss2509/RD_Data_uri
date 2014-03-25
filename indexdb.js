	var bdd = {};
	var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
	var donnee=new Array();
    bdd.indexedDB = {};
    bdd.indexedDB.db = null;
    bdd.indexedDB.onerror = function(e) {
      console.log(e);
    };

    bdd.indexedDB.open = function() {
		indexedDB.deleteDatabase('datas')
      var request = indexedDB.open("datas", 1);

      request.onupgradeneeded = function(e) {
        var db = e.target.result;

        e.target.transaction.onerror = bdd.indexedDB.onerror;

       if(db.objectStoreNames.contains("data")) {
          db.deleteObjectStore("datas");
        }
		
        var store = db.createObjectStore("data",{keyPath: "name"});
      };

     request.onsuccess = function(e) {
       bdd.indexedDB.db = e.target.result;
       //bdd.indexedDB.getAllData();
     };

      request.onerror = bdd.indexedDB.onerror;
    };

    bdd.indexedDB.add_bdd = function(dataURI, name, ext) {
      var db = bdd.indexedDB.db;
      var trans = db.transaction(["data"], "readwrite");
      var store = trans.objectStore("data");
      var data = {
        "dataURI": dataURI,
		"name":name, 
		"ext":ext
		};
      var request = store.add(data);

      request.onsuccess = function(e) {
        bdd.indexedDB.getAllData();
      };

      request.onerror = function(e) {
        console.log("Error Adding: ", e);
      };
    };

    bdd.indexedDB.delete_Data = function(id) {
      var db = bdd.indexedDB.db;
      var trans = db.transaction(["data"], "readwrite");
      var store = trans.objectStore("data");

      var request = store.delete(id);

      request.onsuccess = function(e) {
        bdd.indexedDB.getAllData();
      };

      request.onerror = function(e) {
        console.log("Error Adding: ", e);
      };
    };

    bdd.indexedDB.getAllData = function() {
	   donnee=new Array();
	  var i=0;
      var test_affichage = document.getElementById("test_affichage");
      test_affichage.innerHTML = "";

      var db = bdd.indexedDB.db;
      var trans = db.transaction(["data"], "readwrite");
      var store = trans.objectStore("data");

      // Get everything in the store;
      var keyRange = IDBKeyRange.lowerBound(0);
      var cursorRequest = store.openCursor(keyRange);

      cursorRequest.onsuccess = function(e) {
        var result = e.target.result;
        if(!!result == false)
          return;
		donnee[i] = new Array();
		donnee[i]['name'] = result.value.name;
		donnee[i]['dataURI'] = result.value.dataURI;
		donnee[i]['ext'] = result.value.ext;
		i++;
        afficher(result.value);
        result.continue();
      };
	}

    function afficher(row) {
      var test_affichage = document.getElementById("test_affichage");
      var li = document.createElement("li");
      var a = document.createElement("a");
      var t = document.createTextNode(row.ext + '_______' + row.name + '______' + row.dataURI);

      a.addEventListener("click", function() {
        bdd.indexedDB.delete_Data(row.name);
      }, false);

      a.href = "#";
      a.textContent = " [Delete]";
      li.appendChild(t);
      li.appendChild(a);
      test_affichage.appendChild(li);
    }

    function add_bdd(data, name, ext) {
      bdd.indexedDB.add_bdd(data, name, ext);
    }
	
	function replace_all_data()
	{
		bdd.indexedDB.getAllData();	
	}

    function init() {
      bdd.indexedDB.open();
    }

    window.addEventListener("DOMContentLoaded", init, false);
	