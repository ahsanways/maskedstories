<?php

namespace App\Policies;
use App\Models\Story;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StoryPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Story $story)
    {
        if($user->id == $story->user_id){
            return TRUE;
        }
        else{
            abort(sendError("Sorry, story does not belong to this user!", 403));
        }
    }

    public function update(User $user, Story $story)
    {
        if($user->id == $story->user_id){
            return TRUE;
        }
        else{
            abort(sendError("Sorry, story does not belong to this user!", 403));
        }
    }

    public function delete(User $user, Story $story)
    {
        if($user->id == $story->user_id){
            return TRUE;
        }
        else{
            abort(sendError("Sorry, story does not belong to this user!", 403));
        }
    }
}
