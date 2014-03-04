	var bdd = {};
    bdd.indexedDB = {};
    bdd.indexedDB.db = null;

    bdd.indexedDB.onerror = function(e) {
      console.log(e);
    };

    bdd.indexedDB.open = function() {
      var request = indexedDB.open("datas", 1);

      request.onupgradeneeded = function(e) {
        var db = e.target.result;

        e.target.transaction.onerror = bdd.indexedDB.onerror;

        if(db.objectStoreNames.contains("data")) {
          db.deleteObjectStore("data");
        }
		
        var store = db.createObjectStore("data",{keyPath: "timeStamp"});
      };

      request.onsuccess = function(e) {
        bdd.indexedDB.db = e.target.result;
        bdd.indexedDB.getAllData();
      };

      request.onerror = bdd.indexedDB.onerror;
    };

    bdd.indexedDB.add_bdd = function(dataURI, name) {
      var db = bdd.indexedDB.db;
      var trans = db.transaction(["data"], "readwrite");
      var store = trans.objectStore("data");

      var data = {
        "dataURI": dataURI,
		"name":name,
        "timeStamp": new Date().getTime(),
      };

      var request = store.put(data);

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

        afficher(result.value);
        result.continue();
      };

      cursorRequest.onerror = bdd.indexedDB.onerror;
    };

    function afficher(row) {
      var test_affichage = document.getElementById("test_affichage");
      var li = document.createElement("li");
      var a = document.createElement("a");
      var t = document.createTextNode(row.dataURI);

      a.addEventListener("click", function() {
        bdd.indexedDB.delete_Data(row.timeStamp);
      }, false);

      a.href = "#";
      a.textContent = " [Delete]";
      li.appendChild(t);
      li.appendChild(a);
      test_affichage.appendChild(li);
    }

    function add_bdd(data, name) {
      bdd.indexedDB.add_bdd(data, name);
    }

    function init() {
      bdd.indexedDB.open();
    }

    window.addEventListener("DOMContentLoaded", init, false);
	