<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;

class DashboardController extends GraphController
{
    public function index(){
        return view('index');
    }

    public function privacyPolicy(){
        return view('privacyPolicy');
    }

    public function termsAndConditions(){
        return view('termsAndConditions');
    }

    public function deleteStory($encrypted_id)
    {
        $id = Crypt::decrypt($encrypted_id);

        $story = Story::find($id);

        if (isset($story)){
            $story->delete();
            return view('notify', ['message' => 'Story Deleted Successfully!']);
        }else{
            return view('notify', ['message' => 'Story Not Found!']);
        }
    }

    public function postStory($encrypted_id)
    {
        $id = Crypt::decrypt($encrypted_id);

        $story = Story::find($id);

        if (isset($story)){
            if(isset($story->facebook_post_id)){
                return view('notify', ['message' => 'Story Already Posted!']);
            }else{


                if (isset($story->title)){
                    $post = $story->title . " \n \n" . $story->story . " \n  \nfor more stories or to write your own visit: www.maskedstories.com";
                }
                else{
                    $post = $story->story . " \n  \nfor more stories or to write your own visit: www.maskedstories.com";
                }

                $story->facebook_post_id = $this->publishToPage($post);

                $story->save();

                return view('notify', ['message' => 'Story Posted to Facebook!']);
            }
        }else{
            return view('notify', ['message' => 'Story Not Found!']);
        }
    }

    public function removeUser($encrypted_id)
    {
        $id = Crypt::decrypt($encrypted_id);

        $user = User::find($id);

        if (isset($user)){
            $user->delete();
            return view('notify', ['message' => 'User Deleted Successfully!']);
        }else{
            return view('notify', ['message' => 'User Not Found!']);
        }
    }
}
