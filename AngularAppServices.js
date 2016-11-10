
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
   },
	insertUserEntry: function(uname, pass, category_id, price, comments) {		
	var deferred = $q.defer();
	Indata = { "username": uname ,"password": pass, "price":price, "comments":comments, "category_id":category_id};
	$http
		({
			method: 'POST',
			data: $.param(Indata),
			url: 'budget_user_entries.php',                
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
		  console.log("we had an error in insertUserEntry", data);		  
			deferred.resolve
			({
				insertion: {"success":false}
			});
	   });
 return deferred.promise;
   }
  }  
 });
 
 karlApp.factory('siteContentService', function($http, $log, $q) {
  return {
	getSiteContent: function(uname, pass) 
    {
		var deferred = $q.defer();
			$http
			({
				method: 'GET',
				url: 'site_content.php',                
			})
			.success(function(data) 
			{ 
				console.log(data);
				console.log("we get data back in site_content.php", data.data);
				deferred.resolve
			({
				site_content: data.data
			});
			}).error(function(msg, code) 
			{
				console.log("we had an error in siteContentService");
				deferred.reject(msg);
				$log.error(msg, code);
			});
		return deferred.promise;
    }
  }
 });