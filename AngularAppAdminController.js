/******************** ADMIN CTRL ******************/

karlApp.controller('adminCtrl', function ($scope, $routeParams, $http, alertsManager, $timeout, $location, $anchorScroll,accessFac, currentUserFac,serviceMethodsFactory)
{			
		$scope.filenames = ["resume.txt"];//, "aboutme.html"];
		$scope.adminFilename = $scope.filenames[0];
		$scope.entries ={};
		$scope.musicGigs = {};
		$scope.site_content=[];
		$scope.categories = [{category_name: "none", id:"0"}];
		$scope.venues = [{type: "none", id:"0"}];
		$scope.hideme = false;
		$scope.alerts = alertsManager.alerts;
		$scope.AlertMessage = {active: false};
		$scope.stats ={avg_per_day: "0", avg_purchase:"0", total:"0", date:"-------"};
		$scope.entry = {};
		$scope.num_records = 100;
		$scope.gig = [];
    
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
			url = 'budget_categories.php';
			params = {"password":pass, "username":uname};
		    serviceMethodsFactory.apiGet(url, params, null, function(result){  			  			   				  		
				angular.forEach(result.data, function(item) 
				{
					$scope.categories.push({category_name:item.category_name,id: item.id});
				});																						   
			});			
		}
		$scope.getVenueTypes = function(){
			var uname = currentUserFac.getCurrentUser();
			var pass = currentUserFac.getCurrentUserPassword();
			url = 'music_venues.php';
			params = {"password":pass, "username":uname};
		    serviceMethodsFactory.apiGet(url, params, null, function(result){  			  			   				  		
				angular.forEach(result.data, function(x) 
				{
					$scope.venues.push({type:x.type,id: x.id});
				});		
				x = $scope.venues[0];
				$scope.gig.type = x.type;
			});	
		}
		$scope.getSiteContentFromService = function() 
		{			
		   url = 'site_content.php';
		   serviceMethodsFactory.apiGet(url, null, null, function(result)
		   {	  			   				  
				var count = 1;		
				angular.forEach(result.data[0], function(value, key) 
				{
					console.log("key =", key);
					if(key)
					$scope.site_content.push({key:key, "value":value});
				});		
				$scope.site_content_select = $scope.site_content[0];
				console.log("for Each done site_content json object is populated", $scope.site_content);
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
			alert("Saving " + file + "!");
			params = {filename: file, action:'save', content:encodeURIComponent($('#html_content').val())};
			serviceMethodsFactory.apiPost( 'file.php', params, null, function(result) {
			});			
		};
		$scope.AdminLoad = function(elementref, file)
		{
			params = {filename: file, action:'load'};
			serviceMethodsFactory.apiPost( 'file.php', params, null, function(result) {
					elementref.html(result);
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
			$scope.num_records = 50;
			records = $scope.num_records;
			var args = {"username":uname, "password":pass,records:records};
			url = 'budget_user_entries.php';
			serviceMethodsFactory.apiGet(url, args, null, function(result){	
							$scope.entries = [];
							for(i=result.data.length-1;i>=0;i--){
								$scope.entries.push(result.data[i]);						
							}
			});					
		};
		$scope.getMusicEntries = function()
		{			
			var uname = currentUserFac.getCurrentUser();
			var pass = currentUserFac.getCurrentUserPassword();
			var args = {"username":uname, "password":pass};
			url = 'music_gig_entries.php';
			serviceMethodsFactory.apiGet(url, args, null, function(result){				
						$scope.musicGigs = result.data;
						angular.forEach($scope.musicGigs,function(line){
						line.time = new Date(line.time);						
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
			var tmp_category = $scope.entry.category;
			var tmp_price = $scope.entry.price;
			var tmp_comments = $scope.entry.comments;	
			
			params = { "username": uname ,"password": pass, "price":tmp_price, "comments":tmp_comments, "category_id":tmp_category.id};
			url = 'budget_user_entries.php';
			serviceMethodsFactory.apiPost(url, params, null, function(result){	   	
					console.log("insert User Entry promise return ---", result);
					alertsManager.doGood("Successfully inserted record!");		
					$scope.toggle(true);
					$scope.addRecordToEntryList(uname, tmp_price, tmp_comments, tmp_category.category_name, result.data);
			});		
		};
		$scope.logGig = function()
		{
			$scope.toggle();
			alertsManager.doInfo("Sending entry to database...");
			var uname = currentUserFac.getCurrentUser();
			var pass = currentUserFac.getCurrentUserPassword();
			url = 'music_gig_entries.php';
			payout = $scope.gig.payout;
			comments = $scope.gig.comments;
			type = $scope.gig.type;
			time = $scope.gig.date;
			params = {"username": uname ,"password": pass, payout:payout , payment_method_id: 0, comments: comments, venue_id:type.id, time:time, paid: false};
			serviceMethodsFactory.apiPost(url, params, null, function(result){
				alertsManager.doGood("Successfully inserted record!");	
				$scope.toggle(true);
			});				
		}
		$scope.addRecordToEntryList = function(uname, record_price, record_comments, record_category_name, record_date)
		{
			var new_record = { "username": uname, "price":record_price, "comments":record_comments, "category_name":record_category_name, "date_time": record_date};
			$scope.entries.push(new_record);
		}
		
		$scope.calculateStats = function()
		{
			var uname = currentUserFac.getCurrentUser();
			var pass = currentUserFac.getCurrentUserPassword();
			url = 'budget_get_user_stats.php';
			params = {"password":pass, "username":uname};
		    serviceMethodsFactory.apiGet(url, params, null, function(result){
					var x = result.data;
					console.log("x var", x);
					$scope.stats.avg_per_day = x.sum / x.days;
					$scope.stats.total = x.sum;
					$scope.stats.date = x.start;
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
				$scope.getMusicEntries();
				$scope.calculateStats();
				$scope.hideme = true;
				$scope.getVenueTypes();
				var myele = $(".view-container");
				myele[0].className = "col-md-12 col-xs-12 view-container";
				myele[0].style.marginTop='16px';
				var sideInfo = $(".side-info");
				sideInfo[0].className = "col-md-12 col-xs-12 side-info";				
			}
			else
				$scope.hideme = false;
		};
		// and fire it after definition
		init();		
});