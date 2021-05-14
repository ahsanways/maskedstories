<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;

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

    public function publishToPage($message){

        try {
            $post = $this->api->post('/' . env('PAGE_ID') . '/feed', array('message' => $message), env('PAGE_ACCESS_TOKEN'));

            $post = $post->getGraphNode()->asArray();

            dd($post);

        } catch (FacebookSDKException $e) {
            dd($e);
        }
    }
}
