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
	$user_id =0;
	
	$method = $_SERVER['REQUEST_METHOD'];
	switch ($method) 
	{
		  case 'GET':
				$username = $_GET['username'];
				$password = $_GET['password'];
				$month = $_GET['month'];
				$year = $_GET['year'];
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
				// set up stored procedure queries, date_format start date e.g. Aug, 25 - 2016
				$sql_statement = "SELECT SUM(price) FROM entries WHERE Month(date_time) = '$month' AND YEAR( date_time) = '$year' AND user_id = '$user_id'";
			
				$user_stats = get_user_stats($sql_statement);
			
				if($user_stats == false)
				{		
					sendresponse($response, 5, false, $api_response_code);					
				}
				else
					$response['data'] = $user_stats;			
			
				break;
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

function get_user_stats($sql_statement) 
{
	global $connect;
	$results = mysqli_query($connect, $sql_statement);
	
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
?>