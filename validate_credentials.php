<?php

function validatecredentials($username, $password)
{
	global $connect;

	$parm = "%$username%";
	$sql_select = "SELECT * FROM users WHERE username like '$parm'";
	
	$results = mysqli_query($connect, $sql_select);
	if(!$results)
	{
		//print("$dbpass, $dbUser, $dbDatabase, $dbServer, --- parm is $parm\n");
		
		die('Could not retrieve data from users with '.$username . ' ' . (mysqli_error($connect)) . '\n');
	}
	
	if(mysqli_num_rows($results) == 0)
	{
		echo "no results!";
		return false;
	} 
	else
	{	
		$passhash = hash("sha256", "$password");
		$row = mysqli_fetch_assoc($results);
		$r_pass = $row['password']; 
		$r_user = $row['username'];
		$r_user_id = $row['id'];
		//die('r_user_id ===  ' . $r_user_id . '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		//die("passwords $r_pass and $passhash! usernames received $r_user and submitted $username\n");
		if(strcmp(trim($r_pass),trim($passhash)) == 0)
			return $r_user_id;
		else
			return false;
	}
}

?>