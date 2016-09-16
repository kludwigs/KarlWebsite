$( window ).load( loadsite_content );

function loadsite_content(  ) {
    // Code to run when the document is ready.
console.log("load index page contents");

$.ajax({
  type: 'GET',
  url: 'site_content.php',
  dataType: 'json',
  success: function (data) {
    //Do stuff with the JSON data
	console.log("we received the data!");
	console.log("data success", data);
	$("#greeting").html(data.data[0].greeting);
	$("#myfooter").html(data.data[0].footer);
  },
  error: function(data)
  {
	  console.log("data error", data);
  }
});
}

