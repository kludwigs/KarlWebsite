/******************** ADMIN CTRL ******************/

karlApp.controller('adminCtrl', function ($scope, $routeParams, $http, alertsManager, $timeout, $location, $anchorScroll,accessFac, currentUserFac, categoriesService, userEntriesService, siteContentService, musicEntriesService)
{	
		$scope.filenames = ["resume.txt"];//, "aboutme.html"];
		$scope.entries ={};
		$scope.site_content=[{}];
		$scope.categories = [{category_name: "none", id:"0"}];
		$scope.hideme = false;
		$scope.alerts = alertsManager.alerts;
		$scope.AlertMessage = {active: false};
		$scope.stats ={avg_per_day: "0", avg_purchase:"0", total:"0", date:"-------"};
		$scope.entry = {};
    
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

		}
		
        $scope.processLogin = function () 
		{
			currentUserFac.setCurrentUser($scope.loginForm.username);
			currentUserFac.setCurrentUserPassword($scope.loginForm.password);			
			accessFac.checkPermission(currentUserFac.getCurrentUser(),currentUserFac.getCurrentUserPassword());   
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
							//console.log("value =", value);
							console.log("key =", key);
							$scope.site_content.push({key:key, "value":value});
						});		
						
						console.log("for Each done site_content json object is populated", $scope.site_content);
					}); 										
		   
			});			
		}		
		$scope.myfunction = function()
		{
			alert("insertEntryCategorySelect");
			console.log("insertEntryCategorySelect -- ");
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
		$scope.getMusicEntries = function()
		{
			var uname = currentUserFac.getCurrentUser();
			var pass = currentUserFac.getCurrentUserPassword();
			
		    musicEntriesService.getEntries(uname,pass) 
			.then(function(musicgigData) 
		    {	 
			   $scope.safeApply(function()
				{			
					$scope.entries = musicgigData.entries;	
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
		$scope.$watch('entry', function() {
			console.log("watch for category", $scope.entry);
		});
		$scope.insertNewEntry = function()
		{
			$scope.toggle();
			alertsManager.doInfo("Sending entry to database...");
			var uname = currentUserFac.getCurrentUser();
			var pass = currentUserFac.getCurrentUserPassword();

			console.log("$scope.entry to insert ---- ",$scope.entry);
			var tmp_category = $scope.entry.category;
			var tmp_price = $scope.entry.price;
			var tmp_comments = $scope.entry.comments;	
			
		   userEntriesService.insertUserEntry(uname, pass, tmp_category.id, tmp_price , tmp_comments) 
		   .then(function(new_entry_data) 
		   {	   	
				if(new_entry_data.insertion.success == true)
				{
					console.log("insert User Entry promise return ---", new_entry_data);
					alertsManager.doGood("Successfully inserted record!");		
					$scope.toggle(true);
					$scope.addRecordToEntryList(uname, tmp_price, tmp_comments, tmp_category.category_name, new_entry_data.insertion.data);
				}else 
				{
					console.log("promise came back and it hit the fan");
					alertsManager.doEvil("Failed to insert record!");
					$scope.toggle(true);
				}
			});		
		};
		$scope.addRecordToEntryList = function(uname, record_price, record_comments, record_category_name, record_date)
		{
			var new_record = { "username": uname, "price":record_price, "comments":record_comments, "category_name":record_category_name, "date_time": record_date};
			$scope.entries.push(new_record);
		}
		
		$scope.calculateStats = function()
		{
			console.log("CalculateStats");
			var uname = currentUserFac.getCurrentUser();
			var pass = currentUserFac.getCurrentUserPassword();
			
		   userEntriesService.getUserStats(uname, pass) 
		   .then(function(data) 
		   {	   	
				if(data.stats.success == true)
				{
					console.log("calculate Stats promise return ---", data);
					// user pointer to the data
					var x = data.stats.data;
					console.log("x var", x);
					$scope.stats.avg_per_day = x.sum / x.days;
					$scope.stats.total = x.sum;
					$scope.stats.date = x.start;
				}else 
				{
					console.log("calculate Stats promise came back and it hit the fan");
				}
			});	
		};
		$scope.goToBottom = function()
		{
			$location.hash('stats_table');
			$anchorScroll();
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
				$scope.calculateStats();
				$scope.hideme = true;
			}
			else
				$scope.hideme = false;
		};
		// and fire it after definition
		init();		
});