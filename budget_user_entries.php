<?php
require_once 'budgetdatabase_config.php';
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
	$my_method = "did you see that";
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
				//die('POST break statement');
				$my_method = "you're not going to believe this";
				$username		= $_POST['username'];
				$password		= $_POST['password'];		
				$category_id 	= $_POST['category_id'];
				$price 			= $_POST['price'];	
				$comments		= $_POST['comments'];	
				$date = date('Y-m-d H:i:s');				
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
		{
			case 'GET':			
				$sql_select = "SELECT entries.*, users.username, categories.category_name FROM entries, users, categories WHERE entries.user_id = $user_id AND users.id = entries.user_id AND categories.id = entries.category_id ORDER BY entries.date_time";
			
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

				$sql_command = "INSERT INTO entries (user_id, price, date_time, comments, category_id, entry_id) values ('$user_id', '$price',now(), '$comments','$category_id', NULL)";
				$result = insert_new_entry_for_user($sql_command);
				if($result == false)
				{
					sendresponse($response, 5, false, $api_response_code);
				}
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