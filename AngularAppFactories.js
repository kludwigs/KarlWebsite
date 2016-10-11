karlApp.factory('alertsManager', function($timeout) {
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
        },
		doGood: function(message)
		{
			this.clearAlerts();
			console.log(message);
			this.addAlert(message, "alert-success");
		},
		doEvil: function(message)
		{
			this.clearAlerts();
			console.log(message);
			this.addAlert(message, "alert-danger");
		},
		doInfo: function(message)
		{
			this.clearAlerts();
			console.log(message);
			this.addAlert(message, "alert-info");
		},
		reset: function(delay) 
		{
			if(!delay)
			{
				this.clearAlerts();
			}
			else
			{
				$timeout(function()
				{
					this.clearAlerts();
				}, 3000);				
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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
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

karlApp.factory('currentUserFac', function () {

    var data = {
        current_user: '',
		current_user_password: ''
    };

    return {
        getCurrentUser: function () {
            return data.current_user;
        },
        getCurrentUserPassword: function () {
            return data.current_user_password;
        },		
        setCurrentUser: function (user) {
            data.current_user = user;
        },
		setCurrentUserPassword: function (pass)
		{
			data.current_user_password = pass;
		}
    };
});

karlApp.factory('facResumeContent', function ($http) {
	var obj = {}
	this.resume;
	this.file;
	obj.getSavedResumeContent = function () 
	{
		return this.resume;
	}		
	obj.setSavedResumeContent = function (html)
	{
		this.resume = html;
	}
	obj.loadResumeContent = function(elementref, file)
	{
		if(file === undefined || elementref === undefined)
			return;
		console.log("load event");
		var txtfile = file + ".txt";
		this.setSavedResumeContent("fuck");
		var poop =this.getSavedResumeContent();
		this.file = file;
		console.log(poop);
		console.log("file name = " + txtfile + "\n");
		$http
		({
			url : 'file.php',
			method: 'post',
			//type:'POST',
			data: $.param({ 'filename': txtfile ,'action': 'load'}),
			headers: { 'Content-Type': 'application/x-www-form-urlencoded'},// set the headers so angular passing info as form data (not request payload)				
		})			
		.success(function(html) 
		{
			console.log("Loaded html.");
			//console.log(html);

			if(elementref)
			{
				elementref.html(html);
			}					
			obj.setSavedResumeContent(html);
		})	
		.error(function()
		{
			console.log("failed to get ", this.file);
		});	//semicolon wraps success and error	
	}
	return obj;		
});
 
karlApp.factory('facSiteContent', function ($http, $log, $q) {

    var AboutMeContent = null;
	var	FooterContent = null;
	var	SignoffContent = null;
	var	GreetingContent = null;
	var MediaContent = null;
    
    return{		
        getSavedAboutMeContent: function ()
		{
            return AboutMeContent;
        },		
		setSavedAboutMeContent: function (html)
		{
			AboutMeContent = html;
		},
        getSavedFooterContent: function () 
		{
            return FooterContent;
        },		
		setSavedFooterContent: function (html)
		{
			FooterContent = html;
		},		
		getSavedSignoffContent: function () 
		{
            return SignoffContent;
        },		
		setSavedSignoffContent: function (html)	
		{
			SignoffContent = html;
		},
        getSavedGreetingContent: function ()
		{
            return GreetingContent;
        },		
		setSavedGreetingContent: function (html)
		{
			GreetingContent = html;
		},
		getSavedMediaIntroContent: function()
		{
			return MediaContent;
		},
		setSavedMediaIntroContent: function(html)
		{
			MediaContent = html;
		},
		getSiteContent: function(uname, pass) 
		{
			var deferred = $q.defer();
			$http
			({
				method: 'GET',
				url: 'site_content.php',                
			})
			.success(function(data) 
			{ 
				console.log(data);
				console.log("we get data back in site_content.php", data.data);
				deferred.resolve
			({
				site_content: data.data
			});
			}).error(function(msg, code) 
			{
				console.log("we had an error in siteContentService");
				deferred.reject(msg);
				$log.error(msg, code);
			});
			return deferred.promise;
		}
    };
}); 