 /******************** WEBPAGE CTRL ******************/
 
 karlApp.controller('webpageCtrl', function ($scope, $routeParams, $http, alertsManager, $timeout, $location)
{			
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

		if($location.path() == '/resume')
		{
			console.log("loading resume content");
			$scope.Load($("#resume_html_content"), 'resume');
		}
});


/******************** ADMIN CTRL ******************/

karlApp.controller('adminCtrl', function ($scope, $routeParams, $http, alertsManager, $timeout, $location, accessFac, currentUserFac, categoriesService, userEntriesService)
{	
		$scope.filenames = ["resume.txt", "aboutme.html"];
		$scope.entries ={};
		$scope.categories = [{category_name: "none", id:"0"}];
		$scope.sampleDate = {value: new Date(2016, 11,8, 01, 30)};
		$scope.hideme = false;
		
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
			$scope.doGood("Writing to file...");	
			$scope.toggle(true);
			$scope.reset();
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
					//console.log(html);
					//$("#html_content").val(html);
					elementref.html(html);
				}
			});			
		};
		
		$scope.refreshBudgetEntries =function()
		{
			console.log("you called refreshBudgetEntries function - ");	
			
			var uname = currentUserFac.getCurrentUser();
			var pass = currentUserFac.getCurrentUserPassword();
			
			console.log("uname:" + uname  + " - pass:" + pass);
			
			$.ajax({
				url : 'budget_user_entries.php',
				type: 'GET',
				data: $.param({ "username": uname ,"password": pass}),
				headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
				success : function(mydata) 
				{
					console.log("Entries coming back");
					console.log(mydata);
					console.log(mydata.data);
					//console.log(mydata.data[0]);										
					$scope.$apply(function()
					{ // put $scope var that needs to be updated
						$scope.entries = mydata.data;
					});
					
				},
				error: function(mydata) 
				{ 
					console.log("request failed");
					console.log("data", mydata);				
					console.log("data.success", mydata.success);
					console.log("data.errors", mydata.errors);
				}   
			});	
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
			console.log("you called insertNewEntry function - ");	
			
			var uname = currentUserFac.getCurrentUser();
			var pass = currentUserFac.getCurrentUserPassword();
			console.log("entry.category -", $scope.entry.category.id);
			console.log("entry.price - ",$scope.entry.price );
			console.log("entry.comments - ",$scope.entry.comments );
			var tmp_category = $scope.entry.category;
			var tmp_price = $scope.entry.price;
			var tmp_comments = $scope.entry.comments;				
			
			console.log("tmp_category -", tmp_category);
			console.log("tmp_price - ",tmp_price);
			console.log("tmp_comments - ",tmp_comments);			
			
			console.log("uname:" + uname  + " - pass:" + pass);
			
			$.ajax({
				url : 'budget_user_entries.php',
				type: 'POST',
				data: $.param({ "username": uname ,"password": pass, "price":tmp_price, "comments":tmp_comments, "category_id":tmp_category }),
				headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
				success : function(mydata) 
				{
					console.log("Successfully insert record");
					console.log(mydata);										
					
				},
				error: function(mydata) 
				{ 
					console.log("request failed");
					console.log("data", mydata);				
					console.log("data.success", mydata.success);
					console.log("data.errors", mydata.errors);
				}   
			});				
			
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
				$scope.hideme = true;
			}
			else
				$scope.hideme = false;
		};
		// and fire it after definition
		init();		
});