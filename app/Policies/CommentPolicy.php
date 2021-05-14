<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommentPolicy
{
    use HandlesAuthorization;

    public function update(User $user, Comment $comment)
    {
        if($user->id == $comment->user_id){
            return TRUE;
        }
        else{
            abort(sendError("Sorry, comment does not belong to this user!", 403));
        }
    }

    public function delete(User $user, Story $story)
    {
        if($user->id == $comment->user_id){
            return TRUE;
        }
        else{
            abort(sendError("Sorry, comment does not belong to this user!", 403));
        }
    }
}
