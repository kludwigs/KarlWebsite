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

karlApp.factory('facResumeContent', function () {

    var data = {
        fac_resume_content: null,
    };

    return {
        getSavedResumeContent: function () {
            return data.fac_resume_content;
        },		
		setSavedResumeContent: function (html)
		{
			data.fac_resume_content = html;
		}
    };
});
 