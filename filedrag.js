var donnee = new Array();
var i = 0;
(function() {

	function $id(id) {
		return document.getElementById(id);
	}


	function Output(msg) {
		var m = $id("messages");
		m.innerHTML += msg;
	}


	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}


	// file selection
	function FileSelectHandler(e) {

		// cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			getDATAURL(f);
		}

	}

	function getDATAURL(file)
	{
	var ext = file.name.split(".").pop().toLowerCase();
	var selectedFile = file;
	var reader = new FileReader();

	reader.onload = function() {
		if(ext!='smil')
			dataURL = reader.result;
		else
			dataURL = 'data:application/smil+xml;'+reader.result.split(";").pop();
		add(dataURL, file.name, ext);
		Output("<p><strong>" + file.name + "</strong>    <img src=\"./delete.gif\" width=\"10px\" onclick=\"delete_file("+(i-1)+", this);\"> </img></p>");
	};
	reader.readAsDataURL(selectedFile);
	//return false;
		
	}
	
	
	function add(dataURI, name, ext)
	{
		donnee[i] = new Array();
		donnee[i]['name'] = name;
		donnee[i]['dataURI'] = dataURI;
		donnee[i]['ext'] =ext;
		i++;
	}


	// initialize
	function Init() {

		var fileselect = $id("fileselect"),
			filedrag = $id("filedrag"),
			submitbutton = $id("submitbutton");

		// file select
		fileselect.addEventListener("change", FileSelectHandler, false);

		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";

			// remove submit button
			submitbutton.style.display = "none";
		}

	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}

})();