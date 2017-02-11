/******************** ADMIN CTRL ******************/

karlApp.controller('adminCtrl', function ($scope, $routeParams, $http, alertsManager, $timeout, $location, $anchorScroll,accessFac, currentUserFac,serviceMethodsFactory)
{			
	$scope.resume = {};
	$scope.entries ={};
	$scope.musicGigs = {};
	$scope.site_content=[];
	$scope.categories = [];
	$scope.venues = [{type: "none", id:"0"}];
	$scope.hideme = false;
	$scope.alerts = alertsManager.alerts;
	$scope.AlertMessage = {active: false};
	$scope.stats ={avg_per_day: "0", avg_purchase:"0", total:"0", date:"-------"};
	$scope.entry = {};
	$scope.num_records = 100;
	$scope.username = "";
	$scope.gig = [];		

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
			}, 5000);				
		}

	}
	
	$scope.processLogin = function () 
	{
		currentUserFac.setCurrentUser($scope.loginForm.username);
		currentUserFac.setCurrentUserPassword($scope.loginForm.password);			
		accessFac.checkPermission(currentUserFac.getCurrentUser(),currentUserFac.getCurrentUserPassword()); 
		$scope.username = currentUserFac.getCurrentUser();			
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
				if(key && key == 'resume'){
					$scope.resume.resume_text_field = value;
					$scope.resume.key = key;
				}
				else if(key)
				$scope.site_content.push({key:key, "value":value});
			
			});		
			$scope.site_content_select = $scope.site_content[0];
		});			
	}		
	var mywatch =$scope.$watch('adminFilename', function() 
	{
		if($scope.adminFilename)
		{
			$scope.AdminLoad($("#html_content"), $scope.adminFilename);
		}
		else
		{
			console.log("admin watch no load");
		}
	});	
	var site_content_watch =$scope.$watch('site_content_select', function() 
	{
		if($scope.site_content_select)
		{		
			if($scope.site_content)
			{							
				angular.forEach($scope.site_content, function(value, key) 
				{						
					if (value.key == $scope.site_content_select.key) 
					{				
						$scope.site_content_edit_text_field = value.value;
					}
					
				});			
			}
		}
	});	
	$scope.saveResume = function()
	{
		url = 'site_content.php';
		params = { key : $scope.resume.key, new_value : $scope.resume.resume_text_field};	
		
		serviceMethodsFactory.apiPut(url, params, null, 
		function(result){
				
		});				
	}
	$scope.saveContentChanges = function(objectkey, objectvalue)
	{			
		url = 'site_content.php';
		params = { key : objectkey, new_value : objectvalue,};	
		
		serviceMethodsFactory.apiPut(url, params, null, 
		function(result){
				angular.forEach($scope.site_content, function(value, key) 
				{						
					if (value.key == objectkey) 
					{
						$scope.site_content[key]["value"] = objectvalue;						
					}						
				});	
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
		$scope.getBudgetEntries();
	};
	function formatDateTime(tmpDate)
	{
		var monthNames = ["Jan", "Feb", "March", "April", "May", "June",
		"July", "Aug", "Sept", "Oct", "Nov", "Dec"
			];

		var hours = tmpDate.getHours();
		var minutes = tmpDate.getMinutes();
		var day = tmpDate.getDate();
		var year = tmpDate.getFullYear();
		var amppm = "AM";
		if(hours > 12){
		
			amppm = "PM"
			hours -= 12;
		}
		else if(hours < 1)
			hours = 12;
					
		if(minutes < 10)
			minutes = "0" + minutes;
		var timeOfDay = hours + ':' + minutes + ' ' + amppm;
		tmp = (monthNames[tmpDate.getMonth()] + ' ' + day + ', ' + year + ' - ' + timeOfDay);			
		return tmp;			
	}
	$scope.getBudgetEntries = function()
	{
		var uname = currentUserFac.getCurrentUser();
		var pass = currentUserFac.getCurrentUserPassword();
		$scope.num_records = 50;
		records = $scope.num_records;
		var args = {"username":uname, "password":pass,records:records};
		url = 'budget_user_entries.php';
		var identifier = 'getBudgetEntries';
		serviceMethodsFactory.apiGetPromise(identifier, url, args)
		.then(function(result){				
			if(result[identifier].success == true){
				$scope.entries = [];
				x = result[identifier].data;
				for(i=x.length-1;i>=0;i--){
					var entryDateTime = new Date(x[i].date_time);
					x[i].date_time = formatDateTime(entryDateTime);
					$scope.entries.push(x[i]);
				}
			}
		});						
	};
	$scope.getMusicEntries = function()
	{			
		var uname = currentUserFac.getCurrentUser();
		var pass = currentUserFac.getCurrentUserPassword();
		var args = {"username":uname, "password":pass};
		url = 'music_gig_entries.php';
		var identifier = 'getMusicEntries';
		serviceMethodsFactory.apiGetPromise(identifier, url, args)		
		.then(function(result){	
			x = result[identifier];		
			if(x.success == true){				
					$scope.musicGigs = x.data;
					angular.forEach($scope.musicGigs,function(line){
						line.time = new Date(line.time);
					});
			}			
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
		serviceMethodsFactory.apiPost(url, params, 
			function(result){
				alertsManager.doEvil("Error inserting record!");
				$scope.toggle(true);							
			
		}, 	function(result){	   	
				alertsManager.doGood("Successfully inserted record!");		
				$scope.toggle(true);
				$scope.addRecordToEntryList(uname, tmp_price, tmp_comments, tmp_category.category_name, formatDateTime(new Date(result.data)));
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
		
		if($location.path().includes('adminpage'))
		{
			$scope.getCategoriesFromService();
			$scope.getBudgetEntries();
			$scope.getSiteContentFromService();
			$scope.getMusicEntries();
			$scope.calculateStats();
			$scope.hideme = true;
			$scope.getVenueTypes();
			$scope.$parent.adminPage = false;				
			$scope.username	= currentUserFac.getCurrentUser();
			$(".side-info").css('display', 'none');
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