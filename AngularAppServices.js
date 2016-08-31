
karlApp.factory('categoriesService', function($http, $log, $q) {
  return {
   getCategories: function(uname, pass) {
     var deferred = $q.defer();
	$http
		({
			method: 'GET',
			params:({ "username": uname ,"password": pass}),  // pass in data as strings
			url: 'budget_categories.php',                
			headers: { 'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
		})
       .success(function(data) 
	   { 
			console.log(data);
			console.log("we get data back in categoriesService", data.data);
			deferred.resolve
			({
				categories: data.data
			});
       }).error(function(msg, code) 
	   {
		  console.log("we had an error in categoriesService");
          deferred.reject(msg);
          $log.error(msg, code);
       });
     return deferred.promise;
   }
  }
 });
 
 karlApp.factory('userEntriesService', function($http, $log, $q) {
  return {
   getUserEntries: function(uname, pass) {
     var deferred = $q.defer();
	$http
		({
			method: 'GET',
			params:({ "username": uname ,"password": pass}),  // pass in data as strings
			url: 'budget_user_entries.php',                
			headers: { 'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
		})
       .success(function(data) 
	   { 
			console.log(data);
			console.log("we get data back in userEntriesService", data.data);
			deferred.resolve
			({
				entries: data.data
			});
       }).error(function(msg, code) 
	   {
		  console.log("we had an error in userEntriesService");
          deferred.reject(msg);
          $log.error(msg, code);
       });
     return deferred.promise;
   }
  }
 });