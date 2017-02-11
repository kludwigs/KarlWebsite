<?php
try {
	$time = "02/19/2017";
    $date = new DateTime($time);
} catch (Exception $e) {
    echo $e->getMessage();
    exit(1);
}

echo $date->format('Y-m-d');
?>