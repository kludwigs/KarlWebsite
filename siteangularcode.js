var karlApp = angular.module('karlApp', ['ngRoute', 'ngAnimate']);
      karlApp.config(function($routeProvider) {
        $routeProvider.
          when('/', 
		  {
            templateUrl: 'aboutme.html',
            controller: 'webpageCtrl'
          }).
          when('/aboutme', 
		  {
            templateUrl: 'aboutme.html',
            controller: 'webpageCtrl'

          }).	
          when('/resume', 
		  {
            templateUrl: 'resume.html',
            controller: 'webpageCtrl'
          }).		  
          when('/mediagallery', 
		  {
            templateUrl: 'mediagallery.html',
            controller: 'webpageCtrl'
          }).	
		   when('/contactme', 
		  {
            templateUrl: 'contactme.html',
            controller: 'webpageCtrl',
          }).
		   when('/adminlogin', 
		  {
            templateUrl: 'adminlogin.html',
            controller: 'webpageCtrl',
			resolve:{
				"check":function(accessFac,$location) {   
					if(accessFac.HasAccess())
					{    //check if the user has permission -- This happens before the page loads
						$location.path('/adminpage');
					}
					else
					{
						
					}
				}
			}	
          }).
		  when('/adminpage', 
		  {
            templateUrl: 'adminpage.html',
			controller: 'webpageCtrl',
			resolve:{
				"check":function(accessFac,$location) {   
					if(accessFac.HasAccess())
					{    //check if the user has permission -- This happens before the page loads

						
					}
					else
					{
						$location.path('/');                //redirect user to home if it does not have permission.
						alert("You don't have access here");
					}
				}
			}			
          }).		  
          otherwise({
            redirectTo: '/'
          });
      });
	  
	  
karlApp.factory('alertsManager', function() {
    return {
        alerts: {},
        addAlert: function(message, type) {
		
			console.log("add-alert :message", message);
			console.log("add-alert :type", type);
            this.alerts[type] = this.alerts[type] || [];
            this.alerts[type].push(message);
        },
        clearAlerts: function() 
		{
            for(var x in this.alerts) 
			{
			delete this.alerts[x];
			}
        }
    };
});	

karlApp.factory('accessFac',function($http, $location){
    var obj = {}
    this.access = false;
    obj.HasAccess = function()
	{    
		console.log("access = " + this.access + "\n");
		return this.access;
    }
    obj.checkPermission = function(uname, pass)
	{
        console.log("you called access factory function() checkPermission - " + uname + ", " + pass);	
			$http
			({
                method: 'POST',
                url: 'login.php',
                data: $.param({ "username": uname ,"password": pass}),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            })
												
			.success(function (data) 
			{

				console.log("data", data);				
				console.log("data.success", data.success);
				console.log("data.errors", data.errors);

				if (!data.success) 
				{
					// if not successful, bind errors to error variables
					console.log("you had a bad time!");	
					console.log(data.message);	
					obj.setPermission(false);
				} 
				else 
				{
					// if successful, bind success message to message and direct to admin page
					console.log("you win!");
					obj.setPermission(true);
					$location.path('/adminpage');
				}				
			});
    }
	obj.setPermission = function(perm)
	{
		console.log("setting permission to " + perm);
		this.access = perm;
	}
    return obj;
});
	  
karlApp.controller('webpageCtrl', function ($scope, $routeParams, $http, alertsManager, $timeout, $location, accessFac)
{			
		$scope.filenames = ["resume", "aboutme"];

		$scope.formData = {};				
		$scope.alerts = alertsManager.alerts;
						
		$scope.AlertMessage = {active: false};
			
		$scope.toggle = function(delay)
		{		
			console.log("toggling...");
			
			console.log($scope.AlertMessage);
			
			if(!delay)
			{
				$scope.AlertMessage.active = !$scope.AlertMessage.active;
			}
			else
			{
				$timeout(function()
				{
					$scope.AlertMessage.active = !$scope.AlertMessage.active;
				}, 3000);				
			}
			
			//console.log($scope.AlertMessage);
		}
		
		$scope.doGood = function(msg) 
		{
			console.log(msg);
			alertsManager.addAlert(msg, 'alert-success');
		};
		$scope.doEvil = function(msg) 
		{
			console.log(msg);
			alertsManager.addAlert(msg, 'alert-danger');
		};
		$scope.doInfo = function(msg)
		{
			alertsManager.addAlert(msg, 'alert-info');
		};
		
		$scope.reset = function(delay) 
		{
			if(!delay)
			{
				alertsManager.clearAlerts();
			}
			else
			{
				$timeout(function()
				{
					alertsManager.clearAlerts();
				}, 3000);				
			}
		};
								
        $scope.processForm = function () 
		{		
			$scope.reset();
			
			console.log($scope.formData.emailname);
			console.log($scope.formData.emailaddress);
			console.log($scope.formData.emailmessage);			
			console.log($.param($scope.formData));
										
			$scope.toggle();
			$scope.doInfo("Sending Email...");						
			
            $http
			({
                method: 'POST',
                url: 'mymailer2.php',
                data: $.param($scope.formData),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            })
												
			.success(function (data) 
			{
										
				$scope.reset();
				
				console.log("data", data);				
				console.log("data.success", data.success);
				console.log("data.errors", data.errors);					

				if (!data.success) {
					// if not successful, bind errors to error variables
					console.log("you had a bad time!");
					var msg = data.errors.message;
					console.log(msg);
					$scope.message = msg;
					$scope.doEvil(msg);
					
				} 
				else 
				{
					// if successful, bind success message to message
					console.log("you win!");
					$scope.message = data.message;
					$scope.doGood(data.message);
				}
				$scope.toggle(true);
			});
        };
        $scope.processLogin = function () 
		{
			var uname = $scope.loginForm.username;
			var pass = $scope.loginForm.password;
			
			accessFac.checkPermission(uname,pass);       //call the method in acccessFac to check user permission.
		};
		$scope.$watch('adminFilename', function() 
		{
			console.log("watch for adminFilename");
			if($scope.adminFilename && ($location.path() == '/adminpage'))
			{
				$scope.Load($("#html_content"), $scope.adminFilename);
			}
		});
		/*
		$scope.adminLoad = function(contents, file)
		{
			console.log("load event");
			var txtfile = file + ".txt";
			console.log("file name = " + txtfile + "\n");
			$.ajax({
				url : 'file.php',
				type: 'post',
				data : {
					filename : txtfile,
					action : 'load'
				},
				success : function(html) 
				{
					console.log("Loaded html.");
					//$("#html_content").val(html);
					contents.val(html);
				}
			});
		};
		*/
		$scope.adminSave = function(file)
		{
			console.log("save event");	
			
			//if( $('#html_content').is(':empty') ) {
			//	console.log("You have nothing to save! Exiting... \n");
			//	alert("You have nothing to save. Exiting...");
			//	return;
			//}
			
			//var file = $scope.adminFilename;
			console.log(file);
			alert("Saving " + file + "!")
			$.ajax(
			{
				url : 'file.php',
				type: 'post',
				data : {
					filename : file,
					action : 'save',
					content : encodeURIComponent($('#html_content').val())
				},
				success : function(msg) 
				{
					console.log(msg);
				}				
			});
			$scope.toggle();
			$scope.doGood("Writing to file...");	
			$scope.toggle(true);
			$scope.reset();
		};
		$scope.Load = function(elementref, file)
		{
			console.log("load event");
			var txtfile = file + ".txt";
			console.log("file name = " + txtfile + "\n");
			$.ajax({
				url : 'file.php',
				type: 'post',
				data : {
					filename : txtfile,
					action : 'load'
				},
				success : function(html) {
					console.log("Loaded html.");
					//console.log(html);
					//$("#html_content").val(html);
					elementref.html(html);
			}
		});			
		};
		if($location.path() == '/aboutme')
		{
			console.log("loading about me content");
			$scope.Load($("#aboutme_html_content"), 'aboutme');
		}
		if($location.path() == '/resume')
		{
			console.log("loading resume content");
			$scope.Load($("#resume_html_content"), 'resume');
		}		
});
karlApp.controller('adminCtrl', function ($scope, $routeParams, $http, alertsManager, $timeout, $location, accessFac)
{
});