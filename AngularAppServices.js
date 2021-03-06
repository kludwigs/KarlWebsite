 karlApp.factory('serviceMethodsFactory', function($http, $log, $q) {
	return {
		apiGet: function(url, args, error_method, success_method){
			console.log(url,args);
			$http
			({
				url : url,
				method: 'GET',
				params: args,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded'},// set the headers so angular passing info as form data (not request payload)				
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
		apiPost: function(url, params, error_method, success_method){
			console.log(url,params);
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
			});
		},	
		apiPut:function(url, params, error_method, success_method){
			$.ajax(
			{
				url : url,
				type: 'PUT',
				data:params,			
				success : function(data) 
				{
					if(success_method)
						success_method(data);
					
				},
				error : function(msg) 
				{
					if(error_method)
						error_method(data);
				}
			});
		},
		apiGetPromise: function(identifier, url, args) {		 	
			var deferred = $q.defer();
			$http
				({
					method: 'GET',
					params: args,
					url: url,                
					headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
				})
			   .success(function(data) 
			   { 						
					deferred.resolve
					({
						[identifier]: data
					});
			   }).error(function(data) 
			   {  
					deferred.resolve
					({
						[identifier]: {"success":false}
					});
			   });
			return deferred.promise;
		}
	}
});