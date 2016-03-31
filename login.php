<?php
$response_array 	= array();
if($_SERVER["REQUEST_METHOD"] == "POST") {
    $code = $_POST["uCode"];
    $verification_url ='https://api.instagram.com/oauth/access_token';
    $data = array('client_id'       =>  '1787500b491e4206948f2e8c29ab31df',
    'client_secret'                =>  'a55f6781d6504c0597254602b4890e3c',
    'grant_type'                   =>  'authorization_code',
    'redirect_uri'                =>  'http://shiv.site88.net',
    'code'                        =>  $code);

  	$curl = curl_init();
  	curl_setopt($curl, CURLOPT_URL,$verification_url);
  	curl_setopt($curl, CURLOPT_POST, 1);
  	curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
  	curl_setopt($curl, CURLOPT_RETURNTRANSFER,1);
    $response = curl_exec($curl);
	curl_close ($curl);
    $req_response = json_decode($response);

    $response_array['access_token'] =  $req_response->access_token;
    $response_array['username'] =  $req_response ->user->username;
    $response_array['profile_picture'] = $req_response ->user->profile_picture;
    $response_array['full_name'] = $req_response ->user->full_name;
    $response_array['id'] = $req_response ->user->id;
    $image_fetch_url ='https://api.instagram.com/v1/users/self/media/recent/?access_token=' . $response_array['access_token'];

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL,$image_fetch_url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER,1);
    $req_response = curl_exec($curl);
    curl_close ($curl);
    $image_response = json_decode($req_response);

    $response_array['success'] = true;
    $response_array['image_related'] = $image_response;
} else {
    $response_array['success'] = false;
}
    header("Content-type: application/json");
    echo json_encode($response_array);
?>
