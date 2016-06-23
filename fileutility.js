var url = 'file.php';
console.log("bean burrito");

$(document).ready(function() {
	$("#save").click(function() {
		console.log("save event");
		$.ajax({
			url : url,
			type: 'post',
			data : {
				filename : $("#filename").val(),
				action : 'save',
				content : encodeURIComponent($('#html_content').val())
			}
		});
	});

	$("#delete").click(function() {
		console.log("delte event");
		$.ajax({
			url : url,
			type: 'post',
			data : {
				filename : $("#filename").val(),
				action : 'delete'
			}
		});
	});

	$("#load").click( function() {
		//alert("loading file");
		console.log("load event");
		var file = $("#filename").val();
		console.log("file name = " + file + "\n");
		$.ajax({
			url : url,
			type: 'post',
			data : {
				filename : $("#filename").val(),
				action : 'load'
			},
			success : function(html) {
				$("#html_content").val(html);
			}
		});
	});
});