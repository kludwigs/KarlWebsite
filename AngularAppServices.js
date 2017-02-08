
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
   },
   	getUserStats: function(uname, pass) {	
	
	var deferred = $q.defer();
	$http
		({
			method: 'GET',
			params:({ "username": uname ,"password": pass}), 
			url: 'budget_get_user_stats.php',                
			headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
		})
	   .success(function(data) 
	   { 
			console.log(data);
			console.log("successfully got user stats", data);
			
			deferred.resolve
			({
				stats: data
			});
	   }).error(function(data) 
	   {
		  console.log("error in user stats request", data);		  
			deferred.resolve
			({
				stats: {"success":false}
			});
	   });
		return deferred.promise;	
	}  
  }
 });
 
 karlApp.factory('serviceMethodsFactory', function($http, $log, $q) {
	return {
		apiGet: function(url, args, error_method, success_method) {
			console.log(url,args);
			$http
			({
				url : url,
				method: 'GET',
				params: args,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded'},// set the headers so angular passing info as form data (not request payload)	
/*
			method: 'GET',
			params:({ "username": "kludwigs" ,"password": "kpl321"}),  // pass in data as strings
			url: 'music_gig_entries.php',                
			headers: { 'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)		
*/			
			})			
			.success(function(result) 
			{
				if(success_method)
				{
					success_method(result);
				}
			})	
			.error(function(result)
			{
				if(error_method)
				{
					error_method(result);
				}
			});	//semicolon wraps success and error	
		},
		apiPost: function(url, params, error_method, success_method) 	{
			$http
			({
				url : url,
				method: 'POST',
				data: $.param(params),
				headers: { 'Content-Type': 'application/x-www-form-urlencoded'},// set the headers so angular passing info as form data (not request payload)				
			})			
			.success(function(data) 
			{
				if(success_method)
				{
					success_method(data);
				}
			})	
			.error(function(data)
			{
				if(error_method)
				{
					error_method(data);
				}
			});	//semicolon wraps success and error	
		}		
	}
});