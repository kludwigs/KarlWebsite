<?php
require('hitcounter.php');
$counter = new HitCounter();
$counter->processViews();
//$mydata = $counter->getData2();
//print("total hits =  " . $mydata->total  . " \n");
//print("unique hits = " . $mydata->unique . " \n");

echo 'http://'. $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];


$dataarray = array
		(
			'name' => "Karl",
			'type' => "human",
		);
		
echo json_encode($dataarray);

?>