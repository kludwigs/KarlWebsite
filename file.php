<?php
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
    private function save() {
        $content = isset($_POST['content']) ? $_POST['content'] : '';
        file_put_contents($this->dir.$this->filename, urldecode($content));
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
       echo $content;
    }
    private function delete() {
        unlink($this->dir.$this->filename);
    }
	
	private function get_url_contents($url){
        $crl = curl_init();
        $timeout = 5;
        curl_setopt ($crl, CURLOPT_URL,$url);
        curl_setopt ($crl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt ($crl, CURLOPT_CONNECTTIMEOUT, $timeout);
        $ret = curl_exec($crl);
        curl_close($crl);
        return $ret;
	}
	
}
$file = new File();
?>