<?php

use Illuminate\Support\Facades\Crypt;

function sendResponse($data = null, $http_status_code = 200, $message = null)
{
    $response = [
        'status' => TRUE,
        'message' => $message,
        'data' => $data,
    ];

    return response()->json($response, $http_status_code);
}

function sendError($error = null, $http_status_code = 200)
{
    $response = [
        'status'    =>  FALSE,
        'message'   =>  'An error occurred!',
        'error'     =>  $error,
    ];
    return response()->json($response, $http_status_code);
}

function curlRequest($url = null,$is_post = false,$headers = null,$data = null)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_POST, $is_post);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    if( $data != null ){
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    }
    if( $headers != null ){
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}

function changeEnv($data = array()){
    if(count($data) > 0){

        // Read .env-file
        $env = file_get_contents(base_path() . '/.env');

        // Split string on every " " and write into array
        $env = preg_split('/\s+/', $env);;

        // Loop through given data
        foreach((array)$data as $key => $value){

            // Loop through .env-data
            foreach($env as $env_key => $env_value){

                // Turn the value into an array and stop after the first split
                // So it's not possible to split e.g. the App-Key by accident
                $entry = explode("=", $env_value, 2);

                // Check, if new key fits the actual .env-key
                if($entry[0] == $key){
                    // If yes, overwrite it with the new one
                    $env[$env_key] = $key . "=" . $value;
                } else {
                    // If not, keep the old one
                    $env[$env_key] = $env_value;
                }
            }
        }

        // Turn the array back to an String
        $env = implode("\n", $env);

        // And overwrite the .env with the new data
        file_put_contents(base_path() . '/.env', $env);

        \Illuminate\Support\Facades\Artisan::call('config:clear');
        \Illuminate\Support\Facades\Artisan::call('cache:clear');

        return true;
    } else {
        return false;
    }
}

function getLongLivedUserToken(){
    $url = 'https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id='.env('FACEBOOK_CLIENT_ID').'&client_secret='.env('FACEBOOK_CLIENT_SECRET').'&fb_exchange_token='.env('SHORT_LIVED_USER_ACCESS_TOKEN');
    $response = curlRequest($url,false,null,null);
    $data = json_decode($response);
    if(isset($data->access_token)){
        $env_update = changeEnv([
            'LONG_LIVED_USER_ACCESS_TOKEN'   =>     $data->access_token,
        ]);
        return $data->access_token;
    }
    else{
        return sendError('Error creating token');
    }
}

function getPageAccessToken(){
    $url = 'https://graph.facebook.com/'.env('PAGE_ID').'?fields=access_token&access_token='.env('LONG_LIVED_USER_ACCESS_TOKEN');
    $response = curlRequest($url,false,null,null);
    $data = json_decode($response);
    if(isset($data->access_token)){
        $env_update = changeEnv([
            'PAGE_ACCESS_TOKEN'   =>     $data->access_token,
        ]);
        return $data->access_token;
    }
    else{
        return sendError('Error creating token');
    }
}

function slackNotification($encrypted_id,$message, $user){
    $data = array(
        "text" => $user->username." posted a new story. Do you want to post it on facebook?",
    );
    $actions =[
        [
            "text"      => "Post Story to Facebook",
            "style"     => "primary",
            "url"       => env('APP_URL').'/post-story/'.$encrypted_id,
            "type"      => "button",
            "value"     => "Yes",
            "confirm"   => [
                "title"         => "Post Story to Facebook",
                "text"          => "Are you sure you want to post this story to facebook?",
                "ok_text"       => "Yes",
                "dismiss_text"  => "No"
            ],
        ],
        [
            "text"      => "Delete Story From App",
            "style"     => "default",
            "url"       => env('APP_URL') .'/delete-story/'.$encrypted_id,
            "type"      => "button",
            "confirm"   => [
                "title"         => "Delete Story from App",
                "text"          => "Are you sure you want to delete this story from app?",
                "ok_text"       => "Yes",
                "dismiss_text"  => "No"
            ],
        ],
        [
            "text"      => "Remove User from App",
            "style"     => "danger",
            "url"       => env('APP_URL') .'/remove-user/'. Crypt::encrypt($user->id),
            "type"      => "button",
            "confirm"   => [
                "title"         => "Are you sure?",
                "text"          => "Deleting this user will delete all their stories?",
                "ok_text"       => "Yes",
                "dismiss_text"  => "No"
            ],
        ],
    ];
    $data += [
        "attachments" =>
            [
                [
                    'text'              => $message,
                    'fallback'          => "Action Failed!",
                    'color'             => "#3AA3E3",
                    'attachment_type'   => "default",
                    'actions'           => $actions
                ]
            ]
    ];
    $payload = json_encode($data);
    $webhook_url = "https://hooks.slack.com/services/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";
    $response = curlRequest($webhook_url,true,null,$payload);
}
