<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TempController extends Controller
{
    public function getFacebookGroupPosts(){
        die();
        set_time_limit(99999999);
        ini_set('memory_limit', "9999M");
        $url_array = array();
        $url = "https://graph.facebook.com/608705183059535/groups?access_token=EAAEZC5jRZBrV8BAKgptUkj4ZAQUOyFkcOSwnZCrUqSR0fxdYvwyngZBHbc9I5lnlENFgk2oRzhyuao4INOc0g62n0MSlGP72wrZA9ZCRdCGUJwEqNBvAKyfjVS9orOlTXltXDro3OiPB2ZArtcrZAwsODmsGjlCZAgaOn8a1DRo3TRYAZDZD";
//        $arr = self::recurse_it($url, 0);
        $feeds         = self::fetchUrl($url);
        dd($feeds);
    }

    public function fetchUrl($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 40);

        $data = curl_exec($ch);
        curl_close($ch);

        return $data;
    }
    public function recurse_it($url, $c) {
        global $url_array;
        $feeds         = self::fetchUrl($url);
        $feed_data_obj = json_decode($feeds, true);
        if (!empty($feed_data_obj['data'])) {
            $next_url      = $feed_data_obj['paging']['next'];
            $url_array[$c] = $next_url;
            recurse_it($next_url, $c + 1);
        }
        return $url_array;
    }
}
