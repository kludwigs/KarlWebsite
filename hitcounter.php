<?php

class HitCounter
{	
	private $dbUser = '';
	private $dbPass= '';
	private $dbDatabase= '';
	private $dbServer= '';
	private $connect;
	private $hitData;
	
	public function __construct()
	{
		print("HitCounter constructor <br>");
		$config = parse_ini_file("settings/dataleader.txt");
		$this->dbUser = $config['user'];
		$this->dbPass = $config['pass'];
		$this->dbDatabase = $config['database'];
		$this->dbServer = $config['server'];
		//print($this->dbUser);
		//print($this->dbPass);
		//print($this->dbDatabase);
		//print("aren't you gonna print anything?");
		//print($this->dbServer);
		//print($config['user']);
		//$this->dbmysql = new PDO('mysql:host='. $this->dbServer . ';dbname=' . $this->dbDatabase, $this->dbUser, $this->dbPass);
		$this->connect= new mysqli($this->dbServer, $this->dbUser, $this->dbPass, $this->dbDatabase);
		$this->hitData->total = 0;
		$this->hitDate->unique = 0;
	}
	public function processViews()
	{
		session_start();
		$this->hitData = $this->getData2();
		$this->visit();
	}
	public function getTotalHists()
	{
		return $this->hitData->total;
	}
	public function getUniqueHits()
	{
		return $this->hitData->unique;
	}
	public function getData2()
	{
		//$data = new stdClass();
		//$data = 32432;
		$sql_select = "SELECT * FROM hit_counter";
		$results = mysqli_query($this->connect, $sql_select);
		if(mysqli_num_rows($results) == 0)
		{
			print("\nNo results\n\n");
			////$data->total = 0;
			$data->total =0;
			$data->unique = 0;
		} 
		else
		{
			print("\nWE GOT results\n");
			$row = mysqli_fetch_assoc($results);
			if($row != null)
			{
				$data->total = $row["total_hits"];
				$data->unique = $row["unique_hits"];
				print("\nHC total hits =  " . $data->total  . " \n");
				print("\nHC unique hits = " . $data->unique . " \n");	
			}			
		}
		return $data;
	}
	
	
	public function getData_old()
	{
		//$data = new stdClass();
		print("call to getData() \n");
		$sql_select = "SELECT * FROM hit_counter";
		//$results = $this->connect->query($sql_select);
		$results = mysqli_query($this->connect, $sql);
		if($results->rowCount()==0)
		{
			$data->total = 0;
			$data->unique = 0;
		//$stmt = $this->connect->prepare('INSERT INTO hit_counter( `total_hits`, `unique_hits`) VALUES(:total, :unique)');
		//	$stmt->bindParam( ':total', $data->total);
		//	$stmt->bindParam( ':unique', $data->unique);
		//	$stmt->execute();
		} 
		else
		{
			$row = mysqli_fetch_assoc($result);
			$data->total = $row['total_hits'];
			$data->unique = $row['unique_hits'];
			print("\nHC total hits =  " . $data->total  . " \n");
			print("\nHC unique hits = " . $data->unique . " \n");
		}
		return $data;
	}
	private function isNewVisitor()
	{
		return !array_key_exists( 'visitd', $_SESSION) && $_SESSION['visited'] != true;
	}
	private function visit()
	{
		$this->connect->query('UPDATE hit_counter SET total_hits = total_hits + 1');
		if($this->isNewVisitor())
		{
			$this->connect->query('UPDATE hit_counter SET unique_hits = unique_hits + 1');
			$_SESSION['visited']  = true;
		}
	}	
}
?>