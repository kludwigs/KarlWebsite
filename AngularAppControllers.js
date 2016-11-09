 /******************** WEBPAGE CTRL ******************/
 
 karlApp.controller('webpageCtrl', function ($window, $scope, $routeParams, $http, alertsManager, $timeout, $location, facResumeContent,facSiteContent, $rootScope, $sce)
{			
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
		return !value
		}	
								
        $scope.processForm = function () 
		{		
			;
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

/******************** ADMIN CTRL ******************/

karlApp.controller('adminCtrl', function ($scope, $routeParams, $http, alertsManager, $timeout, $location, $anchorScroll,accessFac, currentUserFac, categoriesService, userEntriesService, siteContentService)
{	
		$scope.filenames = ["resume.txt"];//, "aboutme.html"];
		$scope.entries ={};
		$scope.site_content=[{}];
		$scope.categories = [{category_name: "none", id:"0"}];
		$scope.sampleDate = {value: new Date(2016, 11,8, 01, 30)};
		$scope.hideme = false;
		$scope.alerts = alertsManager.alerts;
		$scope.AlertMessage = {active: false};
		$scope.stats ={avg_per_day: "0", avg_purchase:"0", total:"0"};
			
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
				}, 5000);				
			}
			
			//console.log($scope.AlertMessage);
		}
		
        $scope.processLogin = function () 
		{
			currentUserFac.setCurrentUser($scope.loginForm.username);
			currentUserFac.setCurrentUserPassword($scope.loginForm.password);			
			accessFac.checkPermission(currentUserFac.getCurrentUser(),currentUserFac.getCurrentUserPassword());       //call the method in acccessFac to check user permission  .
		};	
		$scope.getCategoriesFromService = function() 
		{
			var uname = currentUserFac.getCurrentUser();
			var pass = currentUserFac.getCurrentUserPassword();
			
		   categoriesService.getCategories(uname,pass) 
		   .then(function(categoryData) 
		   {	   			  			   				  
				   $scope.safeApply(function()
					{			
						angular.forEach(categoryData.categories, function(item) 
						{
							$scope.categories.push({category_name:item.category_name,id: item.id});
						});											
					}); 										
		   
			});			
		}
		$scope.getSiteContentFromService = function() 
		{			
		   siteContentService.getSiteContent() 
		   .then(function(site_content_data) 
		   {	   			  			   				  
				   $scope.safeApply(function()
					{			
						console.log("safe apply! in getSiteContent")
						console.log(site_content_data.site_content);
							
							var count = 1;		
						angular.forEach(site_content_data.site_content[0], function(value, key) 
						{
							// do something for all key: value pairs 
//							console.log("value =", value);
							console.log("key =", key);
							$scope.site_content.push({key:key, "value":value});
						});		
						
						//$site_content = site_content_data.site_content[0];
						console.log("for Each done site_content json object is populated", $scope.site_content);
					}); 										
		   
			});			
		}		

		var mywatch =$scope.$watch('adminFilename', function() 
		{
			console.log("watch from adminCtrl");
			
			console.log("watch for adminFilename");
			if($scope.adminFilename)
			{
				console.log("loading content (from adminCtrl)");
				$scope.AdminLoad($("#html_content"), $scope.adminFilename);
			}
			else
			{
				console.log("admin watch no load");
			}
		});	
		var site_content_watch =$scope.$watch('site_content_select', function() 
		{
			console.log("watch from adminCtrl");
			
			console.log("watch for site_content_select");
			if($scope.site_content_select)
			{
				console.log("loading content site_content_watch");
				if($scope.site_content)
				{
					console.log("site_content_select ==", $scope.site_content_select.key);
					
					angular.forEach($scope.site_content, function(value, key) 
					{						
						if (value.key == $scope.site_content_select.key) 
						{
							console.log("value.key == ", value.key);
							console.log("got the match!");
							$scope.site_content_edit_text_field = value.value;
						}
						
					});			
				}
			}
		});	
		$scope.saveContentChanges = function(objectkey, objectvalue)
		{
			console.log("object to change", objectkey, ",", objectvalue);

			alert("Saving " + objectkey + "!");
			$.ajax(
			{
				url : 'site_content.php',
				type: 'PUT',
				data:
				{
					'key' : objectkey,
					'new_value' : objectvalue,	
				},
				success : function(msg) 
				{
					console.log(msg);
					angular.forEach($scope.site_content, function(value, key) 
					{						
						if (value.key == objectkey) 
						{
							$scope.site_content[key]["value"] = objectvalue;						
						}
						
					});	
					
				},
				error : function(msg) 
				{
					console.log(msg);
				}					
			});
		};
		$scope.adminSave = function(file)
		{
			console.log("save event");	
		
			
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
			alertsManager.doGood("Writing to file...");	
			$scope.toggle(true);
			;
		};
		$scope.AdminLoad = function(elementref, file)
		{
			console.log("load event");
			var myfile = file; /* + ".txt" */
			console.log("file name = " + myfile + "\n");
			$.ajax({
				url : 'file.php',
				type: 'post',
				data : {
					filename : myfile,
					action : 'load'
				},
				success : function(html) 
				{
					console.log("Loaded html.");
					elementref.html(html);
				}
			});			
		};
		
		$scope.refreshBudgetEntries =function()
		{
			console.log("you called refreshBudgetEntries function - ");	
			$scope.getBudgetEntries();
		};
		
		$scope.getBudgetEntries = function()
		{
			var uname = currentUserFac.getCurrentUser();
			var pass = currentUserFac.getCurrentUserPassword();
			
		    userEntriesService.getUserEntries(uname,pass) 
			.then(function(entriesData) 
		    {	 
				console.log("getBudgetEntries promise",entriesData.entries);
			   $scope.safeApply(function()
				{			
					$scope.entries = entriesData.entries;	
				}); 												   
			});	
		};
		$scope.returnUser = function()
		{
			return currentUserFac.getCurrentUser();
		};	
		
		$scope.safeApply = function(fn) 
		{
		  var phase = this.$root.$$phase;
		  if(phase == '$apply' || phase == '$digest') 
		  {
			if(fn && (typeof(fn) === 'function')) 
			{
			  fn();
			}
		  } else 
		  {
			this.$apply(fn);
		  }
		};
		$scope.insertNewEntry = function()
		{
			//$scope.toggle();
			
			console.log("you called insertNewEntry function - ");	
			//alertsManager.doInfo("Sending entry to database...");
			var uname = currentUserFac.getCurrentUser();
			var pass = currentUserFac.getCurrentUserPassword();
			
			//$scope.categories = [{category_name: "none", id:"0"}];
			//console.log("category.id -- category.category_name",$scope.entry.category.id, $scope.entry.category.category_name);
			var tmp_category = $scope.entry.category;
			var tmp_price = $scope.entry.price;
			var tmp_comments = $scope.entry.comments;	
			
			
			console.log("entry.category -", tmp_category);
			console.log("entry.price - ",tmp_price );
			console.log("entry.comments - ",tmp_comments);
			
		   userEntriesService.insertUserEntry(uname, pass, tmp_category, tmp_price , tmp_comments) 
		   .then(function(new_entry_data) 
		   {	   	
				if(new_entry_data.insertion.success == true)
				{
					console.log("insert User Entry promise return ---", new_entry_data);
				}else 
					console.log("promise came back and it hit the fan");
			});		
				
			/*
			var tmp_category = $scope.entry.category;
			var tmp_price = $scope.entry.price;
			var tmp_comments = $scope.entry.comments;				
			
			console.log("tmp_category -", tmp_category);
			console.log("tmp_price - ",tmp_price);
			console.log("tmp_comments - ",tmp_comments);			
			
			console.log("uname:" + uname  + " - pass:" + pass);
			*/
			/*
			$.ajax({
				url : 'budget_user_entries.php',
				type: 'POST',
				data: $.param({ "username": uname ,"password": pass, "price":tmp_price, "comments":tmp_comments, "category_id":tmp_category }),
				headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
				success : function(mydata) 
				{
					console.log("Successfully insert record");
					console.log(mydata);	
					alertsManager.doGood("Successfully inserted record!");		
					$scope.toggle(true);
					
				},
				error: function(mydata) 
				{ 					
					console.log("request failed");
					console.log("data", mydata);				
					console.log("data.success", mydata.success);
					console.log("data.errors", mydata.errors);
					alertsManager.doEvil("Failed to insert record!");
					$scope.toggle(true);
				}			
			});	
		
			*/
		};
		$scope.calculateStats = function()
		{
			console.log("CalculateStats");
			$scope.CalculateAvgPurchase();
		};
		$scope.goToBottom = function()
		{
			$location.hash('stats_table');
			$anchorScroll();
		};
		$scope.CalculateAvgPurchase = function()
		{
			var total  = 0;
			var num_entries = $scope.entries.length;
			var count =0 ;
			var startDate;
			console.log("/*Calculate Avg Purchase*/");
			console.log("entries length == ", num_entries);
			angular.forEach($scope.entries, function(value, key) 
			{
				var currentVal = Number(value.price);
				if(count ==0)
				{
					startDate = value.date;
				}
				if(currentVal != NaN)
				{
				//console.log("key ---", key);
				//console.log("value ---", value);
					total = total + currentVal;		
					count++;
				}
			});	
			if(total != undefined)
			{
				console.log("count == ", count);
				console.log("total == ", total);
				$scope.stats.total = total;
				$scope.stats.avg_purchase = total/num_entries;
			}
		};
		// init
		var init = function () 
		{
			console.log("firing init!");
			
			if($location.path() == '/adminpage')
			{
				console.log("we're on the adminpage get those categories!");
				$scope.getCategoriesFromService();
				$scope.getBudgetEntries();
				$scope.getSiteContentFromService();
				$scope.hideme = true;
			}
			else
				$scope.hideme = false;
		};
		// and fire it after definition
		init();		
});