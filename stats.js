$(document).ready(function() {
		console.log("calling ready function in stats.js");
		console.log("setting up ajax command to pageloadactions.php");
		dataString = "mydatastring";
		
		$.ajax({
                type: "POST",
                url: "pageloadactions.php",
               // data: dataString,
               // dataType: "json",
               
                //if received a response from the server
                success: function( data, textStatus, jqXHR) {
                    //our country code was correct so we have some information to display
                    // if(data)
					{                
						console.log("successful call to pageloadactions!");
						console.log(data);
					} 
                    // else {
                    ////     $("#ajaxLibraryResponse").html("<b>Data Retrieve Failed!</b>");
                    //     console.log("ajax button fail!");
                    // }
                },              
                //If there was no resonse from the server
                error: function(jqXHR, textStatus, errorThrown){
                     console.log("Something really bad happened " + textStatus);
                   // $("#ajaxLibraryResponse").html(jqXHR.responseText);
                },
               
                //capture the request before it was sent to server
               // beforeSend: function(jqXHR, settings){
                    //adding some Dummy data to the request
               //     settings.data += "&dummyData=whatever";
                    //disable the button until we get the response
                //    $('#LibraryBookService').attr("disabled", true);
                //},
                //this is called after the response or error functions are finsihed
                //so that we can take some action
               // complete: function(jqXHR, textStatus){
               //     //enable the button 
               //     $('#LibraryBookService').attr("disabled", false);
               // }
            });
});