$(document).ready(function()
{
	var theform = document.getElementById('mainform');
	var fileSelect = document.getElementById('files');
	var uploadButton = document.getElementById('sub');

	theform.onsubmit = function(event) {
		event.preventDefault();
		var files = fileSelect.files;
		if(files.length === 0) {
			alertCard('No files');
		} else {
			var ltotal = total;
			for (i = 0; i < files.length; i++) {
				var _id = i + ltotal;
				var file = files[i];
				if(file.size > 10 * 1024 * 1024) {
					fileAlertCard(file.name, 'File too large!');
					ltotal += 1;
				} else {
					fileCard(file.name, _id);
					ltotal += 1;
				}
			}
			processFilesRecursively(files)
		}
	}
});

var gCounter = 0;
var total = 0;
function processFilesRecursively(fileArray)
{
	if(gCounter >= fileArray.length) {
		gCounter = 0;
		total += 1
		return 0;
	} else {
	var id = gCounter + total;
	var file = fileArray[gCounter];
	if(file.size > 10 * 1024 * 1024)
	{
		//alertCard('File too large!');
		//fileAlertCard(file.name, 'File too large!');
		gCounter += 1;
		total += 1;
		processFilesRecursively(fileArray);
		return 0;
	}

	var formData = new FormData();

	formData.append('file[]', file, file.name);
	//fileCard(file.name, id);

	var request = $.ajax({
		url: '/js',
		type: 'POST',
		async: true,
		data: formData,
		processData: false,
		contentType: false,
		xhr: function() {
			var myXhr = $.ajaxSettings.xhr();
        	if(myXhr.upload){
            	myXhr.upload.addEventListener('progress',function(e){
            		if(e.lengthComputable){
				        var max = e.total;
				        var current = e.loaded;
				        var Percentage = (current * 100)/max;
				        var divid = '#file' + id + ' > div';
				        $(divid).width(Percentage + '%');
				        //console.log(divid);
				        //console.log(Percentage + '%');
					}  
            	}, false);
            }
        	return myXhr;
		},
		success: function () {
			$('#file' + id + ' > div').removeClass('indeterminate');
			$('#file' + id + ' > div').addClass('determinate');
		},
		complete: function( jqXHR, textStatus) {
			//alert(textStatus);
			//console.log(jqXHR);
			var resp = jqXHR.responseText;
			var code = resp.split(":");
			
			if(code[0] === 'success') {
				$('<a target="_blank" href="' + code[1] +'">uploaded to "' + code[2] + '"</a>').insertAfter('#file' + id);
			}
			else if(code[0] === 'exists') {
				$('<a target="_blank" href="' + code[1] + '">The file already exists.</a>').insertAfter('#file' + id);
			}
			else if(code[0] === 'error') {
				$('<p>Invalid filename.</p>').insertAfter('#file' + id);
			}						
			$('#file' + id).fadeOut(1000);
			gCounter += 1;
			total += 1;
			processFilesRecursively(fileArray);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			//alert(errorThrown);
			console.log(errorThrown);
			//console.log(textStatus);
			gCounter += 1;
			total += 1;
			processFilesRecursively(fileArray);
		}
	});
	}
}

function fileCard(filename, id) {
	var start = '<div class="row card-out"><div class="col s12 l6 offset-l3 m8 offset-m2"><div class="card ';
	var color = 'blue-grey ';
	var inter = 'darken-1 z-depth-2"><div class="card-content white-text">'
	var head = '<h5 class="truncate">';
	var name =  filename;
	var action = '</h5></div><div class="card-action">';
	var progress = '<div class="progress" id="file' + id + '"><div class="indeterminate"';
	//var percentage = '20';
	var progress2 = '></div></div>';
	var actionend = '</div>';
	var inter2 = '';
	var end = '</div></div></div>';

	var div = $(start +
				color +
				inter +
				head +
				name +
				action +
				progress +
				progress2 +
				actionend +
				inter2 +
				end
				);
	
	div.hide();
	div.insertAfter('#afterthis');
	div.fadeIn(1000);
}

function fileAlertCard(filename, text) {
	var start = '<div class="row card-out"><div class="col s12 l6 offset-l3 m8 offset-m2"><div class="card ';
	var color = 'blue-grey ';
	var inter = 'darken-1 z-depth-2"><div class="card-content white-text">'
	var head = '<h5 class="truncate">';
	var name =  filename;
	var action = '</h5></div><div class="card-action">';
	var progress2 = '<a>' + text + '</a></div>';
	var actionend = '</div>';
	var inter2 = '';
	var end = '</div></div></div>';

	var div = $(start +
				color +
				inter +
				head +
				name +
				action +
				progress2 +
				actionend +
				inter2 +
				end
				);
	
	div.hide();
	div.insertAfter('#afterthis');
	div.fadeIn(1000);
}

function alertCard(text) {
	var start = '<div class="row card-out"><div class="col s12 l6 offset-l3 m8 offset-m2"><div class="card ';
	var color = 'orange ';
	var inter = 'darken-1 z-depth-2 alert"><div class="card-content white-text">'
	var head = '<h5 class="truncate">';
	var icon = '<i class="small mdi-alert-warning" style="margin-right: 2%;"></i>';
	var name =  text;
	var inter2 = '</h5></div>';
	var end = '</div></div></div>';

	var div = $(start +
				color +
				inter +
				head +
				icon +
				name +
				inter2 +
				end
				);
	
	div.hide();
	div.insertAfter('#afterthis');
	div.fadeIn(1000);
	div.delay(4000).fadeOut(1000);
}