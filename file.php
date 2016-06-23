<?php

$file = new File();

class File {
    private $filename;
    //private $dir = 'http://'. $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] . '/';
	//private $dir = '/';
	//private $dir ='/files';
	public $urladdress;
    public function __construct() {
		//print("File Constructor");
		//$this->urladdress = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
		$this->urladdress = dirname($_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI']);
		
		//print("this url address = " + $this->urladdress);
		//die("this->urladdress" + $this->urladdress);
		
        $action = isset($_POST['action']) ? $_POST['action'] : false;
        $this->filename = isset($_POST['filename']) ? $_POST['filename'] : false;
        if ((!$action) || (!$this->filename)) return;
        switch ($action) {
            case 'save' : 
                $this->save(); break;
            case 'load' : 
                $this->load(); break;
            case 'delete' : 
                $this->delete(); break;
            default :
                return;
                break;
        }
    }
    private function old_save() {
        $content = isset($_POST['content']) ? $_POST['content'] : '';
        file_put_contents($this->dir.$this->filename, urldecode($content));
    }
	private function save()
	{
		$content = isset($_POST['content']) ? $_POST['content'] : '';
		file_put_contents($this->dir.$this->filename . '.txt', urldecode($content));
	}
    private function load() {
		//print($_SERVER['SERVER_NAME']);
		//print('http://'. $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] . '/');
		//print(" the file name found = " . $this->dir.$this->filename);
		//print($this->urladdress . '/' . $this->filename);
		$url = $this->urladdress . '/' . $this->filename;
		//print($url);
       //$content = @file_get_contents($url);
	   $content = $this->get_url_contents($url);
		//$content =  $this->get_html($url);
		//echo $url;
		echo $content;
    }
    private function delete() {
        unlink($this->dir.$this->filename);
    }
	
	private function get_url_contents($url)
	{
		

		$crl = curl_init($url);
        $timeout = 10;
        curl_setopt ($crl, CURLOPT_URL, 'http://'. $url);
		//curl_setopt($curl, CURLOPT_REFERER, dirname($_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI']));
		curl_setopt($crl, CURLOPT_FAILONERROR, true);
		curl_setopt($crl, CURLOPT_FOLLOWLOCATION, false);
        curl_setopt ($crl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: text/plain'));
		curl_setopt($crl, CURLOPT_BINARYTRANSFER, 1);
		curl_setopt($crl, CURLOPT_FRESH_CONNECT, true);
		curl_setopt($crl, CURLOPT_USERAGENT, $User_Agent);
		curl_setopt($crl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt ($crl, CURLOPT_CONNECTTIMEOUT, $timeout);
		curl_setopt($crl,CURLOPT_ENCODING , "gzip");
		
        $content = curl_exec($crl);
		$info = curl_getinfo($crl);
		/*
			"url"
	"content_type"
	"http_code"
	"header_size"
	"request_size"
	"filetime"
	"ssl_verify_result"
	"redirect_count"
	"total_time"
	"namelookup_time"
	"connect_time"
	"pretransfer_time"
	"size_upload"
	"size_download"
	"speed_download"
	"speed_upload"
	"download_content_length"
	"upload_content_length"
	"starttransfer_time"
	"redirect_time"
	"certinfo"
	"primary_ip"
	"primary_port"
	"local_ip"
	"local_port"
	"redirect_url"
	*/

		if(curl_errno($crl)) 
		{
				// We have an error. Show the error message.
			$error_message =  curl_error($crl);
			curl_close($crl);
			return $error_message;
		}
		
		curl_close($crl);
		//$information = $info['content_type'] . ' ' . $info['url'] . ' ' . $info['http_code'] . ' ' . $info['ssl_verify_result'] . ' ' . $info['redirect_time'];
        return $content;
	}
}

?>
