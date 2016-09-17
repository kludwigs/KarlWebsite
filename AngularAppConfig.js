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
	   when('/projects', 
	  {
		templateUrl: 'projects.html',
		controller: 'webpageCtrl',
	  }).	
	   when('/testimonials', 
	  {
		templateUrl: 'testimonials.html',
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

karlApp.run(['$rootScope', function($rootScope, $window) {
	var firsttime= false;
	$rootScope.aboutme_intro_divcontent = {content:'too late!'};
	$rootScope.abouttime = {content:'too late!'};
	$rootScope.stupidface = "you're not little";
	$rootScope.PreviousPage = "you smell";
        $rootScope.$on('$locationChangeStart', function() 
		{			
			if(firsttime == true)
			{
				$rootScope.PreviousPage = location.hash;
				console.log("from run $rootscope  --", $rootScope.PreviousPage);
			}
			else
				firsttime = true;
			
        });
}]);
karlApp.filter('unsafe', function($sce, $rootScope) {
    return function(val, other) {
		
		//var output = 'fuck your <b>couch</b>';
		console.log("unfiltered val---------", val);
		var output = $rootScope.aboutme_intro_divcontent.content;
		//console.log(" $rootScope.aboutme_intro_divcontent.content", output);

		return $sce.trustAsHtml(val);
    };
});
