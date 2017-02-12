 /******************** WEBPAGE CTRL ******************/
 
 karlApp.controller('webpageCtrl', function ($window, $scope, $routeParams, $http, alertsManager, $timeout, $location,facSiteContent, $rootScope, serviceMethodsFactory)
{			
	var sideInfo = $(".side-info");
	sideInfo[0].className = "col-md-3 col-xs-12 side-info";
	var myele = $(".view-container");
	myele[0].className = "col-md-9 col-xs-12 view-container";
	myele[0].style.marginTop = '0px';
	$scope.formData = {};				
	$scope.alerts = alertsManager.alerts;
	$scope.AlertMessage = {active: false};
	$scope.global = $rootScope;
	$scope.firstload = false;	
	$scope.adminPage = false;
	$(".side-info").css('display', 'inline');
	
	$scope.toggle = function(delay)
	{					
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
	};
	$scope.isValid = function(value) 
	{
		return !value;
	}					
	function IsHomePage()
	{
		return ($location.path().includes('aboutme') || $location.path() == '/' || $location.path() == '#/');
	}		
	$scope.processForm = function () 
	{		
		$scope.toggle();												
		alertsManager.doInfo("Sending Email...");	
		url = 'mymailer2.php';
		serviceMethodsFactory.apiPost(url, $scope.formData, 
		function(data){
			alertsManager.doEvil("Something went horribly wrong!");
			$scope.toggle(true);
		},
		function(data){
			if (!data.success) {
				var msg = data.errors.message;
				$scope.message = msg;
				alertsManager.doEvil(msg);					
			} 
			else 
			{
				$scope.message = data.message;
				alertsManager.doGood(data.message);
			}
			$scope.toggle(true);
		});
	};	
	var init = function () 
	{
		if(facSiteContent.getSavedAboutMeContent() == undefined)
		{
		   facSiteContent.getSiteContent() 
		   .then(function(site_content_data) 
		   {	   			  			   				  			
					
				var count = 1;		
				angular.forEach(site_content_data.site_content[0], function(value, key) 
				{
					if(key.indexOf("aboutme") !== -1)
					{
						facSiteContent.setSavedAboutMeContent(value);
					}	
					else if(key.indexOf("greeting") !== -1)
					{
						facSiteContent.setSavedGreetingContent(value);
					}	
					else if(key.indexOf("sign") !== -1)					
					{
						facSiteContent.setSavedSignoffContent(value);
					}	
					else if(key.indexOf("footer") !== -1)
					{
						facSiteContent.setSavedFooterContent(value);														
					}
					else if(key.indexOf("media") !==-1)
					{
						facSiteContent.setSavedMediaIntroContent(value);
					}
					else if(key.indexOf("resume") !==-1)
					{
						facSiteContent.setSavedResumeContent(value);
					}					
				});	
				if(IsHomePage())
				{
					$scope.applyaboutmesitedata();
					$scope.applyindexsitedata();						
				}
				if($location.path().includes('media'))
				{
					$scope.applymediasitedata();
				}
				if($location.path().includes('resume'))
				{
					$scope.applyresumecontent();
					$scope.applyindexsitedata();
				}
				else
				{
					$scope.applyindexsitedata();
				}
			});
		}			
	}
	$scope.applyaboutmesitedata = function()
	{
		$scope.global.aboutme_intro_divcontent.content = facSiteContent.getSavedAboutMeContent();			
		$scope.global.sign_off.content = facSiteContent.getSavedSignoffContent();
		var myclass= "aboutme_content";
		setTimeout(function()
		{
			$("#aboutme_intro_div").addClass(myclass );
			$("#sign_off_div").addClass(myclass);	
		},0);
	}
	$scope.applyindexsitedata = function()
	{
		$("#greeting").html(facSiteContent.getSavedGreetingContent());			
		$("#myfooter").html(facSiteContent.getSavedFooterContent());
		
		setTimeout(function()
		{
			$("#greeting").addClass("greeting");	
			$("#myfooter").addClass("footer");
		},0);

	}
	$scope.applymediasitedata = function()
	{
		$("#media_intro_div").html(facSiteContent.getSavedMediaIntroContent());
		setTimeout(function()
		{
		$("#media_intro_div").addClass("media_div");
		},0);
	}	
	$scope.applyresumecontent = function()
	{
		$("#resume_html_content").html(facSiteContent.getSavedResumeContent());
	}
	
	init();	
	
	/*****************************************/
	if(IsHomePage())
	{				
		$scope.applyaboutmesitedata();

	}
	else if($location.path().includes('media'))
	{			
		$scope.applymediasitedata();
	}
	else if($location.path().includes('resume'))
	{	
		$scope.applyresumecontent();
	}	
	/***************************************/
});