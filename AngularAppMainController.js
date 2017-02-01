 /******************** WEBPAGE CTRL ******************/
 
 karlApp.controller('webpageCtrl', function ($window, $scope, $routeParams, $http, alertsManager, $timeout, $location, facResumeContent,facSiteContent, $rootScope, $sce)
{			
		var sideInfo = $(".side-info");
		sideInfo[0].className = "col-md-3 col-xs-12 side-info";
		var myele = $(".view-container");
		myele[0].className = "col-md-9 col-xs-12 view-container";
		myele[0].style.marginTop = '0px';
		$scope.formData = {};				
		$scope.alerts = alertsManager.alerts;
		$scope.AlertMessage = {active: false};
		$scope.firstload = false;	
		$scope.global = $rootScope;
		
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
		};
		$scope.isValid = function(value) 
		{
		return !value;
		}	
				
				
        $scope.processForm = function () 
		{		
			$scope.toggle();
			
			console.log($scope.formData.emailname);
			console.log($scope.formData.emailaddress);
			console.log($scope.formData.emailmessage);			
			console.log($.param($scope.formData));
										
			alertsManager.doInfo("Sending Email...");						
			
            $http
			({
                method: 'POST',
                url: 'mymailer2.php',
                data: $.param($scope.formData),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            })
												
			.success(function (data) 
			{
										
				;
				
				console.log("data", data);				
				console.log("data.success", data.success);
				console.log("data.errors", data.errors);					

				if (!data.success) {
					// if not successful, bind errors to error variables
					console.log("you had a bad time!");
					var msg = data.errors.message;
					console.log(msg);
					$scope.message = msg;
					alertsManager.doEvil(msg);
					
				} 
				else 
				{
					// if successful, bind success message to message
					console.log("you win!");
					$scope.message = data.message;
					alertsManager.doGood(data.message);
				}
				$scope.toggle(true);
			});
        };	
		if($location.path() == '/resume')
		{	
			//console.log(facResumeContent.getSavedResumeContent());
			if(facResumeContent.getSavedResumeContent() === undefined)
			{
				console.log("loading resume content #resume_html_content");
				facResumeContent.loadResumeContent($("#resume_html_content"), 'resume');
			}
			else
			{
				console.log("preloaded resume from facResumeContent");
				$("#resume_html_content").html(facResumeContent.getSavedResumeContent());
			}
		}
		else if(facResumeContent.getSavedResumeContent() === undefined)
		{
			console.log("location path == ", $location.path())
			var resume = facResumeContent.loadResumeContent($("#resume_html_content"), 'resume');
			facResumeContent.setSavedResumeContent(resume);			
		}		
		var init = function () 
		{
			if(facSiteContent.getSavedAboutMeContent() == undefined)
			{
			   facSiteContent.getSiteContent() 
			   .then(function(site_content_data) 
			   {	   			  			   				  			
					console.log("promise fulfilled loading getSiteContent");
					console.log(site_content_data.site_content);
						
					var count = 1;		
					angular.forEach(site_content_data.site_content[0], function(value, key) 
					{
						console.log("key, value =", key);
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
							console.log("WE SET THE MEDIA!");
							facSiteContent.setSavedMediaIntroContent(value);
						}
					});	
					if($location.path() =='/aboutme' || $location.path() == '/' || $location.path() == '#/')
					{
						$scope.applyaboutmesitedata();
						$scope.applyindexsitedata();						
					}
					if($location.path() =='/media')
					{
						$scope.applyindexsitedata();
						$scope.applymediasitedata();
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
			console.log("applying about me content");
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
			console.log("applying index content");
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
			console.log("we setting the media div...");
			console.log(facSiteContent.getSavedMediaIntroContent());
			$("#media_intro_div").html(facSiteContent.getSavedMediaIntroContent());
			setTimeout(function()
			{
			$("#media_intro_div").addClass("media_div");
			},0);
		}		
		init();	
		if($location.path() =='/aboutme' || $location.path() == '/' || $location.path() == '#/')
		{			
			console.log(" current", $window.location.hash);			
			$scope.applyaboutmesitedata();

		}
		if($location.path() =='/media')
		{			
			console.log(" current", $window.location.hash);			
			$scope.applymediasitedata();
		}			
		

});