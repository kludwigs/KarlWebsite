<?php
require_once 'sitecontent_database_config.php';

header('Content-Type: application/json');

$HTTPS_required = false;
$authentication_required = false;
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

if($authentication_required == false)
{	
	$method = $_SERVER['REQUEST_METHOD'];
	switch ($method) 
	{
		case 'GET':					
			$sql_select = "SELECT * FROM site_content";			
			$site_content = false;
			$site_content = get_site_data($sql_select);
			
			if($site_content == false)
			{									
				sendresponse($response, 0, false, $api_response_code);		
			}
			else
			{
				$response['data'] = $site_content;
				$response['method'] = 'GET';
			}
			break;
			
		case 'PUT':
			parse_str(file_get_contents('php://input'), $_PUT);
			$key = $_PUT['key'];
			$new_value = $_PUT['new_value'];
			
			$new_value = addslashes($new_value);
			if (empty($key) || empty($new_value))
			{
				sendresponse($response, 6, false, $api_response_code);	
			}
			
			$sql_select = "UPDATE site_content SET $key = '$new_value'";	
			$success = update_site_content($sql_select);
			if($success == false)
			{		
				sendresponse($response, 0, false, $api_response_code);					
			}
			$response['data'] = $new_value;
			$response['method'] = 'PUT';
			
				break;				
		case 'POST':
				die("insert into table"); break;
		case 'DELETE':
				die("delete table where id=key"); break;
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

function get_site_data($sql_select) 
{
	global $connect;
	mysql_query("set character_set_server='utf8'");
	$results = mysqli_query($connect, $sql_select);
	if(!$results)
	{
		//print("$dbPass, $dbUser, $dbDatabase, $dbServer, --- parm is $user_id\n");		
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
		$data = array();
		while($row = $results->fetch_assoc())
		{
			$data[] = $row;
			
		}
		return $data;		
	}	
}
function update_site_content($sql_select) 
{	
	global $connect;
	//$sql_select = mysqli_real_escape_string($connect,$sql_select);
	mysql_query("set character_set_server='utf8'");
	$results = mysqli_query($connect, $sql_select);
	
	if(mysqli_affected_rows($connect) >= 0)
	{
		return (mysqli_error($connect)+mysqli_affected_rows($connect));		
	}
	else
	{
		die(mysqli_error($connect));
		return false;
	}
}
?>