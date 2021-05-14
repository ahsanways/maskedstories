<?php

namespace App\Http\Resources;
use App\Helpers\Hasher;
use App\Http\Resources\User as UserResource;
use App\Http\Resources\Like as LikeResource;
use App\Http\Resources\Comment as CommentResource;
use App\Models\Like;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class Story extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => Hasher::encode($this->id),
            'user' => new UserResource($this->user),
            'title' => isset($this->title) ? $this->title : "A True Story",
            'story' => nl2br($this->story),
            'is_liked' => (Auth::guard('api')->user())
                ? Like::where([
                    ['user_id', '=', Auth::guard('api')->user()->id],
                    ['story_id', '=', $this->id]
                ])->exists()
                : filter_var(FALSE, FILTER_VALIDATE_BOOLEAN),
            'likes_count' => $this->likes()->count(),
            'comments_count' => $this->comments()->count(),
            'comments' => CommentResource::collection($this->comments()->latest()->limit(3)->get()),
            'post_link' => (isset($this->facebook_post_id)) ? 'https://www.facebook.com/'.env('PAGE_ID').'/posts/'.$this->facebook_post_id.'/' : null ,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at->diffForHumans(),
        ];
    }
}
