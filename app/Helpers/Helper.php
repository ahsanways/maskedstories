<?php

namespace App\Helpers;

class Helper{
    public static function notification($tokensArray, $title, $message)
    {
        $fcmUrl = 'https://fcm.googleapis.com/fcm/send';

        $notification = [
            'title' => $title,
            'body'  => $message,
            'sound' => TRUE,
        ];

//      $extraNotificationData = ["message" => $notification, "more_data" => 'dd'];

        $fcmNotification = [
            'registration_ids'  => $tokensArray, //multiple token array
//          'to'                => $token, //single token
            'notification'      => $notification,
//          'data'              => $extraNotificationData
        ];

        $headers = [
            'Authorization: key='. $_ENV['FIREBASE_AUTH_KEY'],
            'Content-Type: application/json'
        ];
        $response = curlRequest($fcmUrl,true,$headers,$fcmNotification);

        return true;
    }

    public static function uploadImageOnServer($request,$key_name,$folder_name)
    {
        $path = '';
        if($request->hasFile($key_name)){
            $allowedfileExtension=['JPEG', 'jpeg','jpg', 'JPG' ,'png', 'PNG'];
            $file = $request->file($key_name);
            $filename = $file->getClientOriginalName();
            $newname = str_replace(' ', '', $filename);
            $extension = $file->getClientOriginalExtension();
            $check=in_array($extension,$allowedfileExtension);
            if($check)
            {
                $finalname = time().$newname;
                $file->move('uploads/'.$folder_name, $finalname);
                $path = 'uploads/'.$folder_name."/". $finalname;
            }
        }
        return $path;
    }
    public static function getFilledElementsInArray($array)
    {
        foreach($array as $key => $value)
            if(empty($value))
                unset($array[$key]);
        return $array;
    }
}

