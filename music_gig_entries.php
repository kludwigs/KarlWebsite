<?php
require_once 'musicgigdatabase_config.php';
include 'validate_credentials.php';
header('Content-Type: application/json');

$HTTPS_required = false;
$authentication_required = true;
$response = null;

$api_response_code = array(
	0 => array('HTTP Response' => 400, 'Message' => 'Unknown Error'),
	1 => array('HTTP Response' => 200, 'Message' => 'Success'),
	2 => array('HTTP Response' => 403, 'Message' => 'HTTPS Required'),
	3 => array('HTTP Response' => 401, 'Message' => 'Authentication Required'),
	4 => array('HTTP Response' => 401, 'Message' => 'Authentication Failed'),
	5 => array('HTTP Response' => 404, 'Message' => 'Invalid Request'),
	6 => array('HTTP Response' => 400, 'Message' => 'Invalid Response Format')
);

if($HTTPS_required && $_SERVER['HTTPS'] != 'on')
{	
	sendresponse($response, 2, false, $api_response_code);	
}



if($authentication_required == true)
{
	$username ='';
	$password = '';
	$user_id =0;
	
	$method = $_SERVER['REQUEST_METHOD'];
	
	switch ($method) 
	{
		  case 'GET':				
				$username = $_GET['username'];
				$password = $_GET['password'];
				break;
		  case 'PUT':
		  break;
		  case 'POST':
				$username		= $_POST['username'];
				$password		= $_POST['password'];		
				$payout 		= $_POST['payout'];
				$payment_method	= $_POST['payment_method'];
				$comments		= $_POST['comments'];
				$venue_id		= $_POST['venue_id'];
				$time			= $_POST['time'];
				$paid 			= $_POST['paid'];
				$attachment_id	= $_POST['attachment_id'];
				$date = 		new DateTime($time);				
				break;
		  case 'DELETE':				
				break;
	}	
	
	if (empty($username) || empty($password))
	{
		sendresponse($response, 3, false, $api_response_code);	
	}			
		
	$user_id = validatecredentials($username, $password);
	if($user_id == false)
	{
		sendresponse($response, 4, false, $api_response_code);		
	}
	else
	{			
		switch ($method) 
		{ //DATE_FORMAT(entries.date_time, '%Y-%M-%d %h:%i %p)
			case 'GET':			
				$sql_select = "SELECT entries.user_id, entries.payout, DATE_FORMAT(entries.time,'%Y-%m-%d %h:%i %p') as time , entries.comments, entries.venue_id, users.username, entries.payout, entries.paid, payment_methods.method, entries.attachment_id, venues.type FROM entries, users, venues, payment_methods WHERE entries.user_id = $user_id AND users.id = entries.user_id AND venues.id = entries.venue_id AND entries.payment_method_id = payment_methods.id ORDER BY entries.time";
			
				$entries = get_entries_from_user_id($user_id, $sql_select);
			
				if($entries == false)
				{		
					sendresponse($response, 5, false, $api_response_code);					
				}
				else
					$response['data'] = $entries;			
			
				break;
			case 'PUT':				
					die("update table"); break;
			case 'POST':	
				$dateString = $date->format('Y-m-d');
				$sql_command = "INSERT INTO entries (id, payout, payment_method_id, comments, venue_id, time, paid, user_id, attachment_id) values (
				 NULL, 
				'$payout',
				'$payment_method',
				'$comments',
				'$venue_id', 
				'$dateString', 
				'$paid', 
				'$user_id', 
				'$attachment_id')";
				
				$result = insert_new_entry_for_user($sql_command);
				if($result == false)
				{
					sendresponse($response, 5, false, $api_response_code);
				}else
					$response['data'] = date('Y-m-d h:i A');
				break;
			case 'DELETE':
					die("delete table where id=key"); break;
					
		}	
	}
}
/* we passed - send the data back */
sendresponse($response, 1, true, $api_response_code);

function sendresponse($response, $code, $success, $api_response_code)
{
	$response['code'] = $code;
	$response['status'] = $api_response_code[$response['code']]['HTTP Response'];
	$response['message'] = $api_response_code[$response['code']]['Message'];		
	$response['success'] = $success;	
	
	header('HTTP/1.1 '.$response['status']. ' '.$response['message']);
	header('Content-Type: application/json; charset=utf-8');
	
	echo json_encode($response);	
	exit;
}

function get_entries_from_user_id($user_id, $sql_select) 
{
	global $connect;
	$results = mysqli_query($connect, $sql_select);	
	if(!$results)
	{
		//print("$dbPass, $dbUser, $dbDatabase, $dbServer, --- parm is $user_id\n");		
		//die('Could not retrieve data from entries with '.$user_id.'!\n');
		die(mysqli_error($connect));
		return false;
	}
	
	if(mysqli_num_rows($results) == 0)
	{
		echo "no results!";
		die('we didn\'t get results with $user_id');
		return false;
	} 
	else
	{
		//die('user_id is $user_id !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		$data = array();
		while($row = $results->fetch_assoc())
		{
			$data[] = $row;
		}
		return $data;		
	}	
}
function insert_new_entry_for_user($sql_command)
{
	global $connect;
	$results = mysqli_query($connect, $sql_command);	
	if(!$results)
	{
		//print("$dbPass, $dbUser, $dbDatabase, $dbServer, --- parm is $user_id\n");		
		die(mysqli_error($connect));
		return false;
	}	
	return true;
}
?>