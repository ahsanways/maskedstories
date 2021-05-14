<?php

namespace App\Http\Controllers;

use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GraphController extends Controller
{
    private $api;

    public function __construct(Facebook $fb)
    {
        $this->middleware(function ($request, $next) use ($fb) {
            $fb->setDefaultAccessToken( env('FACEBOOK_ACCESS_TOKEN') );
            $this->api = $fb;
            return $next($request);
        });
    }

    public function retrieveUserProfile(){
        try {

            $params = "first_name,last_name,age_range,gender";

            $user = $this->api->get('/me?fields='.$params)->getGraphUser();

            dd($user);

        } catch (FacebookSDKException $e) {

        }
    }

//    public function publishToProfile(Request $request){
//        try {
//            $response = $this->api->post('/me/feed', [
//                'message' => $request->message
//            ])->getGraphNode()->asArray();
//            if($response['id']){
//                // post created
//            }
//        } catch (FacebookSDKException $e) {
//            dd($e); // handle exception
//        }
//    }

    public function getPageAccessToken(){
        try {
            // Get the \Facebook\GraphNodes\GraphUser object for the current user.
            // If you provided a 'default_access_token', the '{access-token}' is optional.
            $response = $this->api->get('/me/accounts', env('FACEBOOK_ACCESS_TOKEN'));
        } catch(FacebookResponseException $e) {
            // When Graph returns an error
            echo 'Graph returned an error: ' . $e->getMessage();
            exit;
        } catch(FacebookSDKException $e) {
            // When validation fails or other local issues
            echo 'Facebook SDK returned an error: ' . $e->getMessage();
            exit;
        }

        try {
            $pages = $response->getGraphEdge()->asArray();
            foreach ($pages as $key) {
                if ($key['id'] == env('PAGE_ID')) {
                    return $key['access_token'];
                }
            }
        } catch (FacebookSDKException $e) {
            dd($e); // handle exception
        }
    }

    public function publishToPage($message){

        $page_id = env('PAGE_ID');

        try {
            $post = $this->api->post('/' . $page_id . '/feed', array('message' => $message), env('PAGE_ACCESS_TOKEN'));

            $post = $post->getGraphNode()->asArray();

            return str_replace("113317013705121_", "", $post['id']);

        } catch (FacebookSDKException $e) {
            Log::alert($e);
        }
    }

    public function publishToProfile(Request $request){
        $absolute_image_path = '/var/www/larave/storage/app/images/lorde.png';
        try {
            $response = $this->api->post('/me/feed', [
                'message' => $request->message,
                'source'    =>  $this->api->fileToUpload('/path/to/file.jpg')
            ])->getGraphNode()->asArray();

            if($response['id']){
                // post created
            }
        } catch (FacebookSDKException $e) {
            dd($e); // handle exception
        }
    }
}
