karlApp.factory('musicEntriesService', function($http, $log, $q) {
  return {
   getEntries: function(uname, pass) {
     var deferred = $q.defer();
	$http
		({
			method: 'GET',
			params:({ "username": uname ,"password": pass}),  // pass in data as strings
			url: 'music_gig_entries.php',                
			headers: { 'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form 
		})
       .success(function(data) 
	   { 
			console.log(data);
			console.log("we got data back in music_gig_entries", data.data);
			deferred.resolve
			({
				gig_entries: data.data
			});
       }).error(function(msg, code) 
	   {
		  console.log("we had an error in userEntriesService");
          deferred.reject(msg);
          $log.error(msg, code);
       });
     return deferred.promise;
   },
	insertUserEntry: function(uname, pass, payout, comments, venue, time, user_id, attachment, paid ) {		
	var deferred = $q.defer();
	Indata = { "username": uname ,"password": pass, "payout":payout, "comments":comments, "venue":venue, };
	$http
		({
			method: 'POST',
			data: $.param(Indata),
			url: 'music_gig_entries.php',                
			headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
		})
	   .success(function(data) 
	   { 
			console.log(data);
			console.log("Successfully inserted record", data);
			
			deferred.resolve
			({
				insertion: data
			});
	   }).error(function(data) 
	   {
		  console.log("we had an error in music_gig_entries", data);		  
			deferred.resolve
			({
				insertion: {"success":false}
			});
	   });
		return deferred.promise;
   } 
  }
 });