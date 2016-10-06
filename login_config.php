<?php
	$config = parse_ini_file("settings/dataleader.txt");
	$dbUser = $config['user'];
	$dbPass = $config['pass'];
	$dbDatabase = $config['database'];
	$dbServer = $config['server'];
	$connect= new mysqli($dbServer, $dbUser, $dbPass, $dbDatabase);
	if ($connect->connect_error) 
	{
		die('Connect Error (' . $connect->connect_errno . ') '. $connect->connect_error);
	}		
?>