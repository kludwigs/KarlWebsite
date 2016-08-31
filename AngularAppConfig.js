var karlApp = angular.module('karlApp', ['ngRoute', 'ngAnimate']);

karlApp.config(function($routeProvider) 
{
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
		controller: 'adminCtrl',
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
		controller: 'adminCtrl',
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